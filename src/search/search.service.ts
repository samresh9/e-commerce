import { SearchTotalHits } from '@elastic/elasticsearch/lib/api/types';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { CategoriesService } from 'src/categories/categories.service';
import { EsQuery } from './esQuery';

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
    minPrice?: number,
    maxPrice?: number,
    orderBy?: string,
  ) {
    // const query = {
    //   bool: {
    //     must: {
    //       multi_match: {
    //         query: text,
    //         field: ['name', 'description'],
    //       },
    //     },
    //   },
    // };
    // if (minPrice !== undefined && maxPrice !== undefined) {
    //   query.bool.filter ={
    //     {
    //       range: {
    //         price: {
    //           gte: minPrice,
    //           lte: maxPrice,
    //         },
    //       },

    //   }
    // }

    const esQuery: EsQuery = {
      index: 'products',
      from: offset,
      size: limit,
      body: {
        query: {
          bool: {
            must: {
              multi_match: {
                query: text,
                fields: ['name', 'description'],
              },
            },
            filter: {
              range: {
                price: {
                  gte: minPrice, // if min and max price are undefined then elastic search will igonre them in filter and wont thorw error
                  lte: maxPrice,
                },
              },
            },
          },
        },
      },
    };

    if (orderBy) {
      esQuery.body.sort = {
        price: {
          order: orderBy,
        },
      };
    }

    const res = await this.esService.search(esQuery);
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
          term: {
            id: id,
          },
        },
        script: {
          source: combinedScript,
        },
      },
    });
  }

  async remove(id: number) {
    await this.esService.deleteByQuery({
      index: 'products',
      body: {
        query: {
          term: {
            id: id,
          },
        },
      },
    });
  }

  async stockUpdate(newStock: number, productId: number) {
    await this.esService.updateByQuery({
      index: 'products',
      body: {
        query: {
          term: {
            id: productId,
          },
        },
        script: {
          source: 'ctx._source.quantity = params.newStock;',
          params: { newStock },
        },
      },
    });
  }
}
