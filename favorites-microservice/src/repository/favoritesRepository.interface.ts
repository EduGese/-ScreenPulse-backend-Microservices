import { Favorites } from "../domain/interfaces/favorite.interface";

export interface FavoritesRepository {
  findById(imdbID: string): Promise<Favorites | null>;
  findOrCreate(movie: Favorites): Promise<Favorites>;
  addFavoriteForUser(favoriteId: string, userId: string): Promise<Favorites>;
}