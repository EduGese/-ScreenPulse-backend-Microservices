import mongoose, { Document, Types } from 'mongoose';

export interface Favorites extends Document {
  title: string;
  year: string;
  imdbID: string;
  type: string;
  poster: string;
  description?: string;
  descriptions?: mongoose.Types.ObjectId[];
  usersIds: Types.ObjectId[];
}