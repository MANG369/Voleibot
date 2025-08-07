document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.ready();

    const dom = {
        playerList: document.getElementById('player-list-container'),
        addPlayerBtn: document.getElementById('add-player-btn'),
        modal: document.getElementById('player-modal'),
        modalTitle: document.getElementById('modal-title'),
        playerForm: document.getElementById('player-form'),
        cancelBtn: document.getElementById('cancel-btn'),
        playerId: document.getElementById('player-id'),
        playerName: document.getElementById('player-name'),
        playerNumber: document.getElementById('player-number'),
        playerPosition: document.getElementById('player-position'),
    };

    let state = {
        roster: JSON.parse(localStorage.getItem('voleibot-roster') || '[]'),
    };

    const saveRoster = () => {
        localStorage.setItem('voleibot-roster', JSON.stringify(state.roster));
    };

    const renderRoster = () => {
        dom.playerList.innerHTML = '';
        if (state.roster.length === 0) {
            dom.playerList.innerHTML = '<p class="hint-text">Aún no hay jugadores. Añade uno con el botón +.</p>';
            return;
        }
        state.roster.sort((a, b) => a.number - b.number).forEach(player => {
            const card = document.createElement('div');
            card.className = 'player-card';
            card.innerHTML = `
                <div class="player-number-badge">${player.number}</div>
                <div class="player-info">
                    <h3>${player.name}</h3>
                    <p>${player.position}</p>
                </div>
                <div class="player-actions">
                    <button class="edit-btn" data-id="${player.id}">✏️</button>
                    <button class="delete-btn" data-id="${player.id}">🗑️</button>
                </div>
            `;
            dom.playerList.appendChild(card);
        });
    };

    const showModal = (playerToEdit = null) => {
        dom.playerForm.reset();
        if (playerToEdit) {
            dom.modalTitle.textContent = 'Editar Jugador';
            dom.playerId.value = playerToEdit.id;
            dom.playerName.value = playerToEdit.name;
            dom.playerNumber.value = playerToEdit.number;
            dom.playerPosition.value = playerToEdit.position;
        } else {
            dom.modalTitle.textContent = 'Añadir Jugador';
            dom.playerId.value = '';
        }
        dom.modal.style.display = 'flex';
    };

    const hideModal = () => dom.modal.style.display = 'none';

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const playerData = {
            id: dom.playerId.value ? parseInt(dom.playerId.value) : Date.now(),
            name: dom.playerName.value,
            number: dom.playerNumber.value,
            position: dom.playerPosition.value,
        };
        if (dom.playerId.value) { // Editando
            state.roster = state.roster.map(p => p.id === playerData.id ? playerData : p);
        } else { // Añadiendo
            state.roster.push(playerData);
        }
        saveRoster();
        renderRoster();
        hideModal();
    };
    
    const handleDelete = (id) => {
        const player = state.roster.find(p => p.id === id);
        tg.showConfirm(`¿Seguro que quieres eliminar a ${player.name}?`, (confirmed) => {
            if (confirmed) {
                state.roster = state.roster.filter(p => p.id !== id);
                saveRoster();
                renderRoster();
            }
        });
    };
    
    dom.addPlayerBtn.addEventListener('click', () => showModal());
    dom.cancelBtn.addEventListener('click', hideModal);
    dom.playerForm.addEventListener('submit', handleFormSubmit);
    dom.playerList.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const id = parseInt(target.dataset.id);
        if (target.classList.contains('edit-btn')) {
            const player = state.roster.find(p => p.id === id);
            showModal(player);
        }
        if (target.classList.contains('delete-btn')) {
            handleDelete(id);
        }
    });

    renderRoster();
});