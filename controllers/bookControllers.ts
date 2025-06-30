// src/controllers/bookController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../database/data";
import { Book } from "../models/Book";
import { redis } from "../cache/redis";
import { Review } from "../models/Review";

// ✅ GET /books
export const getBooks = async (req: Request, res: Response) => {
  try {
    console.log("📦 Fetching from Redis...");
    const cached = await redis.get("books");

    if (cached) {
      console.log("✅ Returning cached books");
      return res.json(JSON.parse(cached));
    }

    const repo = AppDataSource.getRepository(Book);
    const books = await repo.find();

    await redis.set("books", JSON.stringify(books), "EX", 3600); // cache for 1 hour
    console.log("🗃️ Books cached in Redis");

    return res.json(books);
  } catch (err) {
    console.error("❌ getBooks error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// ✅ POST /books
export const addBook = async (req: Request, res: Response) => {
  try {
    const { bookId, author, title } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: "Missing title or author" });
    }

    const bookRepo = AppDataSource.getRepository(Book);

    const book = await bookRepo.findOne({ where: { id: bookId } });
    if (book) {
      return res.status(400).json({ message: "Book already exists" });
    }

    const newBook = bookRepo.create({ title, author });
    await bookRepo.save(newBook);

    await redis.del("books"); // Invalidate book list cache
    console.log("🗑️ Redis cache invalidated (books)");

    res.status(201).json({ message: "Book added", book: newBook });
  } catch (error) {
    console.error("❌ addBook error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ POST /books/:id/reviews
export const addReview = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const { reviewText, rating } = req.body;

    if (!reviewText || typeof rating !== "number") {
      console.log(reviewText, typeof rating)
      return res.status(400).json({ message: "Missing reviewText or rating" });
    }

    const bookRepo = AppDataSource.getRepository(Book);
    const reviewRepo = AppDataSource.getRepository(Review);

    const book = await bookRepo.findOne({ where: { id } });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const newReview = reviewRepo.create({ reviewText, rating, book });
    await reviewRepo.save(newReview);

    await redis.del(`review:${book.id}`);
    console.log("🗑️ Cache invalidated after new review added");

    res.status(201).json({ message: "Review added", review: newReview });
  } catch (error) {
    console.error("❌ addReview error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ GET /books/:id/reviews
export const getReview = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const cacheKey = `review:${id}`;
    console.log("🔍 Fetching review from Redis...");
    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log("✅ Returning cached review");
      return res.json(JSON.parse(cached));
    }

    const bookRepo = AppDataSource.getRepository(Book);
    const reviewRepo = AppDataSource.getRepository(Review);

    const book = await bookRepo.findOne({ where: { id } });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const reviews = await reviewRepo.find({ where: { book: { id } } });

    if (reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this book" });
    }

    const formatted = reviews.map((review) => ({
      reviewText: review.reviewText,
      rating: review.rating,
    }));

    const responseData = {
      message: `Book: ${book.title}`,
      reviews: formatted,
    };

    await redis.set(cacheKey, JSON.stringify(responseData), "EX", 3600); // cache for 1 hour
    console.log("✅ Review cached in Redis");

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("❌ getReview error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
