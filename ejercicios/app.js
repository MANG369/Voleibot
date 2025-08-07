document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.ready();

    const dom = {
        title: document.getElementById('main-title'),
        content: document.getElementById('content-container'),
        backBtn: document.getElementById('back-btn'),
    };

    let state = {
        currentView: 'categories', // 'categories', 'drill_list', 'drill_detail'
        selectedCategory: null,
        selectedDrillId: null,
    };
    
    const render = () => {
        dom.backBtn.style.display = (state.currentView !== 'categories') ? 'block' : 'none';
        switch (state.currentView) {
            case 'categories':
                dom.title.textContent = 'Categorías';
                const categories = [...new Set(DRILLS_DATA.map(d => d.category))];
                dom.content.innerHTML = `<ul class="category-list">${categories.map(c => `<li class="list-item" data-category="${c}">${c}</li>`).join('')}</ul>`;
                break;
            case 'drill_list':
                dom.title.textContent = state.selectedCategory;
                const drillsInCategory = DRILLS_DATA.filter(d => d.category === state.selectedCategory);
                dom.content.innerHTML = `<ul class="drill-list">${drillsInCategory.map(d => `<li class="list-item" data-id="${d.id}">${d.title}</li>`).join('')}</ul>`;
                break;
            case 'drill_detail':
                const drill = DRILLS_DATA.find(d => d.id === state.selectedDrillId);
                dom.title.textContent = drill.title;
                dom.content.innerHTML = `
                    <div class="drill-detail">
                        <h3>Objetivo</h3><p>${drill.objective}</p>
                        <h3>Descripción</h3><p>${drill.description}</p>
                        <h3>Material</h3><p>${drill.material}</p>
                    </div>
                `;
                break;
        }
    };
    
    dom.content.addEventListener('click', (e) => {
        const target = e.target.closest('.list-item');
        if (!target) return;

        if (state.currentView === 'categories') {
            state.currentView = 'drill_list';
            state.selectedCategory = target.dataset.category;
        } else if (state.currentView === 'drill_list') {
            state.currentView = 'drill_detail';
            state.selectedDrillId = parseInt(target.dataset.id);
        }
        render();
    });

    dom.backBtn.addEventListener('click', () => {
        if (state.currentView === 'drill_detail') {
            state.currentView = 'drill_list';
        } else if (state.currentView === 'drill_list') {
            state.currentView = 'categories';
            state.selectedCategory = null;
        }
        render();
    });

    render(); // Render inicial
});