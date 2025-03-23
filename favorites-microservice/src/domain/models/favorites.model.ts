import mongoose, { Schema } from 'mongoose';
import { Favorites } from '../interfaces/favorite.interface';

const favoritesSchema: Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    imdbID: {
        type: String,
        unique: true,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    poster: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },

    descriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Description'
    }],
    usersIds: [
        {
            type: mongoose.Types.ObjectId,
            required: true
        }
    ]
});


export default mongoose.model<Favorites>('Favorites', favoritesSchema);

