import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiConsumes, ApiOperation, ApiBody } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ImageValidationPipe } from './pipe/image-validation.pipe';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(
    private readonly productService: ProductsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create New Product With Images' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateProductDto,
  })
  @UseInterceptors(FilesInterceptor('files'))
  async createProduct(
    @UploadedFiles(new ImageValidationPipe())
    files: Express.Multer.File[],
    @Body() createProductDto: CreateProductDto,
  ) {
    const images = await Promise.all(this.cloudinaryService.uploadFile(files));
    createProductDto.images = images;
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Product Created',
      data: await this.productService.create(createProductDto),
    };
  }

  @Get()
  async getAllProduct() {
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Success',
      data: await this.productService.findAll(),
    };
  }

  @Get(':id')
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: await this.productService.findOne(id),
    };
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UpdateProductDto,
  })
  @UseInterceptors(FilesInterceptor('files'))
  async update(
    @UploadedFiles(new ImageValidationPipe())
    files: Express.Multer.File[],
    @Body() updateProductDto: UpdateProductDto,
    @Param('id') id: string,
  ) {
    const images = await Promise.all(this.cloudinaryService.uploadFile(files));
    updateProductDto.images = images;
    return {
      statusCode: HttpStatus.OK,
      message: 'Product Updated',
      data: await this.productService.update(updateProductDto, parseInt(id)),
    };
  }

  @Delete(':id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Product Deleted',
      data: await this.productService.removeProduct(id),
    };
  }

  @Get(':id/images')
  async getImagesByProduct(@Param('id', ParseIntPipe) id: number) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: await this.productService.findImages(id),
    };
  }
}
