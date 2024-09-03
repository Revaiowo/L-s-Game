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

    // console.log(invNames);
    // console.log(kwNames);
    // console.log(LName);
    // console.log(kiraName);

    invNames.push(LName, kiraName);
    kwNames.push(LName, kiraName);

    const finalInvInfo = [{}];
    const finalKwInfo = [{}];

    // console.log(playersInfo);

    for (const player of playersInfo) {

        if (player.role === 'Investigator') {

            let info;
            if (player.item === 'Mythical Chocolate') {
                info = template1(LName, 'L');
            }
            else {
                console.log(invNames)
                invNames.splice(player.gameName, 1);
                console.log(invNames)

                info = template2(invNames[0], kwNames[0], 'Investigator');
                invNames.splice(0, 1);
                console.log(invNames);

                kwNames.splice(0, 1);
    
                invNames.splice(player.gameName, 0);
                console.log(invNames);
                return
            }

            finalInvInfo.push({ name: player.gameName, info });
        }

        else if (player.role === 'Kira Worshipper') {

            // const info = template2(invNames[0], kwNames[0], 'Kira Worshipper');
            // invNames.splice(0, 1);
            // kwNames.splice(0, 1);

            // finalKwInfo.push({ name: player.gameName, info });
        }
    }



    console.log(finalInvInfo);
 
};