let step = 0;
let realStep = 0;
let text = "";
let displaySenate = true;
let displayPresidential = false;
const shape = document.getElementsByTagName("svg")[0];
writeInfo();

function updateSenate() {
    displaySenate = document.getElementById("sen").checked;

    if (displaySenate) {
        document.getElementById("senate-details").style.display = 'block';
    } else {
        document.getElementById("senate-details").style.display = 'none';
    }
}

function updatePres() {
    displayPresidential = document.getElementById("pres").checked;

    if (displayPresidential) {
        updatePresidentialResults();
        document.getElementById("pres-details").style.display = 'block';
    } else {
        document.getElementById("pres-details").style.display = 'none';
    }
}

let colorFunction = colorMap;

function runNiceStep() {
    runStep();

    step++;

    updateText();
}

const leaner = document.querySelector("#leaner");
let political = false;

leaner.addEventListener("toggle", function () {
    political = !political;

    if (political) {
        colorFunction = colorMapByPartisanLean;
    } else {
        colorFunction = colorMap;
    }

    colorFunction();
})

function runStep() {
    realStep++;
    let changes = timeStep();
    // electionResults(changes);
    colorFunction();
    writeInfo();
    if (displaySenate) {
        updateSenateResults();
    }
    if (displayPresidential) {
        updatePresidentialResults();
    }
}

function electionResults(changes) {
    document.getElementById("election-results").innerHTML = "Most recent election results: ";
    for (let countyID of changes) {
        let county = dataObj[countyID];
        let countyName = county.name.substring(0, county.name.length - 4);
        document.getElementById("election-results").innerHTML += countyName + " COUNTY has seceded and joined " + getStateName(county.state) + "!<br/>";
    }
}

let delay = 1000;

function updateDelay() {
    try {
        delay = parseInt(document.getElementById("delay").value, 10);
    } catch (error) {
        console.log(error);
    }
}

// colorMap();
// shape.setAttribute("viewBox", "630 30 400 200");

function runNiceStepToEquillibrium() {
    realStep++;
    step++;
    let changed = timeStep();
    colorFunction();
    writeInfo();
    updateText();
    if (displaySenate) {
        updateSenateResults();
    }
    if (displayPresidential) {
        updatePresidentialResults();
    }

    if (changed.length > 0) {
        // console.log("Here are all the many changes:");
        // console.log(changed);
        setTimeout(runNiceStepToEquillibrium, delay);
    }
}

function animateViewBox(moveTo) {
    gsap.to(shape, {
        duration: 1,
        attr: {viewBox: moveTo},
        ease: "power3.inOut"
    });
}

function updateText() {
    document.getElementById("text").innerHTML = text;
    document.getElementById("timestep").innerHTML = "Number of elections: " + realStep;
}
