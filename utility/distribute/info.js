

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

    if (Math.random() < 0.5) {
        [x, y] = [y, x]; 
    }
  
    return `Either ${x} or ${y} is ${z}.`;
};

function template3(x, y, z) {

    if (Math.random() < 0.5) {
        [x, y] = [y, x];
    }
  
    return `Neither ${x} nor ${y} is ${z}.`;
};

export const  getInfo = (playersInfo) => {

    const invArray = playersInfo.filter(player => player.role === 'Investigator');
    const invNames = invArray.map(inv => (inv.gameName));

    const noInvArray = playersInfo.filter(player => player.role !== 'Investigator');
    const noInvNames = noInvArray.map(inv => (inv.gameName));
    
    const kwArray = playersInfo.filter(player => player.role === 'Kira Worshipper');
    const kwNames = kwArray.map(kw => (kw.gameName));
    
    const noKwArray = playersInfo.filter(player => player.role !== 'Kira Worshipper');
    const noKwNames = noKwArray.map(kw => (kw.gameName));
    
    const { gameName: nearName } = invArray.find(inv => inv.item === 'Mythical Chocolate');
    const { gameName: LName } = playersInfo.find(inv => inv.role === 'L');
    const { gameName: kiraName } = playersInfo.find(inv => inv.role === 'Kira');

    shuffleArray(invNames);
    shuffleArray(kwNames);
    shuffleArray(noInvNames);
    shuffleArray(noKwNames);

    if (nearName){ // if near is present in the game, push it to the last point in the array
        invNames.splice(invNames.indexOf(nearName), 1);
        invNames.push(nearName);
    }

    const finalInfo = [];
    let info;

    for (let i=0; i < invNames.length; i++) {

        if (invNames[i] === nearName) 
            info = template1(LName, 'L');

        else if (i === 0 && invNames.length > 3) 
            info = template3(noInvNames[i], noInvNames[i+1],'Investigator');

        else 
            info = template2(invNames[i+1], noInvNames[i+1], 'Investigator');   

        finalInfo.push({ gameName: invNames[i], info });
    }

    for (let i=0; i < kwNames.length; i++) {

        if (i === kwNames.length-1) 
            info = template1(kiraName, 'Kira');

        else if (i === 0 && kwNames.length > 3) 
                info = template3(noKwNames[i], noKwNames[i+1],'Kira Worshipper');
        
        else {
            info = template2(kwNames[i+1], noKwNames[i+1], 'Kira Worshipper');   
            // noKwNames.splice(0, 1);
        }
        finalInfo.push({ gameName: kwNames[i] , info });
    }

    return finalInfo;
 
};