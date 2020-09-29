import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as Express from "express";
import { buildSchema } from "type-graphql";
import {LibraryResolver} from "./modeles/library/library.resolver";
import { createConnection } from "typeorm";

const port = 3000;

const bootstrap = async () => {

    await createConnection();

    const schema = await buildSchema({
        resolvers: [LibraryResolver]
    });

    const apolloServer = new ApolloServer({ schema });

    const app = Express();

    apolloServer.applyMiddleware({ app });

    app.listen(port, () => {
        console.log(`Create server on http://localhost:${port}/graphql`);
    });
};

bootstrap();