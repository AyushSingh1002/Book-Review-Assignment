// src/db/data-source.ts
import { DataSource } from "typeorm";
import { Book } from "../models/Book";
import { Review } from "../models/Review";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "ayush2006",
  database: "book_reviews",
  synchronize: true,
  logging: false,
  entities: [Book, Review],
});
