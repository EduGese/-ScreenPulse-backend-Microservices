import { Types } from "mongoose";
import { Favorites } from "../domain/interfaces/favorite.interface";
import favoritesSchema from "../domain/models/favorites.model";
import axios from "axios";
import config from "../config/config";


export function validateInputs(userId: string, movie: Favorites) {
  if (typeof userId !== "string" || !userId) throw new Error("Invalid userId input type");
  if (!movie) throw new Error("Invalid movie input type");//if(!is<Favorites>(movie)) throw new Error("Invalid input type");//INVESTIGAR-->https://github.com/samchon/typia?tab=readme-ov-file
}

export async function doesUserExist(userId: string): Promise<boolean> {
  try {
    const response = await axios.get(`${config.users_microservice.url}/api/users/${userId}`);
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return false;
    }
    console.error("Error connecting to users microservice:", error);
    throw new Error("Error connecting to users microservice");
  }
}

export async function findFavoriteByImdbId(imdbID: string): Promise<Favorites | null> {
  return favoritesSchema.findOne({ imdbID });
}

export async function addUserToFavorite(favorite: Favorites, userId: string): Promise<Favorites> {
    const userIdObjectId = convertToObjectId(userId);
  if (!favorite.usersIds.includes(userIdObjectId)) {
    favorite.usersIds.push(userIdObjectId);
    await favorite.save();
  } else {
    throw new Error("Favorite already exists for this user");
  }
  return favorite;
}

export function convertToObjectId(id: string): Types.ObjectId {
  return new Types.ObjectId(id);
}