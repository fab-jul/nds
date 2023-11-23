/**

 ------
{STATES}
 ------

[init]
- label toggle "Go"
- toggle button visible
- <click toggle> -> [running]

[running]
- label toggle "Stop"
- current stage index
- time remaining
- <click next> -> stage_index += 1
- <click +1m> -> time_remaining += 60 
- <click toggle> -> [init]

 */

const stageInput = document.getElementById('stage-input');
const timeInput = document.getElementById('time-input');

const toggleButton = document.getElementById('toggle-button');
const stayButton = document.getElementById('stay-button');
const nextButton = document.getElementById('next-button');

const whileRunningDiv = document.getElementById('while-running');

const totalDisplay = document.getElementById('total-display');
const timeDisplay = document.getElementById('time-display');
const currentStageDisplay = document.getElementById('current-stage-display');

let state = "init"
let timerInterval = null;  // Timer object

let dateOfLastStateChange = null;
let stageDuration = null;  // Seconds

let dateOfLastGo = null;  // Seconds
let currentStageIndex = 0;


function secondsToTimerString(totalSeconds) {
    totalSeconds = Math.max(0, totalSeconds);  // No negative business.
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${formattedMinutes}:${formattedSeconds}`;
}

function remainingSecondsInStage() {
    const elapsed = (Date.now() - dateOfLastStateChange) / 1000;
    return stageDuration - elapsed
}


function updateTimerDisplay() {
    totalMinutes = (Date.now() - dateOfLastGo) / 60000
    if (totalMinutes < 1) {
        totalDisplay.textContent = "Total: <1min";
    } else {
        totalDisplay.textContent = `${Math.floor(totalMinutes)}min`
    }
    timeDisplay.textContent = secondsToTimerString(remainingSecondsInStage());
}

function getStages() {
    return stageInput.value.split(',').map(e => { return e.trim() });
}

function nextStage() {
    currentStageIndex++;
    console.log("Stage idx %d", currentStageIndex);
}

function updateCurrentStageDisplay() {
    stages = getStages();
    const currentStage = stages[currentStageIndex % stages.length];
    currentStageDisplay.textContent = currentStage;
}


function draw() {
    if (state == "init") {
        whileRunningDiv.hidden = true;
        toggleButton.innerHTML = "Go";

        // Remove timer
    } else if (state == "running") {
        whileRunningDiv.hidden = false;
        toggleButton.innerHTML = "Stop";

        updateTimerDisplay();
        updateCurrentStageDisplay();
    } else {
        alert("Error");
    }
}

function validateInput() {
    const timeValue = parseInt(timeInput.value);
    return true;
}

function resetTimer() {
    const timeValue = parseInt(timeInput.value) * 60;
    clearInterval(timerInterval);
    stageDuration = timeValue;
    dateOfLastStateChange = Date.now();
    draw();

    timerInterval = setInterval(() => {
        if (remainingSecondsInStage() <= 0) {
            // Timer has ended
            clearInterval(timerInterval);
            console.info('Stage time has ended!');
            nextStage();
            resetTimer();
        }
        draw();
    }, 250);   // Milliseconds
}

nextButton.addEventListener('click', () => {
    nextStage();
    resetTimer();
});
stayButton.addEventListener('click', () => {
    stageDuration += 60;
})

toggleButton.addEventListener('click', () => {
    if (state == "init") {
        dateOfLastGo = Date.now();
        isValid = validateInput();
        if (!isValid) {
            return;
        }
        state = "running";
        resetTimer();
    } else if (state == "running") {
        clearInterval(timerInterval)
        state = "init";
    } else {
        alert("Error");
    }
    draw();
});

draw();
