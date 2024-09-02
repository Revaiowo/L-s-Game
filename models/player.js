import mongoose from 'mongoose';
import { Base } from './base.js';

const playerSchema = new mongoose.Schema({

    userId: {
        type: Number,
        required: true,
    },

    userName: {
        type: String,
        required: true
    },

    gameName: {
        type: String,
        required: true
    },


}); 

export const Player =  Base.discriminator('players', playerSchema);
