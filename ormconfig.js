// ormconfig.js в корневой директории проекта

// Используем require вместо import
const dotenv = require('dotenv');
const { DataSource } = require('typeorm'); // Импортируем класс DataSource

// Загружаем переменные окружения
dotenv.config();

const config = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "mydatabase",
  synchronize: false, // Отключено
  logging: false,
  // Пути к сущностям: TypeORM CLI сам загрузит их по этому шаблону
  entities: [
      './server/src/models/**/*.ts'
      // Если вы компилируете TS в JS: './server/dist/models/**/*.js'
  ],
   // Пути к миграциям: TypeORM CLI сам загрузит их по этому шаблону
  migrations: ['./server/src/db/migrations/**/*.ts'],
  subscribers: [],
};

// Экспортируем экземпляр DataSource, используя объект конфигурации
module.exports = new DataSource(config);
