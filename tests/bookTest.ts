// src/tests/book.test.ts
import request from "supertest";
import app from "../index";
import { AppDataSource } from "../database/data";


beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});
describe("Books API", () => {
  it("should return all books", async () => {
    const res = await request(app).get("/books");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should return all review", async () => {
    const res = await request(app).get("/books/1/review");
    expect(res.statusCode).toEqual(200);
  });
});
