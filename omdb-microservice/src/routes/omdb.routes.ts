import express from 'express';
import omdbController from '../controllers/omdb.controller';


const router= express.Router();


//Get all Movies from omdb API
router.post('/omdb', omdbController.getOmdbMovies);

//Get movie info from omdb API
router.get('/omdb/:id', omdbController.getMovieInfo);


export default router;