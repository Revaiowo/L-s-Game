import mongoose from 'mongoose';
import { Base } from './base.js';

const gameMasterSchema = new mongoose.Schema({

    game: {
        type: Boolean,
        required: true
    },

    channelId: {
        type: String,
        required: true
    },

    phase: {
        type: String,
        required: true,
        default: 'join'
    },

    remark: {
        type: String,
        required: true,
        default : 'none'
    },

    LDies: {
        type: Boolean,
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
        default: 1
    },

    troubleshoot: {
        type: Boolean,
        required: true,
        default: false
    }
}); 

export const GameMaster =  Base.discriminator('gameMaster', gameMasterSchema);
