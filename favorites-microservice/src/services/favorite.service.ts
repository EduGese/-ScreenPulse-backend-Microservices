import { ObjectId, Types } from "mongoose";
import { Favorites } from "../interfaces/favorite.interface";
import favoritesSchema from "../model/favorites.model";
//import userSchema from "../../models/user";
import descriptionSchema from "../model/description.model";
//import { is } from 'typescript-is';

class FavoritesService {
  async createFavorite(userId: string, movie: Favorites): Promise<any> {
    if( typeof userId !== 'string') throw new Error("Invalid input type");
    //if(!is<Favorites>(movie)) throw new Error("Invalid input type");INVESTIGAR-->https://github.com/samchon/typia?tab=readme-ov-file
    const user = await userSchema.findById(userId); //Comprobacion si existe el usuario
    if (!user) {
      throw new Error("User not found");
    }

    let favorite;

    // Verificar si el favorito ya existe en la colección
    const existingFavorite = await favoritesSchema.findOne({
      imdbID: movie.imdbID,
    });
    const userIdObjectId = new Types.ObjectId(userId);//Conversion a type ObjectId
    if (!existingFavorite) {
      // Si el favorito no existe, lo creamos y lo añadimos a la lista de favoritos del usuario
      movie.user = [userIdObjectId];//Se añade el id del usuario al array de user que todavia no existe en este objeto
      favorite = await favoritesSchema.create(movie);
      user.favorites.push(favorite._id);
    } else {
      // Si el favorito ya existe, verificamos si está en la lista de favoritos del usuario
      if (user.favorites.includes(existingFavorite._id)) {
        throw new Error("Favorite already exists for this user");
      }
      // Si no está en la lista de favoritos del usuario, lo añadimos
      user.favorites.push(existingFavorite._id);
      favorite = existingFavorite;
      existingFavorite.user.push(userIdObjectId);//Actualiza el array de referencias de favorites con el id del usuario
      await existingFavorite.save();
    }

    await user.save();
    return favorite;
  }


  async getFavorites(userId: string): Promise<any> {
    if( typeof userId !== 'string') throw new Error("Invalid input type");
    const user = await userSchema.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const favorites = await favoritesSchema.find({ user: userId });
    if (!favorites || favorites.length === 0) {
      throw new Error("Not favorites saved");
    }

    // Para cada favorito, encontrar su descripción asociada y agregarla al objeto favorito
    for (const favorite of favorites) {
      const description = await descriptionSchema.findOne({ userId, favoriteId: favorite._id });
      if (description) {
        favorite.description = description.description;
      } else {
        favorite.description = ''; // Opcional: si no hay descripción, establecerla como cadena vacía
      }
    }
    return favorites;
  }


  async deleteFavorite(movieId: string, userId: string): Promise<any> {
    if(typeof movieId !== 'string' || typeof userId !== 'string') throw new Error("Invalid input type");

    const user = await userSchema.findById(userId);
    if(!user){
      throw new Error("User not found");
    }
    /*Eliminar movie del array de favorites del usuario y actualizar*/ 
    const favoritesArray = user.favorites.filter(favorite => favorite.toString() !== movieId);
    user.favorites = favoritesArray;
    await user.save();


     const favorite = await favoritesSchema.findById(movieId);
    if(!favorite){
      throw new Error("Server error.Favorite not found");
    }
    
    /*Eliminar el id del usuario del array de id's de la movie y actualizar */
    const usersArray =  favorite.user.filter((user: { toString: () => string; }) => user.toString() !== userId);
    favorite.user = usersArray;
    await favorite.save();

    /* Eliminar el favorito de la coleccion favorites, si no es favorito de ningun usuario mas*/
     const favoriteUsers = favorite.user.length;
    if(favoriteUsers === 0){
      await favoritesSchema.findByIdAndDelete(movieId);
    }
  }


  async updateFavorite(movieId: string, userId:string, description: string): Promise<any> {
     console.log('description',description);
     if(typeof movieId !== 'string' || typeof userId !== 'string' || typeof description !== 'string') throw new Error("Invalid input type");
     if(description.length > 200) throw new Error("Description is too long");

     // Buscar o crear la descripción para el usuario y la película específicos
     let existingDescription = await descriptionSchema.findOne({ userId, favoriteId: movieId });
     if (!existingDescription) {
         existingDescription = await descriptionSchema.create({
             userId: new Types.ObjectId(userId),
             favoriteId: new Types.ObjectId(movieId),
             description: description,
         });
     } else {
         // Si la descripción ya existe, actualizar su valor
         existingDescription.description = description;
         await existingDescription.save();
     }

     // Agregar la referencia de la descripción al array 'descriptions' en el documento de la película favorita
     const updatedResult = await favoritesSchema.findByIdAndUpdate(movieId, { $addToSet: { descriptions: existingDescription._id } });
     if(!updatedResult){
       throw new Error("Failed to update favorite");
     }
     return updatedResult; 
  }

  
  async getDescriptions(userId: string, favoriteId: string): Promise<any> {
    const descriptions = await descriptionSchema.find({ userId, favoriteId });
    return descriptions; // Devolver las descripciones encontradas o una lista vacía si no hay ninguna.
  } 
  
  }


export default new FavoritesService();
