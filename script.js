class Army {
    constructor(faction, size) {
        this.faction = faction
        this.size = size
    }
}

const factions = ['rebels', 'player1', 'player2']
let gameMap = {
    0: new Army(factions[1], 100),
    1: new Army(factions[0], 10),
    2: new Army(factions[0], 10),
    3: new Army(factions[0], 10),
    4: new Army(factions[0], 10),
    5: new Army(factions[2], 30),
}
let mapConnections = {
    0: [1, 2, 3],
    1: [0, 2, 4],
    2: [0, 1, 3, 4],
    3: [0, 2, 4],
    4: [2, 3, 5],
    5: [4, 1]
}
const rewardArmy = 10
const transferRate = 1 / 2
let turnNumber = 1
while (turnNumber <= 5) {
    factions.forEach(faction => {
        if (faction === factions[0]) return;
        let states = Object.keys(gameMap).filter(k => gameMap[k].faction === faction);
        console.log('---------' + faction + '---------');
        console.log('states : ' + states);
        states.forEach(s => {
            const neighbors = mapConnections[s].filter(n => gameMap[n].faction !== faction)
            const availableTargets = neighbors?.filter(i => gameMap[s].size > gameMap[i].size)
            if (availableTargets.length === 0) return;
            const minTarget = availableTargets.reduce((min, it) => gameMap[it].size < gameMap[min].size ? it : min);
            if (minTarget !== null) {
                console.log(`army of ${s} slected target : ${minTarget}`);
                console.log('-------battle-------');
                console.log(`${faction} vs ${gameMap[minTarget].faction}`);
                console.log(`${gameMap[s].size} vs ${gameMap[minTarget].size}`);

                const result = gameMap[s].size - gameMap[minTarget].size;
                const transferArmy = Math.floor(result * transferRate)

                gameMap[minTarget].faction = faction
                gameMap[minTarget].size = transferArmy
                gameMap[s].size = result - transferArmy

                console.log(`${faction} wins!!!`)
                console.log(`${faction}'s remaining army : ${result}`)
                console.log('_____________')
            }
        })
    })
    turnNumber ++;
}