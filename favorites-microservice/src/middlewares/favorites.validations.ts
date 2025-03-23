import { Request, Response, NextFunction } from "express";
import { Favorites } from "../domain/interfaces/favorite.interface";
import axios from "axios";
import config from "../config/config";
import mongoose from "mongoose";

export function validateFavoritesBody(req: Request, res: Response, next: NextFunction): void {
  if (!req.body || typeof req.body !== "object") {
    res.status(400).json({ error: "A non-empty JSON body is required." });
    return;
  }

  const { imdbID, title, year, type, poster } = req.body as Partial<Favorites>;

  const errors: string[] = [];

  if (!imdbID || typeof imdbID !== "string") errors.push("Invalid or missing 'imdbID'");
  if (!title || typeof title !== "string") errors.push("Invalid or missing 'title'");
  if (!year || typeof year !== "string") errors.push("Invalid or missing 'year'");
  if (!type || typeof type !== "string") errors.push("Invalid or missing 'type'");
  if (!poster || typeof poster !== "string") errors.push("Invalid or missing 'poster'");

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }
  next();
}

export function validateId(req: Request, res: Response, next: NextFunction): void {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ error: "Invalid user ID format" });
    return;

  }
  next();
}

export async function validateUserExists(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.params.userId;
  try {
    await axios.get(`${config.users_microservice.url}/api/users/${userId}`);
    next(); 
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
       res.status(404).json({ error: "User not found" });
       return;
    }
    res.status(500).json({ error: "Error connecting to users microservice" });
  }
}
