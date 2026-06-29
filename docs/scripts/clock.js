(() => {
    const dateFormatOptions = { weekday: "long" };
    let clockElement = null;
    let dateElement = null;
    let clockIntervalId = null;
    let midnightTimeoutId = null;
    let dateIntervalId = null;

    function initClock() {
        cleanupClock();

        clockElement = document.getElementById("clock_display");
        dateElement = document.getElementById("date_display");
        if (!clockElement || !dateElement) return;

        updateClock();
        updateDate();
        clockIntervalId = setInterval(updateClock, 1000);
        scheduleMidnightUpdate();
        window.currentPageCleanup = cleanupClock;
    }

    function cleanupClock() {
        if (clockIntervalId) clearInterval(clockIntervalId);
        if (midnightTimeoutId) clearTimeout(midnightTimeoutId);
        if (dateIntervalId) clearInterval(dateIntervalId);

        clockIntervalId = null;
        midnightTimeoutId = null;
        dateIntervalId = null;
        clockElement = null;
        dateElement = null;
    }

    function updateDate() {
        if (!dateElement) return;

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const day = new Intl.DateTimeFormat("ja-JP", dateFormatOptions).format(now);
        dateElement.textContent = `${year}年${month}月${date}日(${day})`;
    }

    function updateClock() {
        if (!clockElement) return;

        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const seconds = now.getSeconds().toString().padStart(2, "0");
        clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    }

    function scheduleMidnightUpdate() {
        const now = new Date();
        const nextMidnight = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1,
            0, 0, 0, 0
        );

        midnightTimeoutId = setTimeout(() => {
            updateDate();
            dateIntervalId = setInterval(updateDate, 24 * 60 * 60 * 1000);
        }, nextMidnight - now);
    }

    window.initClock = initClock;
})();