let step = 0;
let realStep = 0;
let text = "";
const shape = document.getElementsByTagName("svg")[0];
writeInfo();

let colorFunction = colorMap;

function runNiceStep() {

    if (step === 0) {
        text = "Welcome to Andrew's United States Simulator! Press the Step button above, or press space, to advance the simulation.";
    }
    if (step === 1) {
        text = "The idea is simple: what would happen if once a month, unhappy counties were allowed to secede, and join neighboring states?";
    }
    if (step === 2) {
        text = "How do we decide if county wants to leave? The simplest heuristic is voting patterns. In this simulation, the unhappiness threshold is <b>60 points</b>: if a county is right next to a state that votes more than <i>60 points</i> closer to it than its current state, the county will secede, and join the state it agrees significantly more with.";
    }
    if (step === 3) {
        text = "All right, let's get started. Here are the current United States of America.";
        colorFunction();
    }
    if (step === 4) {
        text = "You may be asking, where on earth are there counties that want to join neighboring states by more than 60 points? Well, there aren't many, so let's zoom in.";
    }
    if (step === 5) {
        animateViewBox("730 200 200 100");
    }
    if (step === 6) {
        text = "The answer lies in the Maryland Panhandle. Maryland, home to cities like Baltimore and the Washington, D.C. suburbs, leans some 26 points to the left of the country as a whole. Garrett County, however, voted for Trump over Biden 77-21, which is much closer to West Virginia's 69-30 margin. Thus, in our simulation, it is the first county to secede.";
    }
    if (step === 7) {
        runStep();
        text = "The county next to it, Allegany County, actually wants to join West Virginia more. However, the secession algorithm doesn't let a secession break a state apart, so Allegany needs to wait for Garrett County to secede first. In general, figuring out what the maximum \"unhappiness\" of counties that can secede <a href=\"https://en.wikipedia.org/wiki/Steiner_tree_problem\" target='_blank'>is NP-complete</a>, so we run a more realistic algorithm: the counties, in order of unhappiness, propose to leave the state; the state accepts all proposals that do not break the state into pieces.";
    }
    if (step === 8) {
        text = "Anyways, let's hold another election.";
    }
    if (step === 9) {
        runStep();
        text = "";
    }
    if (step === 10) {
        animateViewBox("0 0 989.98 627.07");
        text = "As you can see, these were the only counties that wanted to secede. Assuming no change in voting patterns, all future elections will maintain this equillibrium.";
    }
    if (step > 10 && step < 15) {
        runStep();
        text = "...".repeat(step - 10);
    }
    if (step === 15) {
        text = "All, right, let's see what happens when the threshold isn't as unreasonably high&mdash;let's try, say, <b>50 points</b>.";
        threshold = 0.50;
    }
    if (step > 16 && step < 30) {
        runStep();
    }
    if (step === 30) {
        text = "We've reached equilibrium once again. In my opinion, the most interesting result is Greater Idaho&mdash;let's take a look."
    }
    if (step === 31) {
        animateViewBox("20 40 400 200");
        text = "For many years now, the <a href=\"https://www.greateridaho.org/\" target='_blank'>Greater Idaho project</a> has been trying to move Oregon's border west, and have the eastern counties join Idaho. This simulation shows that these counties have a point&mdash;they vote more than 50 points closer to Idaho than to Oregon! In fact, every county that voted to join Idaho in real life did indeed join Idaho here; furthermore, Douglas and Josephine counties, which voted against joining Oregon in real life, did not join Idaho in the simulation either! Thus, 50% seems like a reasonable \"realistic\" threshold for whether counties <i>actually</i> want to leave their state, to the point of voting in favor of it.";
    }
    if (step === 32) {
        animateViewBox("250 190 200 100");
        document.getElementById("c08123").style.fill = '#333';
        text = "However, Weld County, CO, which in real life <a href='https://www.weldcountywy.com/' target='_blank'>seriously wants to join Wyoming</a>, has not yet joined Wyoming in the simulation. So, let's crank the threshold down to <b>40 points</b>, and see what happens.";
    }
    if (step === 33) {
        animateViewBox("0 0 989.98 627.07");
        text = "Here we go!";
        threshold = 0.40;
    }
    if (step > 33 && step < 46) {
        runStep();
    }
    if (step === 46) {
        threshold = 0.30;
        text = "Equilibrium once again. Looks like the adage that Illinois is a red state plus Chicago is pretty correct. Also, Weld County, Colorado now looks closer to joining Oklahoma than Wyoming... However, most of these changes are pretty tiny counties, and most states are pretty much the same size in terms of population, as you can see in the \"state info\" dropdown below. So, let's see what happens if we set the threshold to <b>30 points</b>, which is still a lot&mdash;it's the difference between Mississippi and Colorado!";
    }
    if (step > 46 && step < 66) {
        runStep();
    }
    if (step === 66) {
        text = "Equilibrium. At this point, we have Greater Greater Idaho, Multi-Pronged Wyoming, and an Oklahoma with 10 million people. Illinois, Texas, and Maryland have been reduced to emaciated skeletons connecting deep-blue cities; Democrats easily win every presidential election. However, let's zoom in to my favorite part of the map.";
    }
    if (step === 67) {
        animateViewBox("630 30 400 200");
        text = "A perfect Northeast! I wonder if the significantly more arbitrary state borders in the West contribute to the crazy secessions there.";
    }
    if (step === 68) {
        animateViewBox("0 0 989.98 627.07");
        text = "Anyways, enough talking; let's set the threshold to <b>20 points</b>! We've also added a button that automatically runs to equillibrium, if you're tired of pressing \"step\" each time.";
        document.getElementById("equil").style.display = 'inline-block';
        document.getElementById("equil").disabled = false;
        threshold = 0.2;
    }
    if (step > 68 && step < 80) {
        runStep();
    }
    if (step === 80) {
        text = "Idaho is now a coastal state. Kansas barely exists. Pennsylvania now spans from Ohio to Vermont. Are you ready for a Wyoming-Texas border? Let's start the <b>10 point</b> threshold!";
        threshold = 0.1;
        document.getElementById("equil").disabled = false;
    }
    if (step > 80 && step < 110) {
        runStep();
    }
    if (step === 110) {
        text = "New England still looks pretty recognizable. Everything else...isn't. Let's now set the threshold to <b>0</b>: if a county likes a neighboring state <i>any</i> more than its current state, it secedes and joins the neighbor. Seems pretty fair, right?";
        threshold = 0.0;
        document.getElementById("equil").disabled = false;
    }
    if (step > 110 && step < 130) {
        runStep();
    }
    if (step === 130) {
        text = "Ok, that's it! Every county that wanted to leave has left. Welcome to the new United States!";
    }
    if (step === 131) {
        text = "Want to explore your own configuration? Head to our <a href=\"../map\">map page</a> to run any simulation you want!";
    }

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
    electionResults(changes);
    colorFunction();
    writeInfo();

    return changes;
}

function electionResults(changes) {
    document.getElementById("election-results").innerHTML = "Most recent election results: ";
    for (let countyID of changes) {
        let county = dataObj[countyID];
        let countyName = county.name.substring(0, county.name.length - 4);
        document.getElementById("election-results").innerHTML += countyName + " COUNTY has seceded and joined " + getStateName(county.state) + "!<br/>";
    }
}

// colorMap();
// shape.setAttribute("viewBox", "630 30 400 200");

function runNiceStepToEquillibrium() {
    step++;

    let changed = runStep();

    if (changed.length > 0) {
        setTimeout(runNiceStepToEquillibrium, 1000);
    } else {
        document.getElementById("equil").disabled = true;
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
