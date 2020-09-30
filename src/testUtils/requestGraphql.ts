import { graphql, GraphQLSchema } from 'graphql';

import { buildSchema } from 'type-graphql';
import { LibraryResolver } from '../modeles/library/library.resolver';

interface Options {
  source: string;
  variableValues?: {
    [key: string]: any;
  };
  userId?: number;
}

let schema: GraphQLSchema;

export const requestGraphql = async ({ source, variableValues }: Options) => {
  if (!schema) {
    schema = await buildSchema({
      resolvers: [LibraryResolver],
    });
  }
  return graphql({
    schema,
    source,
    variableValues,
  });
};
