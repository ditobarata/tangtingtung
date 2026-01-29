let currentQuestion = 0;
let correctAnswers = 0;
let startTime, questionStartTime;
let num1, num2, displayNum1, displayNum2, answer;
let gameMode = "perkalian";
let gameLevel = "sedang";
const totalQuestions = 50;
let logs = [];
let playerName = "";

function startGame() {
    const nameInput = document.getElementById('player-name');
    playerName = nameInput.value.trim() || "Pemain Anonim"; // Default jika kosong
    gameMode = document.querySelector('input[name="game-mode"]:checked').value;
    gameLevel = document.querySelector('input[name="game-level"]:checked').value;

    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    document.getElementById('result-screen').classList.add('hidden');
    
    startTime = new Date();
    nextQuestion();
}

function nextQuestion() {
    if (currentQuestion >= totalQuestions) {
        endGame();
        return;
    }
    currentQuestion++;
    
    document.getElementById('current-count').innerText = currentQuestion;
    document.getElementById('progress-fill').style.width = (currentQuestion / totalQuestions * 100) + '%';
    
    // Penentuan rentang angka berdasarkan level
    let min, max;
    if (gameLevel === "mudah") { min = 2; max = 12; }
    else if (gameLevel === "sedang") { min = 10; max = 50; }
    else { min = 10; max = 99; }

    if (gameMode === "perkalian") {
        num1 = Math.floor(Math.random() * (max - min + 1)) + min;
        num2 = Math.floor(Math.random() * (max - min + 1)) + min;
        displayNum1 = num1;
        displayNum2 = num2;
        answer = num1 * num2;
    } else {
        let hasilBagi = Math.floor(Math.random() * (max - min + 1)) + min;
        let pembagi = (gameLevel === "sulit") ? Math.floor(Math.random() * 11) + 2 : Math.floor(Math.random() * 8) + 2;
        displayNum1 = hasilBagi * pembagi;
        displayNum2 = pembagi;
        answer = hasilBagi;
    }

    const symbol = gameMode === "perkalian" ? "×" : "÷";
    document.getElementById('question-text').innerText = `${displayNum1} ${symbol} ${displayNum2}`;
    
    const inputField = document.getElementById('answer');
    inputField.value = '';
    inputField.focus();
    questionStartTime = new Date();
}

function checkEnter(e) { if (e.key === "Enter") submitAnswer(); }

function submitAnswer() {
    const inputField = document.getElementById('answer');
    const userAnswer = parseInt(inputField.value);
    if (isNaN(userAnswer)) return;

    const isCorrect = userAnswer === answer;
    
    // Mainkan suara
    if (isCorrect) {
        document.getElementById('snd-correct').play().catch(()=>{});
        correctAnswers++;
    } else {
        document.getElementById('snd-wrong').play().catch(()=>{});
        // Efek getar HP jika salah (hanya jalan di Android/Chrome)
        if (navigator.vibrate) navigator.vibrate(200);
    }

    const now = new Date();
    const timeTaken = ((now - questionStartTime) / 1000).toFixed(1);
    const symbol = gameMode === "perkalian" ? "×" : "÷";

    logs.push({
        no: currentQuestion,
        q: `${displayNum1}${symbol}${displayNum2}`,
        time: timeTaken,
        res: isCorrect ? "✅" : `❌ (${answer})`,
        cls: isCorrect ? "row-correct" : "row-wrong"
    });

    nextQuestion();
}

function endGame() {
    const endTime = new Date();
    const totalTime = Math.floor((endTime - startTime) / 1000);
    
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    document.getElementById('display-name').innerText = playerName;
    document.getElementById('final-correct').innerText = `${correctAnswers} / ${totalQuestions}`;
    document.getElementById('final-time').innerText = `${totalTime} detik`;
    
    const statsBody = document.getElementById('stats-body');
    statsBody.innerHTML = logs.map(log => `
        <tr>
            <td>${log.no}</td>
            <td>${log.q}</td>
            <td>${log.time}s</td>
            <td class="${log.cls}">${log.res}</td>
        </tr>
    `).join('');
}