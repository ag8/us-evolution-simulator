const dataObj = JSON.parse(data);

console.log(dataObj);
console.log("HI!");

const threshold = 0.20;
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

function checkConnectionBig(pairOfCounties, state, secedingCounties) {
    console.log("Running checkConnectionBig.");
    console.log("Pair of counties:");
    console.log(pairOfCounties);
    console.log("State: " + state);
    console.log("Seceding counties: ");
    console.log(secedingCounties);

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
            if (currAdj.state !== state) {
                continue;
            }

            // Ignore the potentially seceding counties
            if (secedingCounties.includes(currAdj.id)) {
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
        if (!pairs.includes([inStateNeighbours[j], inStateNeighbours[j + 1]])) {
            pairs.push([inStateNeighbours[j], inStateNeighbours[j + 1]])
        }
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

function stateRemainsConnected(state, secedingCounties) {
    console.log("We wish to check if state " + state + " remains connected with the secession of counties " + secedingCounties + ".");

    // Get the list of neighbours that are in the state.
    let stateCounties = getCountiesInState(state);

    if (stateCounties.length - secedingCounties.length === 0) {
        return false;
    } else if (stateCounties.length - secedingCounties.length === 1) {
        return true;
    }

    // We simply do a BFS.
    let c = 0;
    let source = stateCounties[c];
    while (secedingCounties.includes(source.id)) {
        source = stateCounties[++c];
    }

    let exploredIDs = [];

    exploredIDs.push(source.id);

    let q = [];
    q.push(source);

    while (q.length > 0) {
        let v = q.shift();

        let adjacents = v.adjacents;
        for (let j = 0; j < adjacents.length; j++) {
            let currAdj = dataObj[adjacents[j]];

            // Ignore counties from other states
            if (currAdj.state !== state) {
                continue;
            }

            // Ignore the potentially seceding counties
            if (secedingCounties.includes(currAdj.id)) {
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

    // Number of counties we should have traversed
    let numberOfCountiesWeShouldHaveVisited = stateCounties.length - secedingCounties.length;

    // Number of counties we actually visited
    let numberOfCountiesActuallyVisited = exploredIDs.length;

    console.log("Answer: " + (numberOfCountiesWeShouldHaveVisited === numberOfCountiesActuallyVisited) + "");

    // The state is connected if those two are equal
    return numberOfCountiesWeShouldHaveVisited === numberOfCountiesActuallyVisited;
}

function getCountiesInState(state) {
    let counties = [];

    for (let i = 0; i < COUNTIES.length; i++) {
        if (dataObj[COUNTIES[i]].state === state) {
            counties.push(dataObj[COUNTIES[i]]);
        }
    }

    return counties;
}

function timeStep() {
    let stateLeans = calculateLeanForAllStates();

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
                currentCounty.claimedImprovement = -1;
                console.log("County " + currentCounty.name + " WOULD HAVE seceded from " + getStateName(currentState) + " and joined " + getStateName(bestNewPotentialState) + ", but that would break connectedness!");
            }
        }
    }

    // Determine which counties can secede without breaking the state into disconnected components
    let allSecedingCounties = [];
    for (let i = 0; i < STATES.length; i++) {
        let currentState = STATES[i];
        let secedingCounties = [];

        let currentStateCounties = getCountiesInState(currentState);

        // Sort counties by their desire to secede
        currentStateCounties.sort(function (a, b) {
            return parseFloat(b.claimedImprovement) - parseFloat(a.claimedImprovement);
        });

        for (let county of currentStateCounties) {
            if (county.claimedImprovement === null || county.claimedImprovement === undefined) {
                continue;
            }

            // console.log("In state " + currentState + ", county " + county.name + " has desire to secede " + county.claimedImprovement);

            if (county.claimedImprovement < 0) {  // TODO: check for threshold here or later?
                break;
            }

            console.log("Real talk: In " + getStateName(currentState) + ", county " + county.name + " (" + county.id + ") is actually tryna leave if it can.");
            let potentialNewSetOfSecessors = secedingCounties.slice();
            potentialNewSetOfSecessors.push(county.id);

            if (stateRemainsConnected(currentState, potentialNewSetOfSecessors)) {
                secedingCounties.push(county.id);
            }
        }

        allSecedingCounties.push.apply(allSecedingCounties, secedingCounties);
    }

    console.log("Counties actually seceding this turn: " + allSecedingCounties);

    // Once all the counties vote, update all the states that they're in
    for (let i = 0; i < COUNTIES.length; i++) {
        let currentCounty = dataObj[COUNTIES[i]];

        if (currentCounty.desiredState != null && allSecedingCounties.includes(currentCounty.id)) {
            if (currentCounty.id === "51515") {  // Bedford County, VA
                continue;
            }

            currentCounty.state = currentCounty.desiredState;

            document.getElementById("c" + currentCounty.id).childNodes[1].textContent = getLabel(currentCounty);
        }

        // Reset county desires
        currentCounty.desiredState = currentCounty.state;
        currentCounty.claimedImprovement = -1;
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

    s.sort(function (a, b) {
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
