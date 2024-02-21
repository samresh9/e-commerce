import { SearchTotalHits } from '@elastic/elasticsearch/lib/api/types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly esService: ElasticsearchService,
    private readonly configService: ConfigService,
    private readonly categoryService: CategoriesService,
  ) {}

  async createIndex() {
    const index = this.configService.get('ELASTICSEARCH_INDEX');
    const isIndex = await this.esService.indices.exists({ index });
    if (!isIndex) {
      await this.esService.indices.create({ index });
    }
  }

  async indexProduct(product: any) {
    const index = 'products';
    const document = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: {
        id: product.category.id,
        name: product.category.name,
        description: product.category.description,
      },
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
    return await this.esService.index({
      index,
      body: document,
    });
  }

  async searchProducts(
    offset: number,
    limit: number,
    text: string,
    minPrice: number,
    maxPrice: number,
  ) {
    const res = await this.esService.search({
      index: 'products',
      from: offset,
      size: limit,
      body: {
        query: {
          match: {
            name: text,
          },
        },
      },
    });
    const count = (res.hits.total as SearchTotalHits)?.value;
    const hits = res.hits.hits;
    const results = hits.map((item) => item._source);
    return { count, results };
  }

  async updateProduct(updateProductDto: any, id: number) {
    const { category, ...product } = updateProductDto;
    let categoryScript;
    if (category) {
      delete category.createdAt;
      delete category.updatedAt;
      categoryScript = Object.entries(category).reduce(
        (result, [key, value]) => {
          return `${result} ctx._source.category.${key}='${value}';`;
        },
        '',
      );
    }

    const script = Object.entries(product).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '');
    const combinedScript = category ? categoryScript + script : script;
    await this.esService.updateByQuery({
      index: 'products',
      body: {
        query: {
          match: {
            id: id,
          },
        },
        script: {
          source: combinedScript,
        },
      },
    });
  }
}
