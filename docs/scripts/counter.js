(() => {
    let counterDisplay = null;
    let counter = 0;

    function initCounter() {
        counterDisplay = document.getElementById("counter_display");
        counter = 0;
        updateCounterDisplay();
    }

    function ensureCounterReady() {
        if (!counterDisplay) initCounter();
        return Boolean(counterDisplay);
    }

    function updateCounterDisplay() {
        if (counterDisplay) counterDisplay.textContent = counter;
    }

    function decrement() {
        if (!ensureCounterReady()) return;
        counter -= 1;
        updateCounterDisplay();
    }

    function increment() {
        if (!ensureCounterReady()) return;
        counter += 1;
        updateCounterDisplay();
    }

    function incrementByTen() {
        if (!ensureCounterReady()) return;
        counter += 10;
        updateCounterDisplay();
    }

    function decrementByTen() {
        if (!ensureCounterReady()) return;
        counter -= 10;
        updateCounterDisplay();
    }

    function resetCounter() {
        if (!ensureCounterReady()) return;
        counter = 0;
        updateCounterDisplay();
    }

    window.initCounter = initCounter;
    window.decrement = decrement;
    window.increment = increment;
    window.incrementByTen = incrementByTen;
    window.decrementByTen = decrementByTen;
    window.resetCounter = resetCounter;
})();