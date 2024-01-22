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
  UploadedFile,
  ValidationPipe,
  ParseIntPipe,
  UsePipes,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiConsumes, ApiOperation, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { TestDto } from './dto/test.dto';
import { ToNumberPipe } from './parse-int.pipe';

@Controller('products')
@ApiTags('Products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Product Created',
      data: await this.productService.create(createProductDto),
    };
  }

  // route for testing the file uploads
  @Post('upload')
  @ApiOperation({ summary: 'Upload a file with additional form data' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('files'))
  @UsePipes(ToNumberPipe)
  async upload(
    // @Body('number', ParseIntPipe) number: number,
    @UploadedFile() files: Express.Multer.File,
    @Body() formdata: TestDto,
  ) {
    formdata.files = files;
    console.log(formdata, 'fromdata');
    console.log(files);
    console.log(typeof formdata);
    return formdata;
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
  async getProductById(@Param('id') id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: await this.productService.findOne(parseInt(id)),
    };
  }

  @Put(':id')
  async update(
    @Body() updateProductDto: UpdateProductDto,
    @Param('id') id: string,
  ) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Product Updated',
      data: await this.productService.update(updateProductDto, parseInt(id)),
    };
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Product Deleted',
      data: await this.productService.removeProduct(parseInt(id)),
    };
  }

  // @Post("/")
}
