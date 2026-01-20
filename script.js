// Trading Journal - Huvud JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Tema-hantering
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    // Data-hantering
    const STORAGE_KEY = 'tradingJournalData';
    let trades = loadTrades();

    // Initiera formulär
    const form = document.getElementById('trade-form');
    const editModal = document.getElementById('edit-modal');
    const editForm = document.getElementById('edit-form');
    const closeModal = document.querySelector('.close');

    // Sätt dagens datum som standard
    document.getElementById('entry-date').value = new Date().toISOString().slice(0, 16);

    // Event Listeners
    form.addEventListener('submit', handleAddTrade);
    document.getElementById('export-btn').addEventListener('click', exportData);
    document.getElementById('import-btn').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
    document.getElementById('clear-filters').addEventListener('click', clearFilters);
    document.getElementById('clear-all').addEventListener('click', clearAllData);

    // Filter
    ['filter-asset', 'filter-type', 'filter-status'].forEach(id => {
        document.getElementById(id).addEventListener('input', renderTrades);
    });

    // Modal
    closeModal.addEventListener('click', () => editModal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === editModal) editModal.style.display = 'none';
    });

    // Initial render
    renderTrades();
    updateStats();

    // Funktioner
    function handleAddTrade(e) {
        e.preventDefault();
        
        const trade = {
            id: Date.now(),
            asset: document.getElementById('asset').value.toUpperCase(),
            type: document.getElementById('type').value,
            entryDate: document.getElementById('entry-date').value,
            entryPrice: parseFloat(document.getElementById('entry-price').value),
            exitDate: document.getElementById('exit-date').value || null,
            exitPrice: parseFloat(document.getElementById('exit-price').value) || null,
            quantity: parseFloat(document.getElementById('quantity').value),
            fees: parseFloat(document.getElementById('fees').value) || 0,
            notes: document.getElementById('notes').value,
            createdAt: new Date().toISOString()
        };

        // Räkna ut P/L
        if (trade.exitPrice) {
            trade.pnl = calculatePnL(trade);
        }

        trades.push(trade);
        saveTrades();
        form.reset();
        document.getElementById('entry-date').value = new Date().toISOString().slice(0, 16);
        renderTrades();
        updateStats();
    }

    function calculatePnL(trade) {
        const { type, entryPrice, exitPrice, quantity, fees } = trade;
        const multiplier = type === 'long' ? 1 : -1;
        const gross = (exitPrice - entryPrice) * quantity * multiplier;
        return gross - fees;
    }

    function renderTrades() {
        const container = document.getElementById('trades-list');
        const filteredTrades = filterTrades();

        if (filteredTrades.length === 0) {
            container.innerHTML = '<p class="empty-state">Inga affärer matchade ditt filter.</p>';
            return;
        }

        container.innerHTML = filteredTrades.map(trade => {
            const isClosed = !!trade.exitDate;
            const statusClass = isClosed ? (trade.pnl >= 0 ? 'win' : 'loss') : '';
            const pnlColor = trade.pnl >= 0 ? 'var(--success)' : 'var(--danger)';
            
            return `
                <div class="trade-card ${trade.type} ${statusClass}" data-id="${trade.id}">
                    <div class="trade-header">
                        <div class="trade-title">
                            ${trade.asset} - ${trade.type === 'long' ? '📈 Long' : '📉 Short'}
                        </div>
                        <div class="trade-status">
                            ${isClosed ? 
                                `<span class="status-badge status-closed">Stängd</span>` : 
                                `<span class="status-badge status-open">Öppen</span>`
                            }
                        </div>
                    </div>
                    <div class="trade-details">
                        <div class="detail-item">
                            <span class="detail-label">Inkomst:</span>
                            <span class="detail-value">${formatDate(trade.entryDate)}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Inkomstkurs:</span>
                            <span class="detail-value">${trade.entryPrice.toFixed(2)} SEK</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Antal:</span>
                            <span class="detail-value">${trade.quantity}</span>
                        </div>
                        ${isClosed ? `
                            <div class="detail-item">
                                <span class="detail-label">Utgång:</span>
                                <span class="detail-value">${formatDate(trade.exitDate)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Utgångskurs:</span>
                                <span class="detail-value">${trade.exitPrice.toFixed(2)} SEK</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">P/L:</span>
                                <span class="detail-value" style="color: ${pnlColor}">
                                    ${trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)} SEK
                                </span>
                            </div>
                        ` : ''}
                        <div class="detail-item">
                            <span class="detail-label">Avgifter:</span>
                            <span class="detail-value">${trade.fees.toFixed(2)} SEK</span>
                        </div>
                    </div>
                    ${trade.notes ? `
                        <div class="trade-notes">
                            <strong>Anteckningar:</strong> ${trade.notes}
                        </div>
                    ` : ''}
                    <div class="trade-actions">
                        <button class="btn btn-edit" onclick="editTrade(${trade.id})">
                            <i class="fas fa-edit"></i> Redigera
                        </button>
                        <button class="btn btn-delete" onclick="deleteTrade(${trade.id})">
                            <i class="fas fa-trash"></i> Ta bort
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    function filterTrades() {
        const assetFilter = document.getElementById('filter-asset').value.toLowerCase();
        const typeFilter = document.getElementById('filter-type').value;
        const statusFilter = document.getElementById('filter-status').value;

        return trades.filter(trade => {
            const matchesAsset = !assetFilter || trade.asset.toLowerCase().includes(assetFilter);
            const matchesType = !typeFilter || trade.type === typeFilter;
            const isClosed = !!trade.exitDate;
            const matchesStatus = !statusFilter || 
                (statusFilter === 'closed' && isClosed) || 
                (statusFilter === 'open' && !isClosed);
            
            return matchesAsset && matchesType && matchesStatus;
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    function updateStats() {
        const closedTrades = trades.filter(t => t.exitDate);
        const wins = closedTrades.filter(t => t.pnl > 0);
        const losses = closedTrades.filter(t => t.pnl < 0);
        const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);

        document.getElementById('total-trades').textContent = trades.length;
        document.getElementById('win-trades').textContent = wins.length;
        document.getElementById('loss-trades').textContent = losses.length;
        document.getElementById('winrate').textContent = 
            closedTrades.length > 0 ? `${Math.round((wins.length / closedTrades.length) * 100)}%` : '0%';
        
        const pnlElement = document.getElementById('total-pnl');
        pnlElement.textContent = `${totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}`;
        pnlElement.style.color = totalPnL >= 0 ? 'var(--success)' : 'var(--danger)';
    }

    function deleteTrade(id) {
        if (confirm('Är du säker på att du vill ta bort denna affär?')) {
            trades = trades.filter(t => t.id !== id);
            saveTrades();
            renderTrades();
            updateStats();
        }
    }

    function editTrade(id) {
        const trade = trades.find(t => t.id === id);
        if (!trade) return;

        editForm.innerHTML = `
            <input type="hidden" id="edit-id" value="${trade.id}">
            <div class="form-grid">
                <div class="form-group">
                    <label for="edit-asset">Tillgång</label>
                    <input type="text" id="edit-asset" value="${trade.asset}" required>
                </div>
                <div class="form-group">
                    <label for="edit-type">Typ</label>
                    <select id="edit-type" required>
                        <option value="long" ${trade.type === 'long' ? 'selected' : ''}>Long</option>
                        <option value="short" ${trade.type === 'short' ? 'selected' : ''}>Short</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="edit-entry-date">Inkomstdatum</label>
                    <input type="datetime-local" id="edit-entry-date" value="${trade.entryDate}" required>
                </div>
                <div class="form-group">
                    <label for="edit-entry-price">Inkomstkurs</label>
                    <input type="number" id="edit-entry-price" step="0.01" value="${trade.entryPrice}" required>
                </div>
                <div class="form-group">
                    <label for="edit-exit-date">Utgångsdatum</label>
                    <input type="datetime-local" id="edit-exit-date" value="${trade.exitDate || ''}">
                </div>
                <div class="form-group">
                    <label for="edit-exit-price">Utgångskurs</label>
                    <input type="number" id="edit-exit-price" step="0.01" value="${trade.exitPrice || ''}">
                </div>
                <div class="form-group">
                    <label for="edit-quantity">Antal</label>
                    <input type="number" id="edit-quantity" step="0.01" value="${trade.quantity}" required>
                </div>
                <div class="form-group">
                    <label for="edit-fees">Avgifter</label>
                    <input type="number" id="edit-fees" step="0.01" value="${trade.fees}">
                </div>
            </div>
            <div class="form-group">
                <label for="edit-notes">Anteckningar</label>
                <textarea id="edit-notes" rows="3">${trade.notes || ''}</textarea>
            </div>
            <button type="submit" class="btn btn-primary">Uppdatera Affär</button>
        `;

        editModal.style.display = 'block';
        
        editForm.onsubmit = (e) => {
            e.preventDefault();
            updateTrade();
        };
    }

    function updateTrade() {
        const id = parseInt(document.getElementById('edit-id').value);
        const index = trades.findIndex(t => t.id === id);
        
        if (index === -1) return;

        const updatedTrade = {
            ...trades[index],
            asset: document.getElementById('edit-asset').value.toUpperCase(),
            type: document.getElementById('edit-type').value,
            entryDate: document.getElementById('edit-entry-date').value,
            entryPrice: parseFloat(document.getElementById('edit-entry-price').value),
            exitDate: document.getElementById('edit-exit-date').value || null,
            exitPrice: parseFloat(document.getElementById('edit-exit-price').value) || null,
            quantity: parseFloat(document.getElementById('edit-quantity').value),
            fees: parseFloat(document.getElementById('edit-fees').value) || 0,
            notes: document.getElementById('edit-notes').value
        };

        if (updatedTrade.exitPrice) {
            updatedTrade.pnl = calculatePnL(updatedTrade);
        }

        trades[index] = updatedTrade;
        saveTrades();
        editModal.style.display = 'none';
        renderTrades();
        updateStats();
    }

    function exportData() {
        const dataStr = JSON.stringify(trades, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `trading-journal-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function importData(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                if (Array.isArray(imported)) {
                    trades = imported;
                    saveTrades();
                    renderTrades();
                    updateStats();
                    alert('Data importerad framgångsrikt!');
                }
            } catch (error) {
                alert('Ogiltig filformat. Använd JSON.');
            }
        };
        reader.readAsText(file);
    }

    function clearFilters() {
        document.getElementById('filter-asset').value = '';
        document.getElementById('filter-type').value = '';
        document.getElementById('filter-status').value = '';
        renderTrades();
    }

    function clearAllData() {
        if (confirm('⚠️ Är du HELT SÄKER? Detta kommer att radera ALL din data permanent!')) {
            if (confirm('Bekräfta igen - detta går INTE att ångra!')) {
                localStorage.removeItem(STORAGE_KEY);
                trades = [];
                renderTrades();
                updateStats();
                alert('All data har raderats.');
            }
        }
    }

    function saveTrades() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
    }

    function loadTrades() {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    }

    function formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('sv-SE', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Gör funktioner globalt tillgängliga för onclick
    window.editTrade = editTrade;
    window.deleteTrade = deleteTrade;
});
