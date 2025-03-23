import express from 'express';
import favoritesController from "../controllers/favorites.controller";
import { validateFavoritesBody, validateId, validateUserExists } from '../middlewares/favorites.validations';


const router = express.Router();

//Create 
router.post('/favorites/:userId', validateId, validateUserExists, validateFavoritesBody,  favoritesController.addFavorite);

// //Get all
//router.get('/favorites/:user_id', favoritesController.getFavorites);

// //Delete by Id
// router.delete('/favorites/:id/:userId', favoritesController.deleteFavorite);

// //Update by Id
// router.put('/favorites/:id/:userId', favoritesController.updateFavorite);

export default router;