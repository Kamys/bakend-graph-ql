import { createDatabase } from 'pg-god';
import { createConnection, Connection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

let conn: Connection | undefined;

const getPassword = async (
  ormOpts: PostgresConnectionOptions,
): Promise<string | undefined> => {
  const isUndefined = typeof ormOpts.password === 'undefined';

  if (isUndefined) {
    return undefined;
  }

  if (typeof ormOpts.password === 'string') {
    return ormOpts.password;
  }

  return ormOpts.password && (await ormOpts.password());
};

//  await getConnectionOptions() as PostgresConnectionOptions

export const safeCreateConnection = async (
  ormOpts: PostgresConnectionOptions,
): Promise<Connection> => {
  if (conn) {
    return conn;
  }

  try {
    conn = await createConnection(ormOpts);
    return conn;
  } catch (error) {
    if (error.code === '3D000') {
      // Database doesn't exist.
      // PG error code ref: https://docstore.mik.ua/manuals/sql/postgresql-8.2.6/errcodes-appendix.html
      if (!ormOpts.database) {
        throw Error(error);
      }

      const password = await getPassword(ormOpts);

      await createDatabase(
        { databaseName: ormOpts.database },
        {
          user: ormOpts.username,
          port: ormOpts.port,
          host: ormOpts.host,
          password,
        },
      );
      return createConnection();
    }
    throw error;
  }
};
