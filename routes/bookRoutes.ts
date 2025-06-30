import { Router } from "express";
import { getBooks, addBook, addReview, getReview } from "../controllers/bookControllers";

const router = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *           example: "The Great Gatsby"
 *         author:
 *           type: string
 *           example: "F. Scott Fitzgerald"
 *         genre:
 *           type: string
 *           example: "Fiction"

 *     Review:
 *       type: object
 *       properties:
 *         reviewText:
 *           type: string
 *           example: "A moving and unforgettable story."
 *         rating:
 *           type: number
 *           format: float
 *           example: 4.5
 */

//
// GET /books
//
/**
 * @openapi
 * /books:
 *   get:
 *     summary: Retrieve a list of books
 *     description: Returns all books in the system.
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get("/", getBooks as any);

//
// POST /books
//
/**
 * @openapi
 * /books:
 *   post:
 *     summary: Add a new book
 *     description: Creates a new book entry in the database.
 *     tags:
 *       - Books
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - genre
 *             properties:
 *               title:
 *                 type: string
 *                 example: "To Kill a Mockingbird"
 *               author:
 *                 type: string
 *                 example: "Harper Lee"
 *               genre:
 *                 type: string
 *                 example: "Classic"
 *     responses:
 *       201:
 *         description: Book added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 */
router.post("/", addBook as any);

//
// GET /books/{id}/review
//
/**
 * @openapi
 * /books/{id}/review:
 *   get:
 *     summary: Get reviews for a book
 *     description: Fetches all reviews associated with a specific book.
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the book
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book: The Great Gatsby"
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *       404:
 *         description: Book not found or no reviews
 */
router.get("/:id/review", getReview as any);

//
// POST /books/{id}/review
//
/**
 * @openapi
 * /books/{id}/review:
 *   post:
 *     summary: Add a review to a book
 *     description: Submits a new review for the specified book.
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the book
 *         schema:
 *           type: integer
 *           example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reviewText
 *               - rating
 *             properties:
 *               reviewText:
 *                 type: string
 *                 example: "Absolutely loved it! A must-read."
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4.8
 *     responses:
 *       201:
 *         description: Review added successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Book not found
 */
router.post("/:id/review", addReview as any);

export default router;
