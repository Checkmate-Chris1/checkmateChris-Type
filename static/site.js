console.log("Site JS loaded!");

let wordsPerPassage = 25;
const typingArea = document.getElementById("typing-area");
const restartButton = document.getElementById("restart");
let letters = document.getElementsByClassName("letter");
let currentLetter = 0;
let lettersCorrect = 0;

const infoBar = document.getElementById("info-bar");
const wpm = document.getElementById("wpm");
const time = document.getElementById("time");
let timer = 0;
let timerInterval = null;
let wpmInterval = null;

let currentMode = 0;
let currentSetting = 1;
let modalVisible = false;

// ---- add this baseline for wrap detection ----
let currentLineTop = null;

 // On load, generate words
startInfoBar();
restart();

// Typing logic
document.addEventListener("keydown", (event) => {
    if(event.key == "Control" || event.key == "Shift" || event.key == "Alt" || event.key == "Meta" || event.key == "Enter" || modalVisible) {
        return;
    }
    if(event.key == "Tab") {
        event.preventDefault();
        restart();
        return;
    }
    if(event.key == "Backspace") {
        if(currentLetter > 0 && currentLetter < letters.length) {
            currentLetter--;
            letters[currentLetter+1].classList.remove("active");
            letters[currentLetter].classList.add("active");
            letters[currentLetter].classList.remove("correct", "incorrect");
            updateScroll();
        }
        return;
    }
    if(currentLetter >= letters.length-1) { // -1 cause space at last word
        clearInterval(timerInterval);
        clearInterval(wpmInterval);
        updateWPM();
    }

    if (event.key === letters[currentLetter].innerText) {
        letters[currentLetter].classList.add("correct");
        const sfx = document.createElement("audio");
        sfx.src = "/static/click.mp3";
        sfx.play();
        lettersCorrect++;
    } else {
        letters[currentLetter].classList.add("incorrect");
    }

    if(currentLetter == 0) startInfoBar();

    currentLetter++;
    letters[currentLetter-1].classList.remove("active");
    letters[currentLetter].classList.add("active");
    updateScroll();
});

// ---- detect wrap and scroll one full line ----
function updateScroll() {
    const span = letters[currentLetter];
    const top = span.offsetTop;
    if (currentLineTop === null) {
        currentLineTop = top;
    } else if (top > currentLineTop) {
        const lineHeight = span.getBoundingClientRect().height; // Height of element
        smoothScrollBy(lineHeight, 600);
        currentLineTop = top;
    } else if (top < currentLineTop) {
        const lineHeight = span.getBoundingClientRect().height; // Height of element
        smoothScrollBy(-lineHeight, 600);
        currentLineTop = top;
    }
}
// smooth-scroll helper: distance in px, duration in ms
function smoothScrollBy(distance, duration) {
    const start = typingArea.scrollTop;
    const end = start + distance;
    const startTime = performance.now();
  
    function easeInOut(t) {
      return t<.5 ? 2*t*t : -1 + (4-2*t)*t;
    }
  
    function frame(now) {
        const progress = (now - startTime)/duration; // 0 is start, 1 is finished
        typingArea.scrollTop = start + distance*easeInOut(progress);
        if (progress < 1) requestAnimationFrame(frame);
    }
  
    requestAnimationFrame(frame);
}

// Restart typingArea
function restart() {
    console.log("Restarting typing session");
    currentLetter = 0;
    lettersCorrect = 0;
    timer = 0;
    clearInterval(timerInterval);
    clearInterval(wpmInterval);

    // ---- reset wrap baseline ----
    currentLineTop = null;

    const children = typingArea.childNodes;

    for(let i = 0; i < children.length; i++) {
        children[i].remove();
        i--; // List updates live (even though it's const)
    }

    if(currentMode === 0) {
        fetch("/words", {
            method: "POST",
            body: wordsPerPassage
        }).then(response => {
            return response.json();
        }).then(words => {
            for(let i = 0; i < words.length; i++) {
                for(let j = 0; j < words[i].length; j++) {
                    const letter = document.createElement("span");
                    letter.classList.add("letter");
                    letter.innerText = words[i][j];
                    //if(j = words[i].length - 1) { letter.innerText += " ";}
                    typingArea.appendChild(letter);
                }
                // Add a space after each word except the last one
                if(i < words.length-1) {
                    const space = document.createElement("span");
                    space.innerText = " ";
                    space.classList.add("letter");
                    typingArea.appendChild(space);
                }
            }
        });
    } else if(currentMode === 1) {
        fetch("/quotes", {
            method: "POST",
            body: currentSetting
        }).then(response => {
            return response.json();
        }).then(words => {
            for(let i = 0; i < words.length; i++) {
                for(let j = 0; j < words[i].length; j++) {
                    const letter = document.createElement("span");
                    letter.classList.add("letter");
                    letter.innerText = words[i][j];
                    //if(j = words[i].length - 1) { letter.innerText += " ";}
                    typingArea.appendChild(letter);
                }
                // Add a space after each word except the last one
                if(i < words.length-1) {
                    const space = document.createElement("span");
                    space.innerText = " ";
                    space.classList.add("letter");
                    typingArea.appendChild(space);
                }
            }
        });
    }
}

