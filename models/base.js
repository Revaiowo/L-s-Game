import mongoose from "mongoose";

const baseSchema = new mongoose.Schema({

    createdAt: { 
        type: Date, 
        default: Date.now
    },
}, 
{ discriminatorKey: 'type', collection: 'games' }
); 

export const Base =  mongoose.model('games', baseSchema);
