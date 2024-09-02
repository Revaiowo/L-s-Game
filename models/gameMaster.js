import mongoose from 'mongoose';
import { Base } from './base.js';

const gameMasterSchema = new mongoose.Schema({

    game: {
        type: Boolean,
        required: true
    },

    channelId: {
        type: Number,
        required: true
    },

    phase: {
        type: String,
        required: true,
    },

    remark: {
        type: String,
        required: true,
        default : 'none'
    },

    LDies: {
        type: String,
        reqired: true,
        default: false
    },

    nearDies: {
        type: Boolean,
        required: true,
        default: false
    },

    kiraDies: {
        type: Boolean,
        required: true,
        default: false
    },

    gameRound: {
        type: Number,
        required: true,
    },

    troubleshoot: {
        type: Boolean,
        required: true,
        default: false
    }
}); 

export const GameMaster =  Base.discriminator('players', gameMasterSchema);
