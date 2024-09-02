import { Player } from "../models/player.js";

const items = ['Spy Camera', 'Bat', 'Vote Canceler', 'Vote Doubler', 'Revival Stone', 'Spyware'];
const killingItems = ['Knife', 'Toxin', 'Gun'];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export const giveItems = async (playersInfo) => {

    shuffleArray(items);
    shuffleArray(killingItems);

    const invItems = [];
    const kwItems = [];

    for (const [i, item] of items.entries()) {

        if (i % 2 === 0)
            invItems.push(item);
        else 
            kwItems.push(item);
    };

    invItems.splice(0, 0, killingItems[0]); 
    killingItems.splice(0, 1);

    kwItems.splice(0, 0, killingItems[0]);
    killingItems.splice(0, 1);

    for (const player of playersInfo) {

        if (player.role === 'Kira')
            await Player.findOneAndUpdate({ playerId: player.playerId }, { $set: { item: 'Death Note' } });

        else if (player.role === 'L')
            await Player.findOneAndUpdate({ playerId: player.playerId }, { $set: { item: '100IQ' } });

        else if (player.role === 'Investigator') {
            await Player.findOneAndUpdate({ playerId: player.playerId }, { $set: { item: invItems[0] } });
            invItems.splice(0, 1); // remove the item just selected aka the first position
        }

        else if (player.role === 'Kira Worshipper') {
            await Player.findOneAndUpdate({ playerId: player.playerId }, { $set: { item: kwItems[0] } });
            kwItems.splice(0, 1);
        }

        else if (player.role === 'Neutral') {
            await Player.findOneAndUpdate({ playerId: player.playerId }, { $set: { item: killingItems[0] } });
        }
    };
};