// Info bar logic/updates
function updateWPM() {
    wpm.innerText = "wpm: " + ((lettersCorrect/5)/(timer/60)).toFixed(2); // 5 letters = 1 word
}
function updateTimer() {
    timer += 0.01;
    const minutes = Math.floor(timer / 60);
    const seconds = Math.floor(timer % 60);
    time.innerText = "time: " + minutes + ":" + seconds.toString().padStart(2, '0');
}
function startInfoBar() {
    timerInterval = setInterval(updateTimer, 10); // Every 0.1s
    wpmInterval = setInterval(updateWPM, 1000);
}

// Settings button functionality
function changeMode(mode) {
    mode--; // so mode1 is index 0
    const wordsMode = document.getElementById("words-mode");
    const quotesMode = document.getElementById("quotes-mode");
    const customMode = document.getElementById("custom-mode");
    const modeElements = [wordsMode, quotesMode, customMode];

    const option1 = document.getElementById("setting-1");
    const option2 = document.getElementById("setting-2");
    const option3 = document.getElementById("setting-3");
    const option4 = document.getElementById("setting-4");

    modeElements[currentMode].classList.remove("selected");
    modeElements[mode].classList.add("selected");
    currentMode = mode;

    if(mode === 0) { // words mode
        option1.innerText = "10"; option1.style.width = "2em";
        option2.innerText = "25"; option2.style.width = "2em";
        option3.innerText = "50"; option3.style.width = "2em";
        option4.innerText = "100"; option4.style.width = "2em";
    } else if(mode === 1) { // quotes mode
        option1.innerText = "short"; option1.style.width = "5ex";
        option2.innerText = "medium"; option2.style.width = "8ex";
        option3.innerText = "long"; option3.style.width = "5ex";
        option4.innerText = "thicc"; option4.style.width = "5ex";
    } else if(mode === 2) { // custom mode
        option1.innerText = ""; option1.style.width = "0";
        option2.innerText = ""; option2.style.width = "0";
        option3.innerText = ""; option3.style.width = "0";
        option4.innerText = "set text"; option4.style.width = "8ex";
    }

    restart();
}

function changeSetting(setting) {
    setting--; // so setting1 is index 0
    const option1 = document.getElementById("setting-1");
    const option2 = document.getElementById("setting-2");
    const option3 = document.getElementById("setting-3");
    const option4 = document.getElementById("setting-4");
    const optionElements = [option1, option2, option3, option4];

    if(currentMode === 0) { // word mode
        optionElements[currentSetting].classList.remove("selected");
        optionElements[setting].classList.add("selected");
        currentSetting = setting;

        switch(currentSetting) {
            case 0:
                wordsPerPassage = 10;
                break;
            case 1:
                wordsPerPassage = 25;
                break;
            case 2:
                wordsPerPassage = 50;
                break;
            case 3:
                wordsPerPassage = 100;
                break;
        }
        restart();
    } else if(currentMode === 1) {
        optionElements[currentSetting].classList.remove("selected");
        optionElements[setting].classList.add("selected");
        currentSetting = setting;

        restart();
    } else if(currentMode === 2) { // custom mode, must be set-text-button
        const modal = document.getElementById("set-text-modal");
        modal.style.visibility = "visible";
        modalBackground.style.visibility = "visible";
        modalVisible = true;
    }
}

function hideSetTextModal() {
    const modal = document.getElementById("set-text-modal");
    const modalBackground = document.getElementById("set-text-modal-background");
    modal.style.visibility = "hidden";
    modalBackground.style.visibility = "hidden";
    modalVisible = false;
}