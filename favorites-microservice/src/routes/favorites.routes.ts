import express from 'express';
import favoritesController from "../controllers/favorites.controller";


const router = express.Router();

//Create 
router.post('/favorites/:id', favoritesController.createFavorite);

// //Get all
// router.get('/favorites/:id', favoritesController.getFavorites);

// //Delete by Id
// router.delete('/favorites/:id/:userId', favoritesController.deleteFavorite);

// //Update by Id
// router.put('/favorites/:id/:userId', favoritesController.updateFavorite);

export default router;