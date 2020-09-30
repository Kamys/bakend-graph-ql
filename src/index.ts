import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import * as Express from 'express';
import { buildSchema } from 'type-graphql';
import { LibraryResolver } from './modeles/library/library.resolver';
import { getConnectionOptions } from 'typeorm';
import { Author } from './entity/author.entity';
import { Book } from './entity/book.entity';
import { safeCreateConnection } from './utils/safeCreateConnection';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const port = 3000;

const bootstrap = async () => {
  const ormOpts = (await getConnectionOptions()) as PostgresConnectionOptions;

  const connection = await safeCreateConnection(ormOpts);

  const bookRepository = connection.getRepository(Book);
  const authorRepository = connection.getRepository(Author);

  const author = new Author();
  author.name = 'Author 1';
  await authorRepository.manager.save(author);

  const author2 = new Author();
  author2.name = 'Author 2';
  await authorRepository.manager.save(author2);

  const book = new Book();
  book.name = 'Book 1';
  book.pageCount = 100;
  book.authors = [author, author2];
  await bookRepository.manager.save(book);

  const schema = await buildSchema({
    resolvers: [LibraryResolver],
  });
  const apolloServer = new ApolloServer({ schema });

  const app = Express();

  apolloServer.applyMiddleware({ app });

  app.listen(port, () => {
    console.log(`Create server on http://localhost:${port}/graphql`);
  });
};

bootstrap();
