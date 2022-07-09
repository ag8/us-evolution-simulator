const dataObj = JSON.parse(data);

console.log(dataObj);
console.log("HI!");

const threshold = 0.30;
const reabsorption = false;
const requireConnectednessDumb = false;

function calculateLean(state) {
    let stateRepublicans = 0;
    let stateDemocrats = 0;

    for (let i = 0; i < COUNTIES.length; i++) {
        let currentCounty = dataObj[COUNTIES[i]];

        if (currentCounty.state === state) {
            let l = currentCounty.vote_lean_r;
            let p = currentCounty.population;

            let r = p * (l + 1) / 2;
            let d = p - r;

            stateRepublicans += r;
            stateDemocrats += d;
        }
    }

    return (stateRepublicans - stateDemocrats) / (stateRepublicans + stateDemocrats);
}

function calculatePopulation(state) {
    let population = 0;

    for (let i = 0; i < COUNTIES.length; i++) {
        let currentCounty = dataObj[COUNTIES[i]];

        if (currentCounty.state === state) {
            population += currentCounty.population;
        }
    }

    return population;
}

function calculateLeanForAllStates() {
    let dict = new Map();

    for (let i = 0; i < STATES.length; i++) {
        let currentState = STATES[i];

        let lean = calculateLean(currentState);
        dict.set(currentState.toString(), lean);
    }

    return dict;
}

function getStateData() {
    let states = [];

    for (let i = 0; i < STATES.length; i++) {
        let currentState = STATES[i];

        let lean = calculateLean(currentState);
        let population = calculatePopulation(currentState);
        states.push({state: currentState, lean: lean, population: population})
    }

    return states;
}

/**
 * @param numOfSteps: Total number steps to get color, means total colors
 * @param step: The step number, means the order of the color
 */
function rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    let r, g, b;
    let h = step / numOfSteps;
    let i = ~~(h * 6);
    let f = h * 6 - i;
    let q = 1 - f;
    switch (i % 6) {
        case 0:
            r = 1;
            g = f;
            b = 0;
            break;
        case 1:
            r = q;
            g = 1;
            b = 0;
            break;
        case 2:
            r = 0;
            g = 1;
            b = f;
            break;
        case 3:
            r = 0;
            g = q;
            b = 1;
            break;
        case 4:
            r = f;
            g = 0;
            b = 1;
            break;
        case 5:
            r = 1;
            g = 0;
            b = q;
            break;
    }
    let c = "#" + ("00" + (~~(r * 255)).toString(16)).slice(-2) + ("00" + (~~(g * 255)).toString(16)).slice(-2) + ("00" + (~~(b * 255)).toString(16)).slice(-2);
    return (c);
}


function colorMap() {
    for (let i = 0; i < COUNTIES.length; i++) {
        let currentCounty = dataObj[COUNTIES[i]];

        // console.log(currentCounty);

        let currentState = currentCounty.state;

        let color = "";

        if (currentState === "17") {
            color = "#7128b6";
        } else if (currentState === "18") {
            color = "#FFFF00";
        } else if (currentState === "12") {
            color = "#e7e710";
        } else if (currentState === "51") {
            color = "#ff7300";
        } else if (currentState === "39") {
            color = "#009dff";
        } else {
            color = rainbow(57, parseInt(currentState, 10));
        }

        let id = "c" + currentCounty.id;

        // console.log("Attempting id " + id);

        if (document.getElementById(id) != null) { // Bedford city, VA or something
            document.getElementById(id).style.fill = color;
        }
    }
}


function checkConnection(pairOfCounties, currentState, currentCounty) {
    // We simply do a BFS.
    let source = pairOfCounties[0];
    let target = pairOfCounties[1];

    let exploredIDs = [];

    exploredIDs.push(source.id);

    let q = [];
    q.push(source);

    while (q.length > 0) {
        let v = q.shift();

        if (v.id === target.id) {
            return true;
        }

        let adjacents = v.adjacents;
        for (let j = 0; j < adjacents.length; j++) {
            let currAdj = dataObj[adjacents[j]];

            // Ignore counties from other states
            if (currAdj.state !== currentState) {
                continue;
            }

            // Ignore the potentially seceding county
            if (currAdj.id === currentCounty.id) {
                continue;
            }

            // Ignore self-adjacencies
            if (currAdj.id === v.id) {
                continue;
            }

            if (exploredIDs.indexOf(currAdj.id) === -1) {
                exploredIDs.push(currAdj.id);
                q.push(currAdj)
            }
        }
    }

    return false;
}

