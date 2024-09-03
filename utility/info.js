import { ConnectionService } from "discord.js";
import { Player } from "../models/player.js";

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function template1(x, y) {

    return `${x} is ${y}.`;
};

function template2(x, y, z) {
  
    return `Either ${x} or ${y} is ${z}.`;
};

function template3(x, y, z) {
  
    return `Neither ${x} nor ${y} is ${z}.`;
};

export const  distributeInfo = async (playersInfo) => {

    const invArray = await Player.find({ role: 'Investigator' });
    const invNames = invArray.map(inv => (inv.gameName));

    const kwArray = await Player.find({ role: 'Kira Worshipper' });
    const kwNames = kwArray.map(kw => (kw.gameName));

    const LObj = await Player.findOne({ role: 'L' });
    const LName = LObj.gameName;

    const kiraObj = await Player.findOne({ role: 'Kira' });
    const kiraName = kiraObj.gameName;

    console.log(invNames);
    console.log(kwNames);
    console.log(LName);
    console.log(kiraName);

    invNames.push(LName, kiraName);
    kwNames.push(LName, kiraName);

    const finalInfo = [{}];

    for (const player of playersInfo) {

        if (player.role === 'Investigator') {

            finalInfo.push({ name: player.gameName });
        }

        else if (player.role === 'Kira Worshipper') {

        }
    }
 
};