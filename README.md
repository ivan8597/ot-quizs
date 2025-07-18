# OT Quiz — Система тестирования по охране труда

## Описание

Веб-приложение для тестирования знаний сотрудников по охране труда.

**Стек:**  
- Frontend: React (TypeScript)  
- Backend: Node.js, Express, TypeORM  
- База данных: PostgreSQL

## Возможности

- Регистрация и авторизация пользователей
- Прохождение теста с рандомными вопросами
- Сохранение и просмотр истории результатов
- Скачивание результатов в PDF
- Отображение правильных/неправильных ответов, ссылок на НТД
- Админ-функции (добавление/редактирование вопросов через сиды)

## Быстрый старт

### 1. Клонирование репозитория

```bash
git clone https://github.com/ivan8597/ot-quizs.git
cd ot-quizs
```

### 2. Настройка backend

- Перейдите в папку `server`
- Скопируйте пример файла `.env` для backend:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=ot_quiz_user
DB_PASSWORD=secure_password
DB_NAME=ot_quiz
JWT_SECRET=mysupersecretkey123

``` в `.env` и укажите параметры подключения к PostgreSQL
- Установите зависимости:
  ```bash
  cd server
  npm install
  ```
- Запустите миграции и сиды:
  ```bash
  npm run typeorm migration:run
  npm run seed
  ```
- Запустите сервер:
  ```bash
  npm run dev
  ```

### 3. Настройка frontend

- Перейдите в папку `frontend`
- Установите зависимости:
  ```bash
  cd ../frontend
  npm install
  ```
- Запустите приложение:
  ```bash
  npm start
  ```

### 4. Открытие приложения

- Перейдите в браузере по адресу: [http://localhost:3000](http://localhost:3000)

## Структура проекта

```
.
├── frontend/      # React-приложение
├── server/        # Node.js backend (Express, TypeORM)
├── .gitignore
└── README.md
```



## Миграции

Для управления структурой базы данных используются миграции TypeORM.

**Выполнить все миграции:**
```bash
cd server
npm run typeorm migration:run
```

**Создать новую миграцию:**
```bash
npm run typeorm migration:generate -- -n MigrationName
```

**Откатить последнюю миграцию:**
```bash
npm run typeorm migration:revert
```

---

## Сиды (наполнение тестовыми вопросами)

Сиды позволяют автоматически наполнить базу данных начальными вопросами и тестовыми данными.

**Запустить сиды:**
```bash
cd server
npm run seed
```

- Сид-файлы находятся в `server/src/db/seeds/`
- Вы можете редактировать или добавлять вопросы в файле `questions.ts`

---

## Администрирование (добавление/редактирование вопросов)

- Вопросы для теста добавляются и редактируются через сид-файлы (`server/src/db/seeds/questions.ts`).
- После изменения сидов для обновления вопросов выполните:
  1. Очистите таблицу вопросов вручную или через миграцию/скрипт (если требуется).
  2. Запустите сиды снова:  
     ```bash
     npm run seed
     ```
- В текущей версии веб-интерфейса для администрирования нет — все изменения делаются через код и сиды.

