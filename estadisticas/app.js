document.addEventListener('DOMContentLoaded', function() {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();

    const state = { roster: [], selectedPlayerId: null, nextId: 1 };
    const STAT_KEYS = {
        serve_ok: 'Saque OK', serve_err: 'Error Saque',
        atk_ok: 'Ataque OK', atk_err: 'Error Ataque',
        block_ok: 'Bloqueo OK', dig_ok: 'Defensa OK',
        rcv_ok: 'Recepción OK', rcv_err: 'Error Recepción'
    };

    const dom = {
        addPlayerForm: document.getElementById('add-player-form'),
        playerNameInput: document.getElementById('player-name'),
        playerNumberInput: document.getElementById('player-number'),
        rosterList: document.getElementById('roster-list'),
        loggerPanel: document.getElementById('logger-panel'),
        selectedPlayerName: document.getElementById('selected-player-name'),
        actionButtons: document.querySelectorAll('.action-btn'),
        statsTableContainer: document.getElementById('stats-table-container'),
        exportBtn: document.getElementById('export-btn')
    };

    const renderRoster = () => {
        dom.rosterList.innerHTML = '';
        state.roster.forEach(player => {
            const li = document.createElement('li');
            li.dataset.id = player.id;
            li.className = player.id === state.selectedPlayerId ? 'selected' : '';
            li.innerHTML = `<span class="player-number">${player.number}</span> ${player.name}`;
            li.addEventListener('click', () => selectPlayer(player.id));
            dom.rosterList.appendChild(li);
        });
    };

    const renderStatsTable = () => {
        if (state.roster.length === 0) {
            dom.statsTableContainer.innerHTML = `<p class="hint-text">Añade jugadores y registra acciones.</p>`;
            dom.exportBtn.style.display = 'none';
            return;
        }
        let tableHTML = `<table><thead><tr><th>#</th><th>Jugador</th>`;
        Object.values(STAT_KEYS).forEach(name => tableHTML += `<th>${name}</th>`);
        tableHTML += `</tr></thead><tbody>`;
        state.roster.forEach(player => {
            tableHTML += `<tr><td>${player.number}</td><td>${player.name}</td>`;
            Object.keys(STAT_KEYS).forEach(key => { tableHTML += `<td>${player.stats[key]}</td>`; });
            tableHTML += `</tr>`;
        });
        tableHTML += `</tbody></table>`;
        dom.statsTableContainer.innerHTML = tableHTML;
        dom.exportBtn.style.display = 'block';
    };

    const updateLoggerView = () => {
        if (state.selectedPlayerId === null) {
            dom.loggerPanel.style.display = 'none'; return;
        }
        const player = state.roster.find(p => p.id === state.selectedPlayerId);
        if (player) {
            dom.selectedPlayerName.textContent = `#${player.number} ${player.name}`;
            dom.loggerPanel.style.display = 'block';
        }
    };

    const addPlayer = (e) => {
        e.preventDefault();
        const name = dom.playerNameInput.value.trim();
        const number = dom.playerNumberInput.value;
        if (name && number) {
            const newPlayer = { id: state.nextId++, name, number, stats: {} };
            Object.keys(STAT_KEYS).forEach(key => newPlayer.stats[key] = 0);
            state.roster.push(newPlayer);
            dom.addPlayerForm.reset();
            renderRoster(); renderStatsTable();
            tg.HapticFeedback.notificationOccurred('success');
        }
    };

    const selectPlayer = (id) => {
        state.selectedPlayerId = id;
        renderRoster(); updateLoggerView();
        tg.HapticFeedback.impactOccurred('light');
    };

    const logAction = (action) => {
        if (state.selectedPlayerId === null) { tg.showAlert('Por favor, selecciona un jugador primero.'); return; }
        const player = state.roster.find(p => p.id === state.selectedPlayerId);
        if (player) {
            player.stats[action]++;
            renderStatsTable();
            tg.HapticFeedback.impactOccurred('medium');
        }
    };

    const exportToCSV = () => {
        const headers = ["Numero", "Jugador", ...Object.values(STAT_KEYS)].join(',');
        let csvContent = headers + "\r\n";
        state.roster.forEach(player => {
            const row = [player.number, player.name, ...Object.keys(STAT_KEYS).map(key => player.stats[key])].join(',');
            csvContent += row + "\r\n";
        });
        navigator.clipboard.writeText(csvContent).then(() => {
            tg.showAlert('¡Estadísticas copiadas al portapapeles!');
        }, () => {
            tg.showAlert('Error al copiar las estadísticas.');
        });
    };

    dom.addPlayerForm.addEventListener('submit', addPlayer);
    dom.actionButtons.forEach(btn => btn.addEventListener('click', () => logAction(btn.dataset.action)));
    dom.exportBtn.addEventListener('click', exportToCSV);
    renderStatsTable();
});