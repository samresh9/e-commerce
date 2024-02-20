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
import { OrderItem } from 'src/orders/entity/order-item.entity';
import { SearchService } from 'src/search/search.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private readonly searchService: SearchService,
  ) {}

  //creates new product
  async create(createProductDto: CreateProductDto) {
    // await this.searchService.createIndex();
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

    const savedProduct = await this.productRepository.save(product);
    //Indexed to ElasticSearch
    await this.searchService.indexProduct(savedProduct);
    return savedProduct;
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
  async findAll(page: number, pageSize: number): Promise<[Product[], number]> {
    const skip = (page - 1) * pageSize; //offset , it skips

    const [products, totalCount] = await this.productRepository.findAndCount({
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

    return [products, totalCount];
  }

  //update the product details
  async update(updateProductDto: UpdateProductDto, id: number) {
    const product = await this.productRepository.findOne({
      where: { id: id },
      relations: ['productImages'],
    });
    const { categoryId, images, ...updateProductData } = updateProductDto;
    const elasticUpdate: any = updateProductData;

    if (!product) throw new NotFoundException('Product Not Found');
    if (categoryId) {
      const category = await this.categoryRepository.findOneBy({
        id: updateProductDto.categoryId,
      });

      if (!category) throw new NotFoundException('Category Not Found');
      elasticUpdate.category = { ...category };
      product.category = category;
    }
    //Update images
    if (images) {
      const productImgs = images.map((url) =>
        this.productImageRepository.create({ url }),
      );
      const newProductImages =
        await this.productImageRepository.save(productImgs);
      product.productImages = [...product.productImages, ...newProductImages];
    }
    const savedProduct = this.productRepository.save({
      ...product,
      ...updateProductData,
    });
    await this.searchService.updateProduct(elasticUpdate, id);
    return savedProduct;
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

  async stockUpdate(orders: OrderItem[], cancelled?: boolean) {
    for (const order of orders) {
      const { quantity, product } = order;
      const prod = await this.findOne(product.id);
      if (cancelled) {
        prod.stock += quantity;
      } else {
        prod.stock -= quantity;
      }
      await this.productRepository.save(prod);
    }
  }

  async search(page: number, pageSize: number, text: string) {
    const skip = (page - 1) * pageSize; //offset , it skips
    const { count, results } = await this.searchService.searchProducts(
      skip,
      pageSize,
      text,
    );
    const totalCount = count;
    const totalPages = Math.ceil(totalCount / pageSize);
    if (page > totalPages) {
      throw new BadRequestException(
        `Invalid page number, should be less than or eqauls to ${totalPages}`,
      );
    }
    return { count, results };
  }
}
