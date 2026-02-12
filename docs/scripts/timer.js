const clockelement = document.getElementById('timer_display');

const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');

const timer_mode = document.getElementById('timer_mode');
const stopwatch_mode = document.getElementById('stopwatch_mode');

const soundfileInput = document.querySelector('input[name="audiofile"]');
const volumeInput = document.querySelector('input[name="volume"]');
const volumeLabel = document.getElementById('volume_label');

const lapTimesDiv = document.getElementById('lap_times');

const audio = new Audio();

let timesec = 0;
let timerflag = false; // false: ストップウォッチモード, true: タイマーモード
let lapcount = 1;

function updatestopwatch(){
    timesec++;
    clockelement.textContent = formattime(timesec);
}

function updateTimer(){
    if (timesec > 0) {
        timesec--;
        clockelement.textContent = formattime(timesec);
    } else {
        stopTimer();
        // サウンドを再生
        const files = soundfileInput.files;
        if (files.length > 0) {
            const audioURL = URL.createObjectURL(files[0]);
            audio.src = audioURL;
            audio.play();
        }
        alert('タイマー終了！');
    }
}

function formattime(sec){
    let hours = Math.floor(sec / 3600).toString().padStart(2, '0');
    let minutes = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    let seconds = (sec % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function startTimer(){
    if (this.timerInterval) return;
    switchToTimer();
    if (!timerflag) {
        this.timerInterval = setInterval(updatestopwatch, 1000);
    } else {
        this.timerInterval = setInterval(updateTimer, 1000);
    }
}

function stopTimer(){
    audio.pause();
    audio.currentTime = 0;
    if (!this.timerInterval) return;
    clearInterval(this.timerInterval);
    this.timerInterval = null;
}

function resetTimer(){
    stopTimer();
    timesec = 0;
    clockelement.textContent = `00:00:00`;
    lapcount = 1;
    lapTimesDiv.innerHTML = '';
}

function changeTime(){
    resetTimer();
    let newTime = 0;
    newTime += parseInt(hoursInput.value) * 3600;
    newTime += parseInt(minutesInput.value) * 60;
    newTime += parseInt(secondsInput.value);
    if (!isNaN(newTime)) {
        timesec = newTime;
        clockelement.textContent = formattime(timesec);
    }
}

function lapTime(){
    if (timerflag) return; // タイマーモードではラップタイムを記録しない
    const lapTimeEntry = document.createElement('div');
    lapTimeEntry.textContent = `ラップ${lapcount}: ${formattime(timesec)}`;
    lapTimesDiv.appendChild(lapTimeEntry);
    lapcount++;
}

function switchToTimer(){
    if (timer_mode.checked) {
        timerflag = true;
        document.querySelector('.timer_inputs').hidden = false;
        document.querySelector('.stopwatch').hidden = true;
    } else {
        timerflag = false;
        document.querySelector('.timer_inputs').hidden = true;
        document.querySelector('.stopwatch').hidden = false;
    }
}

function updateVolumeLabel(){
    volumeLabel.textContent = `${volumeInput.value}%`;
    audio.volume = volumeInput.value / 100;
}

updateVolumeLabel();

volumeInput.addEventListener('input', updateVolumeLabel);
timer_mode.addEventListener('change', switchToTimer);
stopwatch_mode.addEventListener('change', switchToTimer);
stopwatch_mode.addEventListener('change', switchToTimer);

