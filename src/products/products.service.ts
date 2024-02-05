import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entity/category.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductImage } from './entity/product-image.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  //creates new product
  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryRepository.findOne({
      where: { id: createProductDto.categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category Not found');
    }
    const product = this.productRepository.create({
      name: createProductDto.name,
      description: createProductDto.description,
      price: createProductDto.price,
      stock: createProductDto.stock,
      category,
    });
    //if images are given
    if (createProductDto.images) {
      const productImgs = createProductDto.images.map((url) =>
        this.productImageRepository.create({ url }),
      );
      const productImages = await this.productImageRepository.save(productImgs);
      product.productImages = productImages;
    }

    return this.productRepository.save(product);
  }

  //finds one product by its id
  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      select: {
        category: {
          id: true,
          name: true,
        },
      },
      where: { id: id },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException('Product Not Found');
    }
    return product;
  }

  //finds all product with category detail and images
  async findAll(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize; //offset , it skips
    const [users, totalCount] = await this.productRepository.findAndCount({
      order: {
        id: 'ASC',
      },
      skip,
      take: pageSize,
      relations: ['category', 'productImages'],
    });
    const totalPages = Math.ceil(totalCount / pageSize);
    if (page > totalPages) {
      throw new BadRequestException(
        `Invalid page number, should be less than or eqauls to ${totalPages}`,
      );
    }

    return [users, totalCount];
  }

  //update the product details
  async update(updateProductDto: UpdateProductDto, id: number) {
    const product = await this.productRepository.findOne({
      where: { id: id },
      relations: ['productImages'],
    });

    if (!product) throw new NotFoundException('Product Not Found');
    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOneBy({
        id: updateProductDto.categoryId,
      });

      if (!category) throw new NotFoundException('Category Not Found');

      product.category = category;
    }
    //Update images
    if (updateProductDto.images) {
      const productImgs = updateProductDto.images.map((url) =>
        this.productImageRepository.create({ url }),
      );
      const newProductImages =
        await this.productImageRepository.save(productImgs);
      product.productImages = [...product.productImages, ...newProductImages];
    }
    return this.productRepository.save({ ...product, ...updateProductDto });
  }

  //delete the product
  async removeProduct(id: number) {
    const product = await this.findOne(id);
    return this.productRepository.remove(product);
  }

  //find images of the product
  async findImages(id: number) {
    const images = await this.productRepository.findOne({
      select: {
        id: true,
      },
      where: { id },
      relations: ['productImages'],
    });
    return images;
  }
}
