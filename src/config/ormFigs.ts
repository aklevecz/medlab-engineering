export const herokuConfig = () => ({
  name: "default",
  type: "postgres",
  synchronize: true,
  logging: true,
  url: process.env.DATABASE_URL
});

export const doConfig = () => ({
  name: "default",
  type: "postgres",
  synchronize: false,
  logging: false,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME
});

export const devConfig = () => ({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false
});
