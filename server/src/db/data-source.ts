import { DataSource, DataSourceOptions } from "typeorm";
import { Question } from "../models/question/model";
import { User } from "../models/user/model";
import { Result } from "../models/result/model";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [Question, User, Result],
  migrations: [__dirname + "/migrations/**/*.ts"],
  subscribers: [],
});

AppDataSource.initialize()
  .then(async () => {
    console.log("Database connected successfully!");
    const options = AppDataSource.options as any;
    console.log(`Connected to database: ${options.database} on ${options.host}:${options.port} as user ${options.username}`);
    console.log(`Current schema: public`);

    // Добавляем колонку name, если её нет
    try {
      await AppDataSource.query(`
        DO $$ 
        BEGIN 
          IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'user' 
            AND column_name = 'name'
          ) THEN 
            ALTER TABLE "user" ADD COLUMN "name" character varying NOT NULL DEFAULT 'Пользователь';
          END IF;
        END $$;
      `);
      console.log('Column name added or already exists');
    } catch (error: any) {
      if (error && error.message && error.message.includes('Connection terminated')) {
        // Не выводим ошибку, если соединение уже закрыто
      } else {
        console.error('Error adding name column:', error);
      }
    }
  })
  .catch((err) => console.error("Database connection error:", err));