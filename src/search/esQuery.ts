export interface EsQuery {
  index: string;
  from: number;
  size: number;
  body: {
    query: {
      bool: {
        must: {
          multi_match: {
            query: string;
            fields: string[];
          };
        };
        filter: {
          range: {
            price: {
              gte: number | undefined;
              lte: number | undefined;
            };
          };
        };
      };
    };
    sort?: {
      [key: string]: {
        order: string;
      };
    };
  };
}
