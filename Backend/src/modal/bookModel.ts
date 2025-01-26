import { Schema, model } from 'mongoose';
import { IBookDocument } from '../types/bookType';

const bookSchema = new Schema<IBookDocument>(
  {
    title: { type: String, required: true},
    description: { type: String, required: true },
    author: { type: String, required: true},
    year: { type: Number, required: true },
    isbn: { type: Number, required: true},
    genre: { type: String, required: true },
    thumbnail: { type: String, required: true },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },

  },
  { timestamps: true }
);

export const BookModel = model<IBookDocument>('Book', bookSchema);
