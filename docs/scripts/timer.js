const clockelement = document.getElementById('timer_display');

const hoursInput = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');

const timer_mode = document.getElementById('timer_mode');
const stopwatch_mode = document.getElementById('stopwatch_mode');

let timesec = 0;
let timerflag = false; // false: ストップウォッチモード, true: タイマーモード

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
        alert("時間です！");
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
    if (!this.timerInterval) return;
    clearInterval(this.timerInterval);
    this.timerInterval = null;
}

function resetTimer(){
    stopTimer();
    timesec = 0;
    clockelement.textContent = `00:00:00`;
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

function switchToTimer(){
    if (timer_mode.checked) {
        timerflag = true;
        document.querySelector('.timer_inputs').hidden = false;
    } else {
        timerflag = false;
        document.querySelector('.timer_inputs').hidden = true;
    }
}

timer_mode.addEventListener('change', switchToTimer);
stopwatch_mode.addEventListener('change', switchToTimer);
