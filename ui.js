function runNiceStep() {
    timeStep();
    colorMap();
    writeInfo();
}

function runNiceStepToEquillibrium() {
    let changed = timeStep();
    colorMap();
    writeInfo();

    if (changed > 0) {
        setTimeout(runNiceStepToEquillibrium, 1000);
    }
}