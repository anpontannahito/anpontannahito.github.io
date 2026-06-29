(() => {
    let timerDisplay = null;
    let hoursInput = null;
    let minutesInput = null;
    let secondsInput = null;
    let timerModeInput = null;
    let stopwatchModeInput = null;
    let soundfileInput = null;
    let volumeInput = null;
    let volumeLabel = null;
    let lapTimesDiv = null;
    let timerInputs = null;
    let stopwatchArea = null;
    let timerAudio = null;
    let timerIntervalId = null;
    let timesec = 0;
    let timerModeEnabled = false;
    let lapCount = 1;

    function initTimer() {
        cleanupTimer();

        timerDisplay = document.getElementById("timer_display");
        hoursInput = document.getElementById("hours");
        minutesInput = document.getElementById("minutes");
        secondsInput = document.getElementById("seconds");
        timerModeInput = document.getElementById("timer_mode");
        stopwatchModeInput = document.getElementById("stopwatch_mode");
        soundfileInput = document.querySelector('input[name="audiofile"]');
        volumeInput = document.querySelector('input[name="volume"]');
        volumeLabel = document.getElementById("volume_label");
        lapTimesDiv = document.getElementById("lap_times");
        timerInputs = document.querySelector(".timer_inputs");
        stopwatchArea = document.querySelector(".stopwatch");

        if (!timerDisplay) return;

        timerAudio = new Audio();
        timesec = 0;
        timerModeEnabled = false;
        lapCount = 1;

        updateVolumeLabel();
        switchToTimer();

        volumeInput?.addEventListener("input", updateVolumeLabel);
        timerModeInput?.addEventListener("change", switchToTimer);
        stopwatchModeInput?.addEventListener("change", switchToTimer);
        window.currentPageCleanup = cleanupTimer;
    }

    function cleanupTimer() {
        clearTimerInterval();

        if (timerAudio) {
            timerAudio.pause();
            timerAudio.currentTime = 0;
        }

        volumeInput?.removeEventListener("input", updateVolumeLabel);
        timerModeInput?.removeEventListener("change", switchToTimer);
        stopwatchModeInput?.removeEventListener("change", switchToTimer);

        timerDisplay = null;
        hoursInput = null;
        minutesInput = null;
        secondsInput = null;
        timerModeInput = null;
        stopwatchModeInput = null;
        soundfileInput = null;
        volumeInput = null;
        volumeLabel = null;
        lapTimesDiv = null;
        timerInputs = null;
        stopwatchArea = null;
        timerAudio = null;
    }

    function ensureTimerReady() {
        if (!timerDisplay) initTimer();
        return Boolean(timerDisplay);
    }

    function clearTimerInterval() {
        if (!timerIntervalId) return;

        clearInterval(timerIntervalId);
        timerIntervalId = null;
    }

    function updateStopwatch() {
        timesec++;
        if (timerDisplay) timerDisplay.textContent = formatTime(timesec);
    }

    function updateTimer() {
        if (timesec > 0) {
            timesec--;
            if (timerDisplay) timerDisplay.textContent = formatTime(timesec);
            return;
        }

        stopTimer();
        const files = soundfileInput?.files;
        if (files && files.length > 0 && timerAudio) {
            const audioURL = URL.createObjectURL(files[0]);
            timerAudio.src = audioURL;
            timerAudio.play();
        }
        alert("タイマー終了！");
    }

    function formatTime(sec) {
        const hours = Math.floor(sec / 3600).toString().padStart(2, "0");
        const minutes = Math.floor((sec % 3600) / 60).toString().padStart(2, "0");
        const seconds = (sec % 60).toString().padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    }

    function startTimer() {
        if (!ensureTimerReady() || timerIntervalId) return;

        switchToTimer();
        timerIntervalId = setInterval(timerModeEnabled ? updateTimer : updateStopwatch, 1000);
    }

    function stopTimer() {
        if (timerAudio) {
            timerAudio.pause();
            timerAudio.currentTime = 0;
        }
        clearTimerInterval();
    }

    function resetTimer() {
        if (!ensureTimerReady()) return;

        stopTimer();
        timesec = 0;
        timerDisplay.textContent = "00:00:00";
        lapCount = 1;
        if (lapTimesDiv) lapTimesDiv.innerHTML = "";
    }

    function changeTime() {
        if (!ensureTimerReady()) return;

        resetTimer();
        const newTime = getInputNumber(hoursInput) * 3600
            + getInputNumber(minutesInput) * 60
            + getInputNumber(secondsInput);

        timesec = newTime;
        timerDisplay.textContent = formatTime(timesec);
    }

    function lapTime() {
        if (!ensureTimerReady() || timerModeEnabled || !lapTimesDiv) return;

        const lapTimeEntry = document.createElement("div");
        lapTimeEntry.textContent = `ラップ${lapCount}: ${formatTime(timesec)}`;
        lapTimesDiv.appendChild(lapTimeEntry);
        lapCount++;
    }

    function switchToTimer() {
        if (!timerModeInput) return;

        timerModeEnabled = timerModeInput.checked;
        if (timerInputs) timerInputs.hidden = !timerModeEnabled;
        if (stopwatchArea) stopwatchArea.hidden = timerModeEnabled;
    }

    function updateVolumeLabel() {
        if (!volumeInput || !volumeLabel || !timerAudio) return;

        volumeLabel.textContent = `${volumeInput.value}%`;
        timerAudio.volume = volumeInput.value / 100;
    }

    function getInputNumber(input) {
        const value = parseInt(input?.value || "0", 10);
        return Number.isNaN(value) ? 0 : value;
    }

    window.initTimer = initTimer;
    window.startTimer = startTimer;
    window.stopTimer = stopTimer;
    window.resetTimer = resetTimer;
    window.changeTime = changeTime;
    window.lapTime = lapTime;
})();