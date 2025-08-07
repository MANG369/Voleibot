document.addEventListener('DOMContentLoaded', function() {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function beep(type = 'start', duration = 100) {
        if (audioCtx.state === 'suspended') { audioCtx.resume(); }
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        gainNode.gain.value = 0.1;
        oscillator.frequency.value = (type === 'start') ? 880 : 440;
        oscillator.type = 'sine';
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + duration / 1000);
    }

    let state = {
        intervalId: null, isPaused: false, totalWorkSeconds: 0, totalRestSeconds: 0,
        totalRounds: 0, currentRound: 1, isWorkPhase: true, timeLeft: 0,
    };

    const dom = {
        setupView: document.getElementById('setup-view'), timerView: document.getElementById('timer-view'),
        workMin: document.getElementById('work-min'), workSec: document.getElementById('work-sec'),
        restMin: document.getElementById('rest-min'), restSec: document.getElementById('rest-sec'),
        rounds: document.getElementById('rounds'), startBtn: document.getElementById('start-btn'),
        pauseBtn: document.getElementById('pause-btn'), resetBtn: document.getElementById('reset-btn'),
        timeLeftDisplay: document.getElementById('time-left'), statusDisplay: document.getElementById('timer-status'),
        roundCounter: document.getElementById('round-counter'), presetsSelect: document.getElementById('presets-select'),
        presetName: document.getElementById('preset-name'), savePresetBtn: document.getElementById('save-preset-btn'),
    };

    const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
    const tick = () => {
        state.timeLeft--;
        dom.timeLeftDisplay.textContent = formatTime(state.timeLeft);
        if (state.timeLeft <= 0) {
            if (state.isWorkPhase) {
                if (state.currentRound >= state.totalRounds) { beep('end', 1000); resetTimer(); return; }
                beep('rest'); state.isWorkPhase = false; state.timeLeft = state.totalRestSeconds;
                dom.statusDisplay.textContent = 'DESCANSO'; document.body.className = 'state-rest';
            } else {
                beep('start'); state.isWorkPhase = true; state.currentRound++;
                state.timeLeft = state.totalWorkSeconds;
                dom.statusDisplay.textContent = 'TRABAJO'; document.body.className = 'state-work';
            }
            dom.roundCounter.textContent = `Ronda ${state.currentRound} / ${state.totalRounds}`;
        }
    };

    const startTimer = () => {
        audioCtx.resume(); // Ensure audio context is active
        state.totalWorkSeconds = parseInt(dom.workMin.value)*60 + parseInt(dom.workSec.value);
        state.totalRestSeconds = parseInt(dom.restMin.value)*60 + parseInt(dom.restSec.value);
        state.totalRounds = parseInt(dom.rounds.value);
        state.timeLeft = state.totalWorkSeconds; state.currentRound = 1; state.isWorkPhase = true;
        
        dom.setupView.classList.remove('active'); dom.timerView.classList.add('active');
        document.body.className = 'state-work'; dom.statusDisplay.textContent = 'TRABAJO';
        dom.roundCounter.textContent = `Ronda ${state.currentRound} / ${state.totalRounds}`;
        dom.timeLeftDisplay.textContent = formatTime(state.timeLeft);
        
        beep('start');
        state.intervalId = setInterval(tick, 1000);
    };

    const pauseTimer = () => {
        if (state.intervalId) {
            clearInterval(state.intervalId); state.intervalId = null; dom.pauseBtn.textContent = 'Reanudar';
        } else {
            state.intervalId = setInterval(tick, 1000); dom.pauseBtn.textContent = 'Pausar';
        }
    };
    
    const resetTimer = () => {
        clearInterval(state.intervalId); state.intervalId = null; document.body.className = '';
        dom.timerView.classList.remove('active'); dom.setupView.classList.add('active');
        dom.pauseBtn.textContent = 'Pausar';
    };

    const savePreset = () => {
        const name = dom.presetName.value.trim();
        if (!name) { tg.showAlert('Por favor, dale un nombre al preset.'); return; }
        const presets = JSON.parse(localStorage.getItem('voleibot-presets') || '[]');
        presets.push({
            name, workMin: dom.workMin.value, workSec: dom.workSec.value,
            restMin: dom.restMin.value, restSec: dom.restSec.value, rounds: dom.rounds.value,
        });
        localStorage.setItem('voleibot-presets', JSON.stringify(presets));
        loadPresets(); dom.presetName.value = ''; tg.showAlert('Preset guardado.');
    };

    const loadPresets = () => {
        const presets = JSON.parse(localStorage.getItem('voleibot-presets') || '[]');
        dom.presetsSelect.innerHTML = '<option value="">Cargar preset...</option>';
        presets.forEach(p => {
            const option = document.createElement('option');
            option.value = JSON.stringify(p); option.textContent = p.name;
            dom.presetsSelect.appendChild(option);
        });
    };

    dom.startBtn.addEventListener('click', startTimer);
    dom.pauseBtn.addEventListener('click', pauseTimer);
    dom.resetBtn.addEventListener('click', resetTimer);
    dom.savePresetBtn.addEventListener('click', savePreset);
    dom.presetsSelect.addEventListener('change', (e) => {
        if (!e.target.value) return;
        const p = JSON.parse(e.target.value);
        dom.workMin.value = p.workMin; dom.workSec.value = p.workSec;
        dom.restMin.value = p.restMin; dom.restSec.value = p.restSec;
        dom.rounds.value = p.rounds;
    });

    loadPresets();
});