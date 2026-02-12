const counterDisplay = document.getElementById("counter_display");
let counter = 0;
function decrement(){
    counter -= 1;
    counterDisplay.textContent = counter;
}

function increment(){
    counter += 1;
    counterDisplay.textContent = counter;
}

function incrementByTen(){
    counter += 10;
    counterDisplay.textContent = counter;
}

function decrementByTen(){
    counter -= 10;
    counterDisplay.textContent = counter;
}

function resetCounter(){
    counter = 0;
    counterDisplay.textContent = counter;
}