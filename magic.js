const dataObj = JSON.parse(data);

console.log(dataObj);
console.log("HI!");


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

function calculateLeanForAllStates() {
    let dict = new Map();

    for (let i = 0; i < STATES.length; i++) {
        let currentState = STATES[i];

        let lean = calculateLean(currentState);
        dict.set(currentState.toString(), lean);
    }

    return dict;
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

        let color = rainbow(56, parseInt(currentState, 10));

        let id = "c" + currentCounty.id;

        console.log("Attempting id " + id);

        if (document.getElementById(id) != null) { // Bedford city, VA or something
            document.getElementById(id).style.fill = color;
        }
    }
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

        for (let j = 0; j < potentialNewStates.length; j++) {
            let currentPotentialNewState = potentialNewStates[j];

            let currentLean = stateLeans.get(currentState);
            let potentialNewLean = stateLeans.get(currentPotentialNewState);

            let countyLean = currentCounty.vote_lean_r;

            // If the new state is closer, express a desire to switch to it
            if (Math.abs(countyLean - potentialNewLean) < Math.abs(countyLean - currentLean)) {
                console.log("----------------------------------------------");
                console.log("County " + currentCounty.name + " has seceded from " + currentState + "!!");
                console.log("The county's current lean: " + countyLean.toFixed(2));
                console.log("The old state's lean     : " + currentLean.toFixed(2));
                console.log("The new state's lean     : " + potentialNewLean.toFixed(2));
                console.log("----------------------------------------------");
            } else {
                // console.log("----------------------------------------------");
                // console.log("County " + currentCounty.name + " has NOT seceded from " + currentState + "!!");
                // console.log("The county's current lean: " + countyLean.toFixed(2));
                // console.log("The old state's lean     : " + currentLean.toFixed(2));
                // console.log("The new state's lean     : " + potentialNewLean.toFixed(2));
                // console.log("----------------------------------------------");
            }
        }
    }
}