import mongoose from 'mongoose';
import { Base } from './base.js';

const playerSchema = new mongoose.Schema({

    playerId: {
        type: String,
        required: true,
    },

    playerName: {
        type: String,
        required: true
    },

    gameName: {
        type: String,
        required: true
    },

    isAlive: {
        type: Boolean,
        required: true
    },

    role: {
        type: String,
        required: true,
    },

    item: {
        type: String,
        required: true,
    },

    info: {
        type: String,
        required: true,
    },

    canUseItem: {
        type: Boolean,
        required: true,
    },
}); 

export const Player =  Base.discriminator('player', playerSchema);
