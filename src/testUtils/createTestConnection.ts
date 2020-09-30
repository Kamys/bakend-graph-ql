import { safeCreateConnection } from "../utils/safeCreateConnection";

type CreateTestConnectionParams = {
    dropSchema: boolean
}

// TODO: Extract db credential to .env

export const createTestConnection = ({ dropSchema }: CreateTestConnectionParams) => {
    return safeCreateConnection({
        name: "default",
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "root",
        password: "123456",
        database: "library-test",
        dropSchema: dropSchema,
        synchronize: true,
        entities: ["src/entity/*.entity.ts"]
    });
};