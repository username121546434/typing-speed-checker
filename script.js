let textToType = document.getElementById('text'),
    currentText = document.getElementById('keyboard'),
    notDone = document.getElementById('not-done'),
    done = document.getElementById('done'),
    wpmCount = document.getElementById('wpm'),
    restartBtn = document.getElementById('restart-btn'),
    started = false,
    typingTestDone = false,
    startTime,
    currentWord,
    averageLengthOfWord;

function sum(x) {
    let total = 0;
    for (let index = 0; index < x.length; index++) {
        const element = x[index];
        total += element;
    }
    return total
}

function getLengths(x) {
    const words = x.split(' ');
    let lengths = [];
    words.forEach((val, idx) => {
        lengths.push(val.length)
    })
    return lengths
}

function setSentence(json) {
    const sentence = json[0].word;
    notDone.innerText = sentence;
    currentWord = sentence.split(' ')[0];
    averageLengthOfWord = sum(getLengths(sentence)) / sentence.split(' ').length;
    seconds = 0;
}

function getRandomSentence() {
    fetch("https://random-words-api.vercel.app/word/sentence")
        .then((res)=> res.json())
        .then((json) => setSentence(json))
        .catch((error) => console.error(error));
}

function getNextWord() {
    const sentence = notDone.innerText;
    const words = sentence.split(' ');
    currentWord = words[0];
    return currentWord;
}

function moveLetter(correct) {
    let newText = notDone.innerText.replace(currentWord + ' ', '');

    if (correct) {
        done.innerHTML = done.innerHTML + currentWord + ' ';
    } else {
        done.innerHTML = done.innerHTML + `<span class="wrong">${currentWord}</span> `
    }
    
    if (newText === notDone.innerText) {
        // we did the last word
        newText = '';
        notDone.innerText = newText;
        currentWord = null;
        return;
    }
    
    notDone.innerText = newText;
    currentWord = newText.split(' ')[0];
}

currentText.addEventListener('input', (event) => {
    if (typingTestDone) {
        return;
    }

    let text = event.target.value;

    if (text[0] === notDone.innerText[0] && !started) {
        startTime = Date.now() / 1000;
        started = true;
    }

    if (text.charAt(text.length - 1) != ' ' && text.charAt(text.length - 1) != '.') {
        return;
    }

    if (text.charAt(text.length - 1) == '.' && text == currentWord) {
        moveLetter(true);
    } else if (text.slice(0, text.length - 1) != currentWord) {
        moveLetter(false);
    } else {
        moveLetter(true);
    }

    if (currentWord === null) {
        let timeTaken = (Date.now() / 1000) - startTime,
            lengthOfSentence = done.innerText.length;
        let cps = lengthOfSentence / timeTaken;
        let wpm = (cps / averageLengthOfWord) * 60;

        wpmCount.innerText = `Your wpm is: ${wpm}`;
        wpmCount.style.opacity = 1;
        restartBtn.style.opacity = 1;
        typingTestDone = true;
    }

    currentText.value = '';
});

getRandomSentence();
