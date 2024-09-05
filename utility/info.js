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
    const invNames = invArray.map(inv => ({ gameName: inv.gameName, item: inv.item }));

    const noInvArray = await Player.find({ role: { $ne: 'Investigator' } });
    const noInvNames = noInvArray.map(inv => (inv.gameName));
    
    const kwArray = await Player.find({ role: 'Kira Worshipper' });
    const kwNames = kwArray.map(kw => (kw.gameName));

    const noKwArray = await Player.find({ role: { $ne: 'Kira Worshipper' } });
    const noKwNames = noKwArray.map(kw => (kw.gameName));
    
    const LObj = await Player.findOne({ role: 'L' });
    const LName = LObj.gameName;

    const kiraObj = await Player.findOne({ role: 'Kira' });
    const kiraName = kiraObj.gameName;

    const finalInvInfo = [];
    const finalKwInfo = [];

    console.log('inv - ', invNames);
    console.log('kw - ', kwNames);
    console.log('L - ', LName);
    console.log('Kira - ', kiraName);

    for (let i=0; i < invNames.length; i++) {

        let info, near;

        if (invNames[i].item === 'Mythical Chocolate') {
            near = invNames[i].gameName;
            info = template1(LName, 'L');
        }

        else if (near) {
            info = template2(near, noInvNames[0], 'Investigator');   
            noInvNames.splice(0, 1);
            near = null;
        }
        
        else if (i === invNames.length - 1) 
            info = template3(noInvNames[0], noInvNames[1],'Investigator');

        else {
            info = template2(invNames[i+1].gameName, noInvNames[0], 'Investigator');   
            noInvNames.splice(0, 1);
        }

        finalInvInfo.push({ name: invNames[i].gameName, info });
    }

    let flag = true;

    for (const kw of kwNames) {

        let info;

        if (flag) {
            info = template1(kiraName, 'Kira');
            flag = false;
        }

        else if (kwNames.length === 2) 
                info = template3(noKwNames[0], noKwNames[1],'Kira Worshipper');
        
        else {
            kwNames.splice(kwNames.indexOf(kw), 1);
            info = template2(kwNames[0], noKwNames[0], 'Kira Worshipper');   
            kwNames.push(kw);
            kwNames.splice(0, 1);
            noKwNames.splice(0, 1);
        }
        finalKwInfo.push({ name: kw , info });
    }

    console.log(finalInvInfo);
    console.log(finalKwInfo);
 
};