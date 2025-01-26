//import { Favorites } from "./favorites.interface";

export interface OmdbResponse {
    Response: 'True' | 'False';
    Search?: any[];
    totalResults?: string;
    Error?: string;
  }