function checkIfSecessionWillBreakState(currentState, currentCounty) {
    // Get the list of neighbours that are in the state.
    let inStateNeighbours = [];


    let adjacents = currentCounty.adjacents;
    for (let j = 0; j < adjacents.length; j++) {
        let adjacentCountyState = dataObj[adjacents[j]].state;
        if (adjacentCountyState === currentState && dataObj[adjacents[j]].id !== currentCounty.id) {
            inStateNeighbours.push(dataObj[adjacents[j]]);
        }
    }

    // Generate pairs of neighbours that should have paths between them
    let pairs = [];

    for (let j = 0; j < inStateNeighbours.length - 1; j++) {
        pairs.push([inStateNeighbours[j], inStateNeighbours[j + 1]])
    }
    pairs.push([inStateNeighbours[inStateNeighbours.length - 1], inStateNeighbours[0]]);


    // Check that each pair is connected even if the current county is missing
    for (let j = 0; j < pairs.length; j++) {
        let connected = checkConnection(pairs[j], currentState, currentCounty);

        if (!connected) {
            console.log("TRUEEE");
            return true;
        }
    }

    console.log("FALSEEE");
    return false;
}

function timeStep() {
    let stateLeans = calculateLeanForAllStates();
    let perStateStrongestSwitchLeans = new Array(57).fill(0.0);

    // For each county, determine if it wants to join a neighbouring state.
    for (let i = 0; i < COUNTIES.length; i++) {
        let currentCounty = dataObj[COUNTIES[i]];

        let currentState = currentCounty.state;
        let potentialNewStates = [];

        // First, check if it borders any other states to begin with.
        let adjacents = currentCounty.adjacents;
        for (let j = 0; j < adjacents.length; j++) {
            let adjacentCountyState = dataObj[adjacents[j]].state;
            if (adjacentCountyState !== currentState) {
                potentialNewStates.push(adjacentCountyState);
            }
        }

        potentialNewStates = [...new Set(potentialNewStates)];

        if (potentialNewStates.length === 0) {  // If there's no states to switch to, skip this county
            continue;
        }

        // console.log("County " + currentCounty.name + " is considering switching to " + potentialNewStates);

        let currentLean = stateLeans.get(currentState);
        let countyLean = currentCounty.vote_lean_r;

        let bestNewPotentialState = potentialNewStates[0];
        let bestLeanDiff = 100.5;

        for (let j = 0; j < potentialNewStates.length; j++) {
            let currentPotentialNewState = potentialNewStates[j];

            let potentialNewLean = stateLeans.get(currentPotentialNewState);

            let leanDiff = Math.abs(countyLean - potentialNewLean);

            // If the new state is closer, express a desire to switch to it
            if (leanDiff < bestLeanDiff) {
                bestNewPotentialState = currentPotentialNewState;
                bestLeanDiff = leanDiff;
            }
        }

        // A state only switches to a different state if the "improvement" is good enough.
        let currentUnhappiness = Math.abs(countyLean - currentLean);
        let newUnhappiness = Math.abs(countyLean - stateLeans.get(bestNewPotentialState));  // = bestLeanDiff
        let worthIt = currentUnhappiness - newUnhappiness > threshold

        if (bestLeanDiff < Math.abs(countyLean - currentLean) && worthIt) {  // If the best state to switch to is worth it
            let secessionBreaks = false;

            if (requireConnectednessDumb) {
                // If connectedness is required, check for it.
                // This is checked in the dumb way; that is, if this county and only this county leaves,
                // will the state separate into two parts?

                secessionBreaks = checkIfSecessionWillBreakState(currentState, currentCounty);
            }

            if (!secessionBreaks) { // If we can switch there without breaking connectedness
                // Switch to the new state
                currentCounty.desiredState = bestNewPotentialState;
                currentCounty.claimedImprovement = bestLeanDiff;

                // Report it
                console.log("----------------------------------------------");
                console.log("County " + currentCounty.name + " wants to secede from " + getStateName(currentState) + " and joined " + getStateName(bestNewPotentialState) + "!!");
                console.log("The county's current lean: " + countyLean.toFixed(2));
                console.log("The old state's lean     : " + currentLean.toFixed(2));
                console.log("The new state's lean     : " + stateLeans.get(bestNewPotentialState).toFixed(2));
                console.log("----------------------------------------------");
            } else {
                console.log("County " + currentCounty.name + " WOULD HAVE seceded from " + getStateName(currentState) + " and joined " + getStateName(bestNewPotentialState) + ", but that would break connectedness!");
            }
        }
    }

    // Since only one county can secede per state per turn, figure out which county wants to do so the most
    // for (let i = 0; i < COUNTIES.length; i++) {
    //     let currentCounty = dataObj[COUNTIES[i]];
    //     let currentStateNum = parseInt(currentCounty.state, 10);
    //
    //     if (currentCounty.desiredState != null) {
    //         // Current strongest lean in this county's current state
    //         let currentStrongestArgument = perStateStrongestSwitchLeans[currentStateNum];
    //
    //         // If it wants to secede more than the current most secessionist county, make it the top
    //         if (currentCounty.claimedImprovement > currentStrongestArgument) {
    //             perStateStrongestSwitchLeans[currentStateNum] = currentCounty.claimedImprovement;
    //         } else {  // Otherwise, it doesn't get to secede
    //             currentCounty.desiredState = null;
    //             currentCounty.claimedImprovement = null;
    //         }
    //     }
    // }

    // Once all the counties vote, update all the states that they're in
    for (let i = 0; i < COUNTIES.length; i++) {
        let currentCounty = dataObj[COUNTIES[i]];

        if (currentCounty.desiredState != null) {
            if (currentCounty.id === "51515") {  // Bedford County, VA
                continue;
            }

            currentCounty.state = currentCounty.desiredState;

            document.getElementById("c" + currentCounty.id).childNodes[1].textContent = getLabel(currentCounty);
        }
    }

    // If reabsorption is turned on, each county that's surrounded by a different state joins it
    // TODO: This breaks population somehow
    if (reabsorption) {
        for (let i = 0; i < COUNTIES.length; i++) {
            let currentCounty = dataObj[COUNTIES[i]];

            let surroundingStates = [];

            // First, check if it borders any other states to begin with.
            let adjacents = currentCounty.adjacents;
            for (let j = 0; j < adjacents.length; j++) {
                let adjacentCountyState = dataObj[adjacents[j]].state;

                if (dataObj[adjacents[j]].id !== currentCounty.id) {
                    // console.log(dataObj[adjacents[j]].id + " !== " + currentCounty.id);
                    surroundingStates.push(adjacentCountyState);
                }
            }

            // console.log("County " + currentCounty.name + " borders states " + surroundingStates);

            if (surroundingStates.indexOf(currentCounty.state) === -1) {
                let counts = surroundingStates.reduce((a, c) => {
                    a[c] = (a[c] || 0) + 1;
                    return a;
                }, {});
                let maxCount = Math.max(...Object.values(counts));
                let mostFrequent = Object.keys(counts).filter(k => counts[k] === maxCount);

                if (currentCounty.state !== mostFrequent) {
                    // console.log("County " + currentCounty.name + " just got reabsorbed from " + getStateName(currentCounty.state) + " into " + getStateName(mostFrequent) + "!");
                    currentCounty.state = mostFrequent;
                }
            }
        }
    }
}

function writeInfo() {
    function calculateElectoralVotes(s) {
        let votesForBiden = 0;

        for (let i = 0; i < s.length; i++) {
            let current = s[i];

            if (s[i].lean < 0) {

            }
        }

        return undefined;
    }

    let s = getStateData();

    let bidenEV = calculateElectoralVotes(s);

    document.getElementById("info").innerHTML = "(Total population: " + s.reduce((n, {population}) => n + population, 0) + ")<br>";

    s.sort(function(a, b) {
        return parseFloat(b.population) - parseFloat(a.population);
    });

    for (let i = 0; i < s.length; i++) {
        if (s[i].population === 0) {
            document.getElementById("info").innerHTML += "" + getStateName(s[i].state) + " has been depopulated.<br>";
            continue;
        }

        if (s[i].lean > 0) {
            document.getElementById("info").innerHTML += "" + getStateName(s[i].state) + " has population " + s[i].population + ", and leans " + (100 * s[i].lean).toFixed(0) + " points to the right.<br>";
        } else {
            document.getElementById("info").innerHTML += "" + getStateName(s[i].state) + " has population " + s[i].population + ", and leans " + (-100 * s[i].lean).toFixed(0) + " points to the left.<br>";
        }
    }
}
