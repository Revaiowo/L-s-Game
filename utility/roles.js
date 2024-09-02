

const roleNames = ['L','Kira'];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export const getRoles = (playersInfo) => {

    const roleCount = playersInfo.length - roleNames.length;

    for (let i=0; i < roleCount; i++) {

        if (i % 2 === 0)
            roleNames.push('Investigator');
        else
            roleNames.push('Kira Worshipper');
    };

    shuffleArray(roleNames);

    return roleNames; 
};