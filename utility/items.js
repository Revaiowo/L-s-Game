
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export const giveItems = (playersInfo) => {

    const items = ['Spy Camera', 'Bat', 'Vote Canceler', 'Vote Doubler', 'Revival Stone', 'Spyware'];
    const killingItems = ['Knife', 'Toxin', 'Gun'];

    shuffleArray(items);
    shuffleArray(killingItems);

    const invItems = [];
    const kwItems = [];

    // -2 because we don't need to give items to L and Kira
    for (let i=0; i < playersInfo.length - 2; i++) {

        if (i % 2 === 0)
            invItems.push(items[i]);
        else 
            kwItems.push(items[i]);       
    };

    invItems.splice(0, 0, killingItems[0]); // add a killing item to inv items
    invItems.pop(); // we added 1 item in front so gotta take one out from the back
    killingItems.splice(0, 1);

    invItems.splice(0, 0, 'Mythical Chocolate'); // add MC to inv items
    invItems.pop();

    kwItems.splice(0, 0, killingItems[0]);
    kwItems.pop();
    killingItems.splice(0, 1);

    shuffleArray(invItems);
    shuffleArray(kwItems);

    for (const player of playersInfo) {

        if (player.role === 'Kira') {
            player.item = 'Death Note';
        }

        else if (player.role === 'L') {
            player.item = '100IQ';
        }

        else if (player.role === 'Investigator') {

            player.item = invItems[0];
            invItems.splice(0, 1); // remove the item just selected aka the first position
        }

        else if (player.role === 'Kira Worshipper') {
            player.item = kwItems[0];
            kwItems.splice(0, 1);
        }

        else if (player.role === 'Neutral') {
            player.item = killingItems[0];
        }
    };

};