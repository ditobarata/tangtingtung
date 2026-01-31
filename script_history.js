function saveToHistory() {
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    let history = JSON.parse(localStorage.getItem('gameHistory')) || {};

    // Jika hari ini belum ada catatan, mulai dari 1. Jika sudah ada, tambah 1.
    history[today] = (history[today] || 0) + 1;

    localStorage.setItem('gameHistory', JSON.stringify(history));
}

function showHistory() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('history-screen').classList.remove('hidden');
    
    renderHeatmap();
}

function hideHistory() {
    document.getElementById('history-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
}

function renderHeatmap() {
    const history = JSON.parse(localStorage.getItem('gameHistory')) || {};
    const container = document.getElementById('calendar-heatmap');
    container.innerHTML = ""; 

    const year = 2026; 
    // Data lengkap 12 bulan
    const months = [
        { name: 'Jan', days: 31 }, { name: 'Feb', days: 28 }, { name: 'Mar', days: 31 },
        { name: 'Apr', days: 30 }, { name: 'Mei', days: 31 }, { name: 'Jun', days: 30 },
        { name: 'Jul', days: 31 }, { name: 'Agu', days: 31 }, { name: 'Sep', days: 30 },
        { name: 'Okt', days: 31 }, { name: 'Nov', days: 30 }, { name: 'Des', days: 31 }
    ];

    // --- PEMBUNGKUS SCROLL (Baru) ---
    const scrollContainer = document.createElement('div');
    scrollContainer.style.width = '100%';
    scrollContainer.style.overflowX = 'auto'; // Mengizinkan scroll horizontal
    scrollContainer.style.paddingBottom = '10px'; // Ruang untuk scrollbar agar tidak menutupi kotak
    scrollContainer.style.cursor = 'grab'; // Memberi petunjuk bahwa ini bisa digeser

    const heatmapWrapper = document.createElement('div');
    heatmapWrapper.style.display = 'flex';
    heatmapWrapper.style.width = 'max-content'; // Memaksa isi tetap memanjang ke samping
    heatmapWrapper.style.gap = '12px'; 
    heatmapWrapper.style.paddingLeft = '5px';

    // 1. Label Hari (Tetap di luar scrollContainer jika ingin labelnya tidak ikut bergeser)
    // Namun untuk kemudahan, kita masukkan ke dalam agar sejajar.
    const dayLabels = document.createElement('div');
    dayLabels.style.display = 'grid';
    dayLabels.style.gridTemplateRows = 'repeat(7, 12px)';
    dayLabels.style.marginTop = '18px';
    dayLabels.style.marginRight = '4px';
    dayLabels.style.position = 'sticky'; // Membuat label hari tetap terlihat saat di-scroll
    dayLabels.style.left = '0';
    dayLabels.style.backgroundColor = 'white'; // Agar label tidak tumpang tindih dengan kotak saat scroll
    dayLabels.style.zIndex = '1';

    ['M', 'S', 'S', 'R', 'K', 'J', 'S'].forEach(day => {
        const span = document.createElement('span');
        span.innerText = day;
        span.style.fontSize = '8px';
        span.style.height = '12px';
        span.style.display = 'flex';
        span.style.alignItems = 'center';
        span.style.color = '#bbb';
        dayLabels.appendChild(span);
    });
    heatmapWrapper.appendChild(dayLabels);

    // 2. Iterasi 12 Bulan
    months.forEach((month, monthIndex) => {
        const monthGroup = document.createElement('div');
        monthGroup.style.width = 'fit-content'; 

        const monthLabel = document.createElement('div');
        monthLabel.innerText = month.name;
        monthLabel.style.fontSize = '10px';
        monthLabel.style.marginBottom = '4px';
        monthLabel.style.textAlign = 'center';
        monthGroup.appendChild(monthLabel);

        const daysGrid = document.createElement('div');
        daysGrid.style.display = 'grid';
        daysGrid.style.gridTemplateRows = 'repeat(7, 12px)'; 
        daysGrid.style.gridAutoColumns = '12px'; 
        daysGrid.style.gridAutoFlow = 'column';
        daysGrid.style.gap = '0px'; 

        for (let d = 1; d <= month.days; d++) {
            const dateObj = new Date(year, monthIndex, d);
            const dayOfWeek = dateObj.getDay(); 
            const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const count = history[dateStr] || 0;

            const cell = document.createElement('div');
            cell.title = `${dateStr}: ${count} Sesi`;
            cell.style.width = '12px';
            cell.style.height = '12px';
            cell.style.boxSizing = 'border-box';
            cell.style.border = '1px solid rgba(255,255,255,0.4)'; 
            
            if (d === 1) cell.style.gridRowStart = dayOfWeek + 1;

            if (count === 0) cell.style.background = '#ebedf0';
            else if (count <= 2) cell.style.background = '#9be9a8';
            else if (count <= 5) cell.style.background = '#40c463';
            else cell.style.background = '#216e39';

            daysGrid.appendChild(cell);
        }
        monthGroup.appendChild(daysGrid);
        heatmapWrapper.appendChild(monthGroup);
    });

    scrollContainer.appendChild(heatmapWrapper);
    container.appendChild(scrollContainer);
    renderLegend();

    // Auto-scroll ke bulan sekarang (opsional)
    const currentMonth = new Date().getMonth();
    if (currentMonth > 2) {
        scrollContainer.scrollLeft = (currentMonth - 1) * 60; 
    }
}

function renderLegend() {
    const info = document.getElementById('history-stats');
    info.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; gap:5px; margin-top:10px;">
            <div style="display:flex; gap:5px; align-items:center;">
                <span style="font-size:10px; color:#666;">Kurang</span>
                <div style="width:10px; height:10px; background:#ebedf0; border-radius:2px;"></div>
                <div style="width:10px; height:10px; background:#9be9a8; border-radius:2px;"></div>
                <div style="width:10px; height:10px; background:#40c463; border-radius:2px;"></div>
                <div style="width:10px; height:10px; background:#216e39; border-radius:2px;"></div>
                <span style="font-size:10px; color:#666;">Rajin</span>
            </div>
        </div>`;
}