import { Favorites } from "../domain/interfaces/favorite.interface";
import favoritesSchema from "../domain/models/favorites.model";
import { FavoritesRepository } from "./favoritesRepository.interface";
import { Types } from "mongoose";

class MongoFavoritesRepository implements FavoritesRepository {
  async findById(imdbID: string): Promise<Favorites | null> {
    return favoritesSchema.findOne({ imdbID });
  }

  async findOrCreate(movie: Favorites): Promise<Favorites> {
    return await favoritesSchema.findOneAndUpdate(
      { imdbID: movie.imdbID }, 
      { $setOnInsert: movie },
      { upsert: true, new: true }
    );
  }

  async addFavoriteForUser(favoriteId: string, userId: string): Promise<Favorites> {
    const userIdObjectId = new Types.ObjectId(userId);

    const favorite = await favoritesSchema.findOneAndUpdate(
      { _id: favoriteId, usersIds: { $ne: userIdObjectId } }, 
      { $addToSet: { usersIds: userIdObjectId } },
      { new: true } 
    );

    if (!favorite) {
      throw new Error("Favorite already exists for this user");
    }

    return favorite;
  }
}

export default new MongoFavoritesRepository();