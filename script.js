let currentwords = [];

function creategrid() {
    const grid = document.getElementById("crossword-grid");
    grid.innerHTML = "";

    for (let i = 0; i < 100; i++) {
        const cell = document.createElement("input");
        cell.setAttribute("maxlength", 1);
        grid.appendChild(cell);
    }
}

function generateCrossword(words) {
    let crossword = Array.from({ length: 10 }, () => Array(10).fill("."))

    function canplace(word, x, y, dx, dy) {
        if (x + dx * word.length > 10 || y + dy * word.length > 10) return false;

        for (let i = 0; i < word.length; i++) {
            let ch = crossword[y + i * dy][x + i * dx];
            if (ch != "." && ch != word[i]) return false
        }
        return true
    }

    function placeword(word, x, y, dx, dy) {
        for (let i = 0; i < word.length; i++) {
            crossword[y + i * dy][x + i * dx] = word[i];
        }
    }

    words.sort(() => Math.random() - 0.5);

    for (let word of words) {
        for (let i = 0; i < 100; i++) {
            let [dx, dy] = [[1, 0], [0, 1], [1, 1]][Math.floor(Math.random() * 3)];
            let x = Math.floor(Math.random() * 10);
            let y = Math.floor(Math.random() * 10);
            let wordchoice = Math.random() > 0.5 ? word.split("").reverse().join("") : word;

            if (canplace(wordchoice, x, y, dx, dy)) {
                console.log("Adding word: ", word);
                placeword(wordchoice, x, y, dx, dy);
                break;
            }
        }
    }

    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            let coordinate = crossword[y][x];
            if (coordinate === ".") {
                crossword[y][x] = String.fromCharCode(97 + Math.floor(Math.random() * 26))
            }
        }
    }
    return crossword
}

function renderCrossword(crossword) {
    const cells = document.querySelectorAll("#crossword-grid input")
    let idx = 0;

    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            cells[idx].value = crossword[y][x].toUpperCase();
            cells[idx].readOnly = true;
            idx++;
        }
    }
}

function newPuzzle(words) {
    creategrid();
    crossword = generateCrossword(words);
    renderCrossword(crossword);
    document.querySelectorAll(".modal-body ol input").forEach(inp => inp.value = "");
}

document.getElementById("crossword").addEventListener("shown.bs.modal", () => {
    const msg = document.getElementById("message");
    msg.textContent = "Please enter 5 words separated by space";
    msg.style.color = "green";
})

document.getElementById("reloadgrid").addEventListener("click", () => {
    const input = document.getElementById("crossword-5words").value.trim();
    const msg = document.getElementById("message");

    if (input === "") {
        msg.textContent = "1. Please enter 5 words separated by space, each <= 10 characters";
        msg.style.color = "red";
        return;
    }
    let words = input.split(/\s+/).map(w => w.toUpperCase());
    const alpharegex = /^[a-zA-Z]+$/;
    if (words.length !== 5) {
        msg.textContent = "2. Please enter 5 words separated by space, each <= 10 characters";
        msg.style.color = "red";
        return;
    }
    for (let word of words) {
        if (!alpharegex.test(word)) {
            msg.textContent = "3. Please enter 5 words separated by space, each <= 10 characters";
            msg.style.color = "red";
            return;
        }
    }
    currentwords = words;
    newPuzzle(words);

})

document.getElementById("checkanswer").addEventListener("click", () => {
    const input = document.querySelectorAll(".modal-body ol input");
    const msg = document.getElementById("message")
    let useranswer = Array.from(input).map(inp => inp.value.trim().toUpperCase());

    let correct = currentwords.every(word => useranswer.includes(word));

    msg.textContent = correct ? "Correct!!" : "Incorrect!!";

})