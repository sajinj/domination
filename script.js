class Army {
    constructor(faction, size) {
        this.faction = faction
        this.size = size
    }
}

const factions = ['rebels', 'player1', 'player2', 'player3']

let factionColorArray = ['gray', 'blue', 'red',
    'green', 'yellow', 'orange', 'pink']

factionColor = {}

factions.forEach((f, i) => {
    factionColor[f] = factionColorArray[i]
});
console.log(factionColor);

let gameMap = {
    0: new Army(factions[1], 80),
    1: new Army(factions[0], 10),
    2: new Army(factions[0], 10),
    3: new Army(factions[3], 75),
    4: new Army(factions[0], 10),
    5: new Army(factions[2], 90),
}
let mapConnections = {
    0: [1, 2, 3],
    1: [0, 2, 5],
    2: [0, 1, 3, 4],
    3: [0, 2, 4],
    4: [2, 3, 5],
    5: [4, 1]
}

const rewardArmy = 10
const transferRate = 2 / 3

let nodes = new vis.DataSet([]);
let edges = new vis.DataSet([]);

const options = {
    nodes: {
        shape: "circle",
        physics: false,
        scaling: {
            min: 5,
            max: 100,
            label: {
                enabled: true,
                min: 8,
                max: 18
            },
        },
        font: {
            color: 'white'
        },
    },
    edges: {
        width: 1,
    },
};

Object.keys(gameMap).forEach((f) => {
    nodes.add({
        id: f, label: `${f}\n${gameMap[f].size}`,
        color: factionColor[gameMap[f].faction],
        value: gameMap[f].size,
    })
})

Object.keys(gameMap).forEach((f) => {
    mapConnections[f].forEach((i) => {
        edges.add({ from: f, to: i })
    })
})

// create a network
let container = document.getElementById("mynetwork");
let data = {
    nodes: nodes,
    edges: edges,
};
let network = new vis.Network(container, data, options);

const turnDelay = 2000;
const maxTurns = 15;
let turnNumber = 1;

function runTurn(autoTurn) {
    if (turnNumber > maxTurns) return;
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
    Object.keys(gameMap).forEach(i => {
        if (gameMap[i].faction !== factions[0])
            gameMap[i].size += rewardArmy
    });
    updateUi()
    turnNumber++;
    setTimeout(() => {
        if(autoTurn){
            runTurn(true)
        }
    }, turnDelay);
}

function updateUi() {
    nodes.forEach(n => {
        n.color = factionColor[gameMap[n.id].faction],
            n.value = gameMap[n.id].size,
            n.label = `${n.id}\n${gameMap[n.id].size}`
    });
    network.setData(data);
}

const startButton = document.getElementById('startButton')
const nextButton = document.getElementById('nextButton')
const turnCounterDiv = document.getElementById('turnCounter')

turnCounterDiv.innerText = `turn ${turnNumber}`

startButton.addEventListener('click', function () {
    setTimeout(() => {
        runTurn(true)
    }, turnDelay);
})

nextButton.addEventListener('click', function () {
    runTurn(false)
    turnCounterDiv.innerText = `turn ${turnNumber}`
})

