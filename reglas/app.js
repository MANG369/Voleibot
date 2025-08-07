document.addEventListener('DOMContentLoaded', () => {
    const tg = window.Telegram.WebApp;
    tg.ready();

    const dom = {
        searchBar: document.getElementById('search-bar'),
        content: document.getElementById('content-container'),
    };

    const renderContent = (filter = '') => {
        const lowerCaseFilter = filter.toLowerCase();
        let html = '';

        // Filtrar y agrupar reglas
        const filteredRules = RULES_DATA.filter(rule => 
            rule.title.toLowerCase().includes(lowerCaseFilter) || 
            rule.content.toLowerCase().includes(lowerCaseFilter)
        );

        const categories = [...new Set(filteredRules.map(rule => rule.category))];

        categories.forEach(category => {
            html += `<h2 class="category-title">${category}</h2>`;
            filteredRules.filter(rule => rule.category === category).forEach(rule => {
                html += `
                    <div class="accordion-item">
                        <div class="accordion-header">${rule.title}</div>
                        <div class="accordion-content"><p>${rule.content}</p></div>
                    </div>
                `;
            });
        });

        // Filtrar y mostrar señales
        const filteredSignals = SIGNALS_DATA.filter(signal => signal.title.toLowerCase().includes(lowerCaseFilter));
        if (filteredSignals.length > 0) {
            html += `<h2 class="category-title">Señales Arbitrales</h2>`;
            html += `<div class="signal-grid">`;
            filteredSignals.forEach(signal => {
                html += `
                    <div class="signal-card">
                        <img src="${signal.imageUrl}" alt="${signal.title}">
                        <p>${signal.title}</p>
                    </div>
                `;
            });
            html += `</div>`;
        }

        dom.content.innerHTML = html;
    };

    dom.searchBar.addEventListener('input', (e) => {
        renderContent(e.target.value);
    });

    dom.content.addEventListener('click', (e) => {
        const header = e.target.closest('.accordion-header');
        if (header) {
            const item = header.parentElement;
            const content = header.nextElementSibling;
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0';
            }
        }
    });

    renderContent();
});