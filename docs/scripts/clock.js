const clockelement = document.getElementById('clock_display');
const dateelement = document.getElementById('date_display');
const options = { weekday: "long" };

function updateDate(){
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();
    let date = now.getDate();
    let day = new Intl.DateTimeFormat("ja-JP", options).format(now.getDay());
    dateelement.textContent = `${year}年${month}月${date}日(${day})`
}

function updateClock(){
    let now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');
    clockelement.textContent = `${hours}:${minutes}:${seconds}`;
}

function scheduleMidnightUpdate() {
    const now = new Date();

    // 次の0時
    const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 0, 0
    );

    const msUntilMidnight = nextMidnight - now;

    // 0時になったら更新して、以降は24時間ごと
    setTimeout(() => {
        updateDate();
        setInterval(updateDate, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
}


setInterval(updateClock, 1000);
updateClock();
scheduleMidnightUpdate();
updateDate();