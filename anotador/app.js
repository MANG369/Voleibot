document.addEventListener('DOMContentLoaded', function() {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    const state = {
        teams: { A: { score: 0, sets: 0 }, B: { score: 0, sets: 0 } },
        currentSet: 1, pointsToWin: 25, isGameOver: false
    };
    const dom = {
        scoreA: document.getElementById('scoreA'), setsA: document.getElementById('setsA'),
        scoreB: document.getElementById('scoreB'), setsB: document.getElementById('setsB'),
        matchSetCount: document.getElementById('matchSetCount'),
        pointButtons: document.querySelectorAll('.point-btn'), resetButton: document.getElementById('resetBtn')
    };
    const updateUI = () => {
        dom.scoreA.textContent = state.teams.A.score;
        dom.setsA.textContent = state.teams.A.sets;
        dom.scoreB.textContent = state.teams.B.score;
        dom.setsB.textContent = state.teams.B.sets;
        dom.matchSetCount.textContent = state.isGameOver ? "FIN DEL PARTIDO" : `SET ${state.currentSet}`;
        if (state.lastUpdated) {
            const scoreElement = state.lastUpdated === 'A' ? dom.scoreA : dom.scoreB;
            scoreElement.classList.add('updated');
            setTimeout(() => scoreElement.classList.remove('updated'), 200);
        }
    };
    const checkSetWin = () => {
        const { A, B } = state.teams;
        const winCondition = (s1, s2) => s1 >= state.pointsToWin && (s1 - s2) >= 2;
        if (winCondition(A.score, B.score)) { A.sets++; startNewSet(); }
        else if (winCondition(B.score, A.score)) { B.sets++; startNewSet(); }
    };
    const startNewSet = () => {
        if (state.teams.A.sets >= 2 || state.teams.B.sets >= 2) { state.isGameOver = true; updateUI(); return; }
        state.teams.A.score = 0; state.teams.B.score = 0;
        state.currentSet++;
        if (state.currentSet === 3) { state.pointsToWin = 15; }
    };
    const handlePointChange = (team, action) => {
        if (state.isGameOver) return;
        const currentScore = state.teams[team].score;
        if (action === 'add') { state.teams[team].score++; }
        else if (action === 'subtract' && currentScore > 0) { state.teams[team].score--; }
        state.lastUpdated = team;
        checkSetWin(); updateUI();
        if (action === 'add') { tg.HapticFeedback.impactOccurred('light'); }
    };
    const resetGame = () => {
        state.teams.A = { score: 0, sets: 0 }; state.teams.B = { score: 0, sets: 0 };
        state.currentSet = 1; state.pointsToWin = 25; state.isGameOver = false; state.lastUpdated = null;
        updateUI();
        tg.HapticFeedback.notificationOccurred('warning');
    };
    dom.pointButtons.forEach(button => {
        button.addEventListener('click', () => {
            const team = button.dataset.team;
            const action = button.dataset.action;
            handlePointChange(team, action);
        });
    });
    dom.resetButton.addEventListener('click', resetGame);
    updateUI();
});