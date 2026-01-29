let currentQuestion = 0;
let correctAnswers = 0;
let startTime, questionStartTime;
let num1, num2, answer;
const totalQuestions = 50;
let logs = [];

function startGame() {
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
    
    num1 = Math.floor(Math.random() * 90) + 10;
    num2 = Math.floor(Math.random() * 90) + 10;
    answer = num1 * num2;

    document.getElementById('question-text').innerText = `${num1} × ${num2}`;
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

    const now = new Date();
    const timeTaken = ((now - questionStartTime) / 1000).toFixed(1);
    const isCorrect = userAnswer === answer;

    if (isCorrect) correctAnswers++;

    logs.push({
        no: currentQuestion,
        q: `${num1}×${num2}`,
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