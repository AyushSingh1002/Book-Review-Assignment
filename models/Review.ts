// src/models/Review.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from "typeorm";
import { Book } from "./Book";

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  bookId: number;

  @Column()
  reviewText: string;

  @Column()
  rating: number;

  @ManyToOne(() => Book, (book) => book.reviews)
  book: Book;
}
