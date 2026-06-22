/**
 * MotoServ - Smart Motorcycle Service Reminder
 * Application Logic & State Controller
 */

// --- Constants ---
const DEFAULT_INTERVALS = {
    matic: {
        "Oli Mesin": 2500,
        "Busi": 8000,
        "Oli Transmisi": 8000,
        "Ban Depan": 20000,
        "Ban Belakang": 20000,
        "Drive Belt": 20000,
        "Coolant": 12000,
        "Kampas Rem": 15000,
        "Filter Udara": 12000,
        "Aki": 20000
    },
    manual: {
        "Oli Mesin": 2500,
        "Busi": 8000,
        "Ban Depan": 20000,
        "Ban Belakang": 20000,
        "Rantai": 15000,
        "Coolant": 12000,
        "Kampas Rem": 15000,
        "Filter Udara": 12000,
        "Aki": 20000
    },
    kopling: {
        "Oli Mesin": 2500,
        "Busi": 8000,
        "Ban Depan": 20000,
        "Ban Belakang": 20000,
        "Rantai": 15000,
        "Coolant": 12000,
        "Kampas Rem": 15000,
        "Filter Udara": 12000,
        "Aki": 20000
    }
};

const COMPONENT_ICONS = {
    "Oli Mesin": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z"/></svg>`,
    "Oli Transmisi": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z"/><circle cx="12" cy="15" r="2"/></svg>`,
    "Busi": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>`,
    "Filter Udara": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M12 3v18M3 12h18"/></svg>`,
    "Drive Belt": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="12" rx="9" ry="5"/><ellipse cx="12" cy="12" rx="5" ry="2.5"/></svg>`,
    "Rantai": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="10" width="4" height="4" rx="1"/><rect x="10" y="10" width="4" height="4" rx="1"/><rect x="17" y="10" width="4" height="4" rx="1"/><path d="M7 12h3M14 12h3"/></svg>`,
    "Kampas Rem": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10a8 8 0 0 1 16 0M4 14a8 8 0 0 0 16 0"/><line x1="2" y1="12" x2="22" y2="12"/></svg>`,
    "Ban Depan": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><path d="M12 2v7M12 15v7M2 12h7M15 12h7"/></svg>`,
    "Ban Belakang": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><path d="M12 2v7M12 15v7M2 12h7M15 12h7"/></svg>`,
    "Coolant": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>`,
    "Aki": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="12" rx="2" ry="2"/><line x1="6" y1="3" x2="6" y2="7"/><line x1="18" y1="3" x2="18" y2="7"/><line x1="8" y1="13" x2="12" y2="13"/><line x1="10" y1="11" x2="10" y2="15"/><line x1="14" y1="13" x2="16" y2="13"/></svg>`
};

// --- Application State ---
let state = {
    motorcycles: [],
    activeMotorcycleId: "",
    serviceHistory: [],
    userEmail: "",
    isLoggedIn: false
};

// --- Helper Functions ---
function generateUUID() {
    return 'motor_' + Math.random().toString(36).substring(2, 9);
}

function formatRupiah(amount) {
    if (amount === undefined || amount === null || amount === "") return "-";
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

function formatDate(dateString) {
    if (!dateString) return "-";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Map database type to normalized default key
function normalizeMotorType(type) {
    const t = type.toLowerCase();
    if (t === "matic" || t === "skuter") return "matic";
    if (t === "manual" || t === "bebek") return "manual";
    return "kopling"; // default sport/kopling
}

// Get the correct drive component name (Drive Belt vs Rantai)
function getDriveComponentName(type) {
    const norm = normalizeMotorType(type);
    return norm === "matic" ? "Drive Belt" : "Rantai";
}

// Get array of components based on motorcycle type
function getComponentsForType(type) {
    const norm = normalizeMotorType(type);
    return Object.keys(DEFAULT_INTERVALS[norm]);
}

// --- Local Storage Management ---
function saveState() {
    localStorage.setItem('motoserv_state', JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem('motoserv_state');
    if (saved) {
        try {
            state = JSON.parse(saved);
            // Ensure session keys exist
            if (state.userEmail === undefined) state.userEmail = "";
            if (state.isLoggedIn === undefined) state.isLoggedIn = false;
        } catch (e) {
            console.error("Error parsing saved state, resetting...", e);
            seedDemoData();
        }
    } else {
        seedDemoData();
    }
}

// --- Demo Data Seeding ---
function seedDemoData() {
    const motor1Id = "demo_vario";
    const motor2Id = "demo_r15";

    state.motorcycles = [
        {
            id: motor1Id,
            name: "Honda Vario 160",
            brand: "Honda",
            plate: "B 3456 KLA",
            type: "Matic",
            currentOdo: 12850,
            intervals: { ...DEFAULT_INTERVALS.matic },
            lastService: {
                "Oli Mesin": 12000,
                "Busi": 8000,
                "Oli Transmisi": 8000,
                "Ban Depan": 0,
                "Ban Belakang": 0,
                "Drive Belt": 0,
                "Coolant": 8000,
                "Kampas Rem": 8000,
                "Filter Udara": 0,
                "Aki": 0
            }
        },
        {
            id: motor2Id,
            name: "Yamaha R15 V3",
            brand: "Yamaha",
            plate: "F 1234 XY",
            type: "Kopling",
            currentOdo: 8200,
            intervals: { ...DEFAULT_INTERVALS.kopling },
            lastService: {
                "Oli Mesin": 7500,
                "Busi": 0,
                "Ban Depan": 0,
                "Ban Belakang": 0,
                "Rantai": 6000,
                "Coolant": 6000,
                "Kampas Rem": 6000,
                "Filter Udara": 0,
                "Aki": 0
            }
        }
    ];

    state.activeMotorcycleId = motor1Id;

    state.serviceHistory = [
        {
            id: "log_1",
            motorcycleId: motor1Id,
            date: "2026-02-10",
            odometer: 8000,
            components: ["Oli Mesin", "Oli Transmisi", "Busi"],
            cost: 185000,
            notes: "Servis rutin berkala 8.000 KM di AHASS. Ganti oli mesin SPX2, oli transmisi, dan busi standar."
        },
        {
            id: "log_2",
            motorcycleId: motor1Id,
            date: "2026-05-20",
            odometer: 12000,
            components: ["Oli Mesin", "Coolant", "Filter Udara"],
            cost: 155000,
            notes: "Ganti oli mesin Shell Matic, pengisian coolant baru, dan ganti saringan filter udara."
        },
        {
            id: "log_3",
            motorcycleId: motor2Id,
            date: "2026-04-05",
            odometer: 6000,
            components: ["Rantai", "Kampas Rem"],
            cost: 250000,
            notes: "Lumasi rantai, ganti kampas rem belakang karena mulai tipis."
        },
        {
            id: "log_4",
            motorcycleId: motor2Id,
            date: "2026-06-01",
            odometer: 7500,
            components: ["Oli Mesin", "Coolant", "Busi"],
            cost: 175000,
            notes: "Ganti oli mesin Yamalube Super Sport, kuras air radiator, dan ganti busi baru."
        }
    ];

    saveState();
}

// --- Get Active Motorcycle Helper ---
function getActiveMotorcycle() {
    return state.motorcycles.find(m => m.id === state.activeMotorcycleId) || state.motorcycles[0] || null;
}

// --- Calculation Logic ---
function calculateComponentStatus(motor, componentName) {
    const currentOdo = motor.currentOdo;
    const lastServiceOdo = motor.lastService[componentName] || 0;
    const interval = motor.intervals[componentName] || DEFAULT_INTERVALS[normalizeMotorType(motor.type)][componentName] || 3000;

    const kmRun = currentOdo - lastServiceOdo;
    const kmRemaining = interval - kmRun;
    
    // Percentage calculation (starts at 100%, drops to 0% at limit or below)
    let pct = ((interval - kmRun) / interval) * 100;
    pct = Math.max(0, Math.min(100, pct));

    let status = "good"; // good, warning, danger
    if (kmRemaining <= 0) {
        status = "danger";
    } else if (kmRemaining <= interval * 0.2) { // Less than 20% remaining
        status = "warning";
    }

    return {
        kmRun,
        kmRemaining,
        pct,
        status,
        interval,
        lastServiceOdo
    };
}

// Calculates overall status of the bike based on its components
function calculateMotorHealth(motor) {
    if (!motor) return { healthPct: 0, status: "none", message: "Tidak ada data", totalDanger: 0 };

    const components = Object.keys(motor.intervals);
    let totalPct = 0;
    let count = 0;
    let totalDanger = 0;
    let totalWarning = 0;

    components.forEach(comp => {
        const stats = calculateComponentStatus(motor, comp);
        totalPct += stats.pct;
        count++;

        if (stats.status === "danger") {
            totalDanger++;
        } else if (stats.status === "warning") {
            totalWarning++;
        }
    });

    const healthPct = Math.round(totalPct / count);
    
    let status = "green";
    let message = "Semua Komponen Baik";
    let summary = "Perjalanan Anda aman. Belum ada komponen yang membutuhkan perhatian segera.";

    if (totalDanger > 0) {
        status = "red";
        message = `${totalDanger} Komponen Kritis!`;
        summary = "Segera lakukan servis atau penggantian komponen yang berwarna merah agar terhindar dari mogok di jalan.";
    } else if (totalWarning > 0) {
        status = "yellow";
        message = `${totalWarning} Perlu Perhatian`;
        summary = "Beberapa komponen mendekati batas kilometer maksimal. Rencanakan servis dalam waktu dekat.";
    }

    return {
        healthPct,
        status,
        message,
        summary,
        totalDanger,
        totalWarning
    };
}

// --- DOM Rendering and UI Updates ---

// Update navigation dropdown and header info
function updateHeaderUI() {
    const select = document.getElementById('active-motorcycle-select');
    const headerOdoVal = document.getElementById('header-odometer-value');
    
    // Fill select options
    select.innerHTML = "";
    if (state.motorcycles.length === 0) {
        select.innerHTML = `<option value="">Tidak ada motor</option>`;
        headerOdoVal.innerHTML = `0 <small>KM</small>`;
        return;
    }

    state.motorcycles.forEach(motor => {
        const option = document.createElement('option');
        option.value = motor.id;
        option.textContent = `${motor.name} (${motor.plate || 'Tanpa Plat'})`;
        if (motor.id === state.activeMotorcycleId) {
            option.selected = true;
        }
        select.appendChild(option);
    });

    const activeMotor = getActiveMotorcycle();
    if (activeMotor) {
        headerOdoVal.innerHTML = `${activeMotor.currentOdo.toLocaleString('id-ID')} <small>KM</small>`;
    }
}

// Render Dashboard Tab
function renderDashboard() {
    const activeMotor = getActiveMotorcycle();
    if (!activeMotor) return;

    // 1. Update Overview Card
    const health = calculateMotorHealth(activeMotor);
    
    // Overall status circle gauge svg
    const circle = document.getElementById('overall-status-circle');
    const healthPctText = document.getElementById('overall-health-pct');
    const motorNameText = document.getElementById('info-motor-name');
    const motorTypeText = document.getElementById('info-motor-type');
    const motorPlateText = document.getElementById('info-motor-plate');
    const statusDot = document.getElementById('info-status-dot');
    const statusText = document.getElementById('info-status-text');
    const statusSummary = document.getElementById('info-status-summary');

    healthPctText.textContent = `${health.healthPct}%`;
    motorNameText.textContent = activeMotor.name;
    motorTypeText.textContent = activeMotor.type;
    motorPlateText.textContent = activeMotor.plate || "Tanpa Plat";

    // Set Gauge color and dasharray
    circle.setAttribute('stroke-dasharray', `${health.healthPct}, 100`);
    
    // Remove old status classes
    circle.classList.remove('status-good-stroke', 'status-warning-stroke', 'status-danger-stroke');
    statusDot.className = "status-dot";
    statusText.className = "status-text";

    if (health.status === "red") {
        circle.style.stroke = "var(--color-danger)";
        statusDot.classList.add('red');
        statusText.classList.add('red');
    } else if (health.status === "yellow") {
        circle.style.stroke = "var(--color-warning)";
        statusDot.classList.add('yellow');
        statusText.classList.add('yellow');
    } else {
        circle.style.stroke = "var(--color-success)";
        statusDot.classList.add('green');
        statusText.classList.add('green');
    }

    statusText.textContent = health.message;
    statusSummary.textContent = health.summary;

    // 2. Global Warning Banner
    const globalBanner = document.getElementById('global-alert-banner');
    const globalBannerText = document.getElementById('global-alert-text');
    if (health.totalDanger > 0) {
        globalBanner.style.display = "flex";
        globalBannerText.textContent = `${health.totalDanger} komponen pada motor ${activeMotor.name} telah melebihi batas servis! Segera lakukan servis.`;
    } else {
        globalBanner.style.display = "none";
    }

    // 3. Render Parts Grid
    const partsGrid = document.getElementById('parts-status-grid');
    partsGrid.innerHTML = "";

    const activeComponents = Object.keys(activeMotor.intervals);
    
    activeComponents.forEach(compName => {
        const stats = calculateComponentStatus(activeMotor, compName);
        
        let cardStatusClass = "status-good";
        let badgeText = "Kondisi Baik";
        
        if (stats.status === "danger") {
            cardStatusClass = "status-danger";
            badgeText = "Wajib Servis";
        } else if (stats.status === "warning") {
            cardStatusClass = "status-warning";
            badgeText = "Perlu Servis";
        }

        const remainingValText = stats.kmRemaining <= 0 
            ? `Terlewat ${Math.abs(stats.kmRemaining).toLocaleString('id-ID')} KM`
            : `Sisa ${stats.kmRemaining.toLocaleString('id-ID')} KM`;

        const card = document.createElement('div');
        card.className = `part-card ${cardStatusClass}`;
        card.innerHTML = `
            <div class="part-header">
                <div class="part-name-wrapper">
                    <div class="part-icon">
                        ${COMPONENT_ICONS[compName] || COMPONENT_ICONS["Tune Up"]}
                    </div>
                    <div class="part-title">${compName}</div>
                </div>
                <span class="part-badge">${badgeText}</span>
            </div>
            
            <div class="part-progress-container">
                <div class="part-progress-bar-bg">
                    <div class="part-progress-bar-fill" style="width: ${stats.pct}%"></div>
                </div>
                <div class="part-progress-labels">
                    <span>${stats.pct.toFixed(0)}% Sisa Umur</span>
                    <span>Batas: ${stats.interval.toLocaleString('id-ID')} KM</span>
                </div>
            </div>

            <div class="part-stats">
                <div class="stat-box">
                    <span class="stat-label">Servis Terakhir</span>
                    <span class="stat-value">${stats.lastServiceOdo.toLocaleString('id-ID')} KM</span>
                </div>
                <div class="stat-box">
                    <span class="stat-label">Jarak Tempuh Part</span>
                    <span class="stat-value">${stats.kmRun.toLocaleString('id-ID')} KM</span>
                </div>
            </div>

            <div class="part-footer">
                <div class="remaining-info">
                    <span class="remaining-label">Estimasi Jarak</span>
                    <span class="remaining-value">${remainingValText}</span>
                </div>
                <button class="btn btn-secondary btn-sm btn-quick-record-service" data-component="${compName}">
                    Servis
                </button>
            </div>
        `;
        partsGrid.appendChild(card);
    });

    // Event listeners for quick record buttons
    document.querySelectorAll('.btn-quick-record-service').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const comp = e.currentTarget.getAttribute('data-component');
            openAddServiceModal(comp);
        });
    });
}

// Render Service History Tab
function renderHistory() {
    const activeMotor = getActiveMotorcycle();
    const tbody = document.getElementById('service-history-tbody');
    const emptyState = document.getElementById('history-empty-state');
    const filterComp = document.getElementById('filter-component').value;

    tbody.innerHTML = "";

    if (!activeMotor) {
        emptyState.style.display = "flex";
        document.querySelector('.table-responsive').style.display = "none";
        return;
    }

    // Filter logs for the active motorcycle
    let logs = state.serviceHistory.filter(h => h.motorcycleId === activeMotor.id);

    // Sort by date descending, then odometer descending
    logs.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateB - dateA !== 0) return dateB - dateA;
        return b.odometer - a.odometer;
    });

    // Apply component filter
    if (filterComp !== "all") {
        logs = logs.filter(log => log.components.includes(filterComp));
    }

    if (logs.length === 0) {
        emptyState.style.display = "flex";
        document.querySelector('.table-responsive').style.display = "none";
        return;
    }

    emptyState.style.display = "none";
    document.querySelector('.table-responsive').style.display = "block";

    logs.forEach(log => {
        const tr = document.createElement('tr');
        
        // Build tags for components
        const tagsHtml = log.components.map(c => `<span class="component-tag">${c}</span>`).join(' ');

        tr.innerHTML = `
            <td>${formatDate(log.date)}</td>
            <td><strong>${log.odometer.toLocaleString('id-ID')} KM</strong></td>
            <td>
                <div class="history-tag-list">${tagsHtml}</div>
            </td>
            <td class="cost-value">${formatRupiah(log.cost)}</td>
            <td><span class="text-secondary">${log.notes || '-'}</span></td>
            <td style="text-align: center;">
                <div class="action-buttons">
                    <button class="btn-action btn-action-delete btn-delete-log" data-id="${log.id}" title="Hapus Riwayat">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Add delete listeners
    document.querySelectorAll('.btn-delete-log').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            if (confirm("Apakah Anda yakin ingin menghapus catatan servis ini? Ini akan memulihkan status servis sebelumnya jika Anda mereset manual.")) {
                deleteServiceLog(id);
            }
        });
    });
}

// Render Garage Tab
function renderGarage() {
    const grid = document.getElementById('motorcycles-list-grid');
    grid.innerHTML = "";

    if (state.motorcycles.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <h3>Belum ada motor di garasi</h3>
                <p>Tambahkan motor pertama Anda untuk mulai memantau servis.</p>
                <button class="btn btn-primary" onclick="openMotorcycleModal()">Tambah Motor Baru</button>
            </div>
        `;
        return;
    }

    state.motorcycles.forEach(motor => {
        const isActive = motor.id === state.activeMotorcycleId;
        const health = calculateMotorHealth(motor);
        const card = document.createElement('div');
        
        card.className = `motorcycle-card ${isActive ? 'active' : ''}`;
        
        let statusBadgeClass = "green";
        if (health.status === "red") statusBadgeClass = "red";
        else if (health.status === "yellow") statusBadgeClass = "yellow";

        card.innerHTML = `
            ${isActive ? '<span class="active-ribbon">Aktif</span>' : ''}
            <div class="motor-card-header">
                <div class="motor-card-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M16 12H8m4-4v8"/>
                    </svg>
                </div>
                <div>
                    <h3 class="motor-card-title">${motor.name}</h3>
                    <span class="badge">${motor.type}</span>
                </div>
            </div>

            <div class="motor-card-info-grid">
                <div class="info-box">
                    <span class="info-label">Odometer</span>
                    <span class="info-val">${motor.currentOdo.toLocaleString('id-ID')} KM</span>
                </div>
                <div class="info-box">
                    <span class="info-label">No. Polisi</span>
                    <span class="info-val">${motor.plate || '-'}</span>
                </div>
                <div class="info-box">
                    <span class="info-label">Kesehatan</span>
                    <span class="info-val" style="color: var(--color-${health.status === 'green' ? 'success' : health.status === 'yellow' ? 'warning' : 'danger'})">${health.healthPct}%</span>
                </div>
                <div class="info-box">
                    <span class="info-label">Merk</span>
                    <span class="info-val">${motor.brand}</span>
                </div>
            </div>

            <div class="motor-card-actions">
                ${!isActive ? `<button class="btn btn-secondary btn-sm btn-activate-motor" data-id="${motor.id}">Aktifkan</button>` : ''}
                <button class="btn btn-secondary btn-sm btn-edit-motor" data-id="${motor.id}">Edit</button>
                <button class="btn btn-danger btn-sm btn-delete-motor" data-id="${motor.id}">Hapus</button>
            </div>
        `;
        grid.appendChild(card);
    });

    // Activate button listener
    document.querySelectorAll('.btn-activate-motor').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            setActiveMotorcycle(id);
            showToast("Motor aktif diubah!", "success");
        });
    });

    // Edit button listener
    document.querySelectorAll('.btn-edit-motor').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            openMotorcycleModal(id);
        });
    });

    // Delete button listener
    document.querySelectorAll('.btn-delete-motor').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            if (state.motorcycles.length <= 1) {
                alert("Anda tidak dapat menghapus satu-satunya motor Anda di garasi!");
                return;
            }
            if (confirm("Apakah Anda yakin ingin menghapus motor ini? Semua riwayat servis motor ini juga akan dihapus permanen.")) {
                deleteMotorcycle(id);
            }
        });
    });
}

// Render Settings Tab
function renderSettings() {
    const activeMotor = getActiveMotorcycle();
    const inputsContainer = document.getElementById('settings-intervals-inputs');
    const viewContainer = document.getElementById('settings-intervals-view');
    const settingsMotorTag = document.getElementById('settings-motor-tag');

    inputsContainer.innerHTML = "";
    viewContainer.innerHTML = "";

    if (!activeMotor) {
        settingsMotorTag.textContent = "Motor Aktif: -";
        const emptyMsg = `<p class="text-muted" style="grid-column: 1/-1;">Tambahkan motor terlebih dahulu.</p>`;
        inputsContainer.innerHTML = emptyMsg;
        viewContainer.innerHTML = emptyMsg;
        return;
    }

    settingsMotorTag.textContent = `Motor Aktif: ${activeMotor.name} (${activeMotor.plate || 'Tanpa Plat'})`;

    const standardComponents = getComponentsForType(activeMotor.type);
    const components = Object.keys(activeMotor.intervals);

    components.forEach(comp => {
        const intervalValue = activeMotor.intervals[comp];
        const isCustom = !standardComponents.includes(comp);
        const defaultVal = !isCustom ? DEFAULT_INTERVALS[normalizeMotorType(activeMotor.type)][comp] : null;
        const defaultText = isCustom ? "Kustom (Tipe Pengguna)" : `Default: ${defaultVal.toLocaleString('id-ID')} KM`;

        // 1. Populate View Mode Grid
        const viewItem = document.createElement('div');
        viewItem.style.padding = "1rem";
        viewItem.style.backgroundColor = "rgba(255,255,255,0.02)";
        viewItem.style.border = "1px solid var(--border-color)";
        viewItem.style.borderRadius = "var(--radius-md)";
        viewItem.style.display = "flex";
        viewItem.style.alignItems = "center";
        viewItem.style.justifyContent = "space-between";
        viewItem.style.gap = "1rem";

        let deleteBtnHtml = "";
        if (isCustom) {
            deleteBtnHtml = `
                <button type="button" class="btn btn-secondary btn-icon btn-delete-custom-comp" data-component="${comp}" style="padding: 0.35rem; color: var(--color-danger); border-color: rgba(239, 68, 68, 0.2); background-color: rgba(239, 68, 68, 0.05);" title="Hapus Komponen Kustom">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            `;
        }

        viewItem.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem; overflow: hidden;">
                <div class="part-icon" style="width: 32px; height: 32px; flex-shrink: 0; background-color: rgba(255, 255, 255, 0.02); border: 1px solid var(--border-color); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; color: var(--color-primary);">
                    ${COMPONENT_ICONS[comp] || COMPONENT_ICONS["Tune Up"]}
                </div>
                <div style="overflow: hidden;">
                    <div style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${comp}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${defaultText}</div>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0;">
                <div style="font-size: 1.1rem; font-weight: 700; color: var(--color-primary);">${parseInt(intervalValue).toLocaleString('id-ID')} <small style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 500;">KM</small></div>
                ${deleteBtnHtml}
            </div>
        `;
        viewContainer.appendChild(viewItem);

        // 2. Populate Edit Mode Grid (Inputs)
        const group = document.createElement('div');
        group.className = "form-group";
        const labelText = isCustom ? `Interval ${comp} (Kustom) (KM)` : `Interval ${comp} (KM)`;
        const tipText = isCustom ? `Komponen kustom buatan Anda` : `Default pabrikan: ${defaultVal.toLocaleString('id-ID')} KM`;
        group.innerHTML = `
            <label for="interval-input-${comp.replace(/\s+/g, '-')}" style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="display: inline-flex; width: 16px; height: 16px; color: var(--color-primary);">${COMPONENT_ICONS[comp] || COMPONENT_ICONS["Tune Up"]}</span>
                ${labelText}
            </label>
            <input type="number" id="interval-input-${comp.replace(/\s+/g, '-')}" data-component="${comp}" min="100" max="100000" class="form-control interval-setting-field" value="${intervalValue}" required>
            <small class="form-tip">${tipText}</small>
        `;
        inputsContainer.appendChild(group);
    });

    // Register delete button click listeners
    viewContainer.querySelectorAll('.btn-delete-custom-comp').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const compToDelete = e.currentTarget.getAttribute('data-component');
            if (confirm(`Apakah Anda yakin ingin menghapus komponen kustom '${compToDelete}' beserta seluruh data servisnya pada motor ini?`)) {
                // Delete from intervals
                delete activeMotor.intervals[compToDelete];
                // Delete from lastService
                delete activeMotor.lastService[compToDelete];
                
                saveState();
                refreshAllUI();
                showToast(`Komponen kustom '${compToDelete}' berhasil dihapus!`, "success");
            }
        });
    });

    // Reset settings card to View Mode by default when loaded
    document.getElementById('settings-view-container').style.display = "block";
    document.getElementById('settings-intervals-form').style.display = "none";
}

// Global update trigger for all tabs and header
function refreshAllUI() {
    updateHeaderUI();
    renderDashboard();
    renderHistory();
    renderGarage();
    renderSettings();
}

// --- App Action Commands ---

// Set active motorcycle
function setActiveMotorcycle(id) {
    state.activeMotorcycleId = id;
    saveState();
    refreshAllUI();
}

// Delete motorcycle
function deleteMotorcycle(id) {
    // Delete from list
    state.motorcycles = state.motorcycles.filter(m => m.id !== id);
    
    // Delete related service logs
    state.serviceHistory = state.serviceHistory.filter(h => h.motorcycleId !== id);

    // If active motorcycle was deleted, set another one active
    if (state.activeMotorcycleId === id) {
        state.activeMotorcycleId = state.motorcycles.length > 0 ? state.motorcycles[0].id : "";
    }

    saveState();
    refreshAllUI();
    showToast("Motor berhasil dihapus!", "danger");
}

// Delete service log
function deleteServiceLog(logId) {
    const logIndex = state.serviceHistory.findIndex(h => h.id === logId);
    if (logIndex === -1) return;

    const log = state.serviceHistory[logIndex];
    const motor = state.motorcycles.find(m => m.id === log.motorcycleId);

    // Delete log
    state.serviceHistory.splice(logIndex, 1);

    // Re-calculate last service kilometers based on remaining logs
    if (motor) {
        log.components.forEach(comp => {
            // Find the most recent log prior to this delete that had this component
            const priorLogs = state.serviceHistory.filter(h => 
                h.motorcycleId === motor.id && 
                h.components.includes(comp)
            );
            
            if (priorLogs.length > 0) {
                // Sort by odometer desc to get highest (most recent)
                priorLogs.sort((a, b) => b.odometer - a.odometer);
                motor.lastService[comp] = priorLogs[0].odometer;
            } else {
                // Reset to 0 if no prior service log found
                motor.lastService[comp] = 0;
            }
        });
    }

    saveState();
    refreshAllUI();
    showToast("Riwayat servis dihapus!", "success");
}

// Update Odometer
function updateOdometer(newValue) {
    const motor = getActiveMotorcycle();
    if (!motor) return;

    if (newValue < motor.currentOdo) {
        alert("Odometer baru tidak boleh lebih kecil dari odometer saat ini!");
        return false;
    }

    motor.currentOdo = parseInt(newValue);
    saveState();
    refreshAllUI();
    return true;
}

// Add Service Log
function addServiceLog(date, odometer, components, cost, notes) {
    const motor = getActiveMotorcycle();
    if (!motor) return;

    const parsedOdo = parseInt(odometer);

    // Validate odometer
    if (parsedOdo > motor.currentOdo) {
        // Automatically bump motorcycle current odometer if service was done at a higher mileage
        motor.currentOdo = parsedOdo;
    }

    const log = {
        id: "log_" + Date.now() + "_" + Math.random().toString(36).substring(2, 5),
        motorcycleId: motor.id,
        date: date,
        odometer: parsedOdo,
        components: components,
        cost: cost ? parseInt(cost) : 0,
        notes: notes
    };

    // Add to history
    state.serviceHistory.push(log);

    // Update the lastService odometer for each component selected
    components.forEach(comp => {
        // Only update if this service odometer is higher than the currently stored last service odometer
        if (!motor.lastService[comp] || parsedOdo > motor.lastService[comp]) {
            motor.lastService[comp] = parsedOdo;
        }
    });

    saveState();
    refreshAllUI();
    return true;
}

// Save custom intervals
function saveIntervalSettings(newIntervals) {
    const motor = getActiveMotorcycle();
    if (!motor) return;

    for (const comp in newIntervals) {
        motor.intervals[comp] = parseInt(newIntervals[comp]);
    }

    saveState();
    refreshAllUI();
    showToast("Pengaturan interval berhasil disimpan!", "success");
}

// Reset intervals to default
function resetIntervalsToDefault() {
    const motor = getActiveMotorcycle();
    if (!motor) return;

    const normType = normalizeMotorType(motor.type);
    motor.intervals = { ...DEFAULT_INTERVALS[normType] };

    saveState();
    refreshAllUI();
    showToast("Interval di-reset ke standar pabrikan!", "success");
}

// --- Modal Display Operations ---

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('open');
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('open');
}

// Open Odometer Modal
function openOdometerModal() {
    const motor = getActiveMotorcycle();
    if (!motor) return;

    const input = document.getElementById('input-odo-value');
    input.value = motor.currentOdo;
    input.min = motor.currentOdo;
    
    const diffPreview = document.getElementById('odo-diff-preview');
    diffPreview.style.display = "none";

    openModal('modal-update-odo');
    input.focus();
}

// Open Add Service Modal
function openAddServiceModal(preselectedComponent = null) {
    const motor = getActiveMotorcycle();
    if (!motor) return;

    // Reset Form
    document.getElementById('form-add-service').reset();
    
    // Set date to today
    document.getElementById('input-service-date').value = new Date().toISOString().split('T')[0];
    
    // Set odometer to current
    const odoInput = document.getElementById('input-service-odo');
    odoInput.value = motor.currentOdo;
    odoInput.min = 0;

    // Populate component checkboxes
    const cbContainer = document.getElementById('service-components-checkboxes');
    cbContainer.innerHTML = "";

    const comps = Object.keys(motor.intervals);
    
    comps.forEach(comp => {
        const isChecked = preselectedComponent === comp;
        const cbCard = document.createElement('label');
        cbCard.className = "checkbox-card";
        cbCard.innerHTML = `
            <input type="checkbox" name="service_comp" value="${comp}" ${isChecked ? 'checked' : ''}>
            <span>${comp}</span>
        `;
        cbContainer.appendChild(cbCard);
    });

    openModal('modal-add-service');
}

// Open Motorcycle Form Modal (for Add or Edit)
function openMotorcycleModal(motorId = null) {
    const form = document.getElementById('form-motorcycle');
    form.reset();

    const title = document.getElementById('motor-modal-title');
    const submitBtn = document.getElementById('btn-motor-submit');
    const idInput = document.getElementById('input-motor-id');
    const odoInput = document.getElementById('input-motor-odo');

    const activeCheckbox = document.getElementById('input-motor-active');

    if (motorId) {
        // EDIT MODE
        const motor = state.motorcycles.find(m => m.id === motorId);
        if (!motor) return;

        title.textContent = "Edit Motor";
        submitBtn.textContent = "Simpan Perubahan";
        idInput.value = motor.id;

        document.getElementById('input-motor-name').value = motor.name;
        document.getElementById('input-motor-brand').value = motor.brand;
        document.getElementById('input-motor-plate').value = motor.plate || "";
        document.getElementById('input-motor-type').value = motor.type;
        
        odoInput.value = motor.currentOdo;
        // In edit mode, we let them change odometer, but notify them
        odoInput.min = 0;
        
        activeCheckbox.checked = (motor.id === state.activeMotorcycleId);
    } else {
        // ADD MODE
        title.textContent = "Tambah Motor Baru";
        submitBtn.textContent = "Tambah Motor";
        idInput.value = "";
        odoInput.min = 0;
        odoInput.value = "";
        
        activeCheckbox.checked = true;
    }

    openModal('modal-motorcycle-form');
}

// --- Login & Session Verification Logic ---

function checkLoginStatus() {
    const loginScreen = document.getElementById('login-screen');
    const appContainer = document.querySelector('.app-container');
    const emailDisplay = document.getElementById('header-user-email');

    if (state.isLoggedIn && state.userEmail) {
        loginScreen.style.display = "none";
        appContainer.style.display = ""; // falls back to CSS rules
        emailDisplay.textContent = state.userEmail;
        emailDisplay.title = state.userEmail;
        refreshAllUI();
    } else {
        loginScreen.style.display = "flex";
        appContainer.style.display = "none";
        
        // Reset login form steps
        document.getElementById('form-login-email').style.display = "block";
        document.getElementById('form-login-otp').style.display = "none";
        document.getElementById('form-login-email').reset();
    }
}

// --- OTP Input Box Interactions ---
function initOtpInputs() {
    const inputs = document.querySelectorAll('.otp-input-box');
    const hiddenInput = document.getElementById('input-login-otp-full');

    inputs.forEach((input, index) => {
        // Clear value on focus
        input.addEventListener('focus', () => {
            input.value = "";
        });

        // Keyup listener to handle auto-focus navigation
        input.addEventListener('input', (e) => {
            const val = input.value;
            
            // Allow only digits
            if (!/^\d$/.test(val)) {
                input.value = "";
                return;
            }

            // Enable next box and move focus
            if (index < inputs.length - 1) {
                inputs[index + 1].disabled = false;
                inputs[index + 1].focus();
            }

            updateOtpFullValue(inputs, hiddenInput);
        });

        // Keydown listener to handle backspace
        input.addEventListener('keydown', (e) => {
            if (e.key === "Backspace") {
                input.value = "";
                
                if (index > 0) {
                    inputs[index].disabled = true; // disable current
                    inputs[index - 1].focus();     // focus previous
                }
                
                updateOtpFullValue(inputs, hiddenInput);
            }
        });
    });
}

function updateOtpFullValue(inputs, hiddenInput) {
    let fullVal = "";
    inputs.forEach(input => {
        fullVal += input.value;
    });
    hiddenInput.value = fullVal;
}

function resetOtpInputs() {
    const inputs = document.querySelectorAll('.otp-input-box');
    inputs.forEach((input, index) => {
        input.value = "";
        input.disabled = index > 0;
    });
    document.getElementById('input-login-otp-full').value = "";
}

let generatedOtp = "";

function sendOtpSimulated(email) {
    // Generate 6 digit random number
    generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Toggle screen
    document.getElementById('form-login-email').style.display = "none";
    document.getElementById('form-login-otp').style.display = "block";
    document.getElementById('display-otp-email').textContent = email;
    
    resetOtpInputs();
    
    // Display OTP in simulated toast
    setTimeout(() => {
        showToast(`[SIMULASI EMAIL] Kode OTP Anda: ${generatedOtp}`, "warning");
        console.log(`[SIMULASI EMAIL] OTP untuk ${email} adalah ${generatedOtp}`);
    }, 800);
}

function verifyOtpSimulated(enteredOtp) {
    if (enteredOtp === generatedOtp) {
        state.isLoggedIn = true;
        state.userEmail = document.getElementById('input-login-email').value;
        saveState();
        checkLoginStatus();
        showToast("Masuk berhasil!", "success");
        return true;
    } else {
        showToast("Kode OTP salah! Silakan coba lagi.", "danger");
        return false;
    }
}

function logoutUser() {
    if (confirm("Apakah Anda yakin ingin keluar? Sesi aktif Anda akan diakhiri.")) {
        state.isLoggedIn = false;
        saveState();
        checkLoginStatus();
        showToast("Anda telah keluar.", "success");
    }
}

// --- Backup & Restore Logic ---

function exportBackupData() {
    try {
        const backupObj = {
            motorcycles: state.motorcycles,
            serviceHistory: state.serviceHistory
        };
        const jsonStr = JSON.stringify(backupObj);
        // Base64 encoding supporting Unicode characters
        const base64Str = btoa(unescape(encodeURIComponent(jsonStr)));
        return base64Str;
    } catch (e) {
        console.error("Backup encryption failed", e);
        showToast("Enkripsi cadangan gagal!", "danger");
        return null;
    }
}

function restoreBackupData(inputStr) {
    try {
        let jsonStr = "";
        const trimmed = inputStr.trim();
        if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
            jsonStr = trimmed;
        } else {
            jsonStr = decodeURIComponent(escape(atob(trimmed)));
        }
        const backupObj = JSON.parse(jsonStr);

        if (!backupObj.motorcycles || !Array.isArray(backupObj.motorcycles)) {
            throw new Error("Format data motor tidak valid.");
        }
        if (!backupObj.serviceHistory || !Array.isArray(backupObj.serviceHistory)) {
            throw new Error("Format riwayat servis tidak valid.");
        }

        state.motorcycles = backupObj.motorcycles;
        state.serviceHistory = backupObj.serviceHistory;
        
        if (backupObj.userEmail !== undefined) {
            state.userEmail = backupObj.userEmail;
            const inputBackupEmail = document.getElementById('input-backup-email');
            if (inputBackupEmail) {
                inputBackupEmail.value = state.userEmail || "";
            }
        }
        
        if (state.motorcycles.length > 0) {
            const match = state.motorcycles.find(m => m.id === state.activeMotorcycleId);
            if (!match) {
                state.activeMotorcycleId = state.motorcycles[0].id;
            }
        } else {
            state.activeMotorcycleId = "";
        }

        saveState();
        refreshAllUI();
        showToast("Data berhasil dipulihkan!", "success");
        return true;
    } catch (e) {
        console.error("Data restoration failed", e);
        alert("Kode pemulihan tidak valid atau rusak! " + e.message);
        showToast("Pemulihan data gagal!", "danger");
        return false;
    }
}

function triggerMailtoBackup() {
    const backupStr = exportBackupData();
    if (!backupStr) return;

    const animEl = document.getElementById('backup-status-anim');
    const statusTextEl = document.getElementById('backup-status-text');

    animEl.style.display = "flex";
    statusTextEl.textContent = "Mengompresi data garasi & riwayat...";

    setTimeout(() => {
        statusTextEl.textContent = "Menghubungkan ke peramban email...";
        
        setTimeout(() => {
            animEl.style.display = "none";
            
            const email = state.userEmail || "";
            const subject = encodeURIComponent("MotoServ - Cadangan Data Kendaraan Anda");
            
            const body = encodeURIComponent(
                "Halo,\n\n" +
                "Berikut adalah teks cadangan untuk aplikasi MotoServ Anda. Simpan email ini secara aman.\n" +
                "Untuk memulihkan data Anda, salin teks kode di bawah ini lalu tempelkan (paste) pada bagian 'Pulihkan Data' di tab Pengaturan aplikasi MotoServ.\n\n" +
                "KODE CADANGAN ANDA:\n" +
                "============================================================\n" +
                backupStr + "\n" +
                "============================================================\n\n" +
                "Terima kasih,\nMotoServ System"
            );

            const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
            
            window.location.href = mailtoUrl;
            
            showToast("Draft email cadangan berhasil dibuat!", "success");
        }, 1000);
    }, 1000);
}

function triggerFileBackup() {
    try {
        const backupObj = {
            motorcycles: state.motorcycles,
            serviceHistory: state.serviceHistory,
            userEmail: state.userEmail || ""
        };
        const jsonStr = JSON.stringify(backupObj, null, 2);
        
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        const dateStr = new Date().toISOString().slice(0, 10);
        const a = document.createElement("a");
        a.href = url;
        a.download = `motoserv_backup_${dateStr}.json`;
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Also copy Base64 version to clipboard as a fallback option
        const base64Str = btoa(unescape(encodeURIComponent(JSON.stringify(backupObj))));
        navigator.clipboard.writeText(base64Str)
            .catch(err => console.log("Clipboard fallback copy failed", err));
            
        return true;
    } catch (e) {
        console.error("File backup failed", e);
        showToast("Pencadangan data gagal!", "danger");
        return false;
    }
}

// Toast notification trigger
function showToast(message, type = "success") {
    const toast = document.getElementById('toast-notification');
    const msgEl = document.getElementById('toast-message');

    msgEl.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// --- App Initialization & Event Listeners ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Load data & Initialize UI
    loadState();
    refreshAllUI();

    // 2. Tab Navigation
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetTab = e.currentTarget.getAttribute('data-tab');
            
            // Toggle nav item classes
            document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');

            // Toggle content sections
            document.querySelectorAll('.tab-content').forEach(sect => sect.classList.remove('active'));
            document.getElementById(`tab-${targetTab}`).classList.add('active');

            // Handle header odometer widget visibility based on screen and tab
            const odoWidget = document.getElementById('header-odometer-widget');
            if (window.innerWidth <= 1024) {
                // On mobile, hide it or keep it hidden
                odoWidget.style.display = "none";
            } else {
                odoWidget.style.display = "flex";
            }
        });
    });

    // 3. Dropdown Active Motorcycle Select
    document.getElementById('active-motorcycle-select').addEventListener('change', (e) => {
        if (e.target.value) {
            setActiveMotorcycle(e.target.value);
        }
    });

    // 4. Update Odometer Buttons & Form
    document.getElementById('btn-quick-update-odo').addEventListener('click', openOdometerModal);
    
    // Live update odometer difference in modal
    document.getElementById('input-odo-value').addEventListener('input', (e) => {
        const motor = getActiveMotorcycle();
        if (!motor) return;

        const val = parseInt(e.target.value) || 0;
        const diffPreview = document.getElementById('odo-diff-preview');
        const diffVal = document.getElementById('odo-diff-val');

        if (val > motor.currentOdo) {
            diffPreview.style.display = "block";
            diffVal.textContent = `+${(val - motor.currentOdo).toLocaleString('id-ID')}`;
        } else {
            diffPreview.style.display = "none";
        }
    });

    document.getElementById('form-update-odo').addEventListener('submit', (e) => {
        e.preventDefault();
        const newVal = document.getElementById('input-odo-value').value;
        if (updateOdometer(newVal)) {
            closeModal('modal-update-odo');
            showToast("Odometer berhasil diperbarui!", "success");
        }
    });

    // 5. Add Service Buttons & Form
    document.getElementById('btn-add-service-log').addEventListener('click', () => openAddServiceModal());
    document.getElementById('btn-empty-add-service').addEventListener('click', () => openAddServiceModal());
    
    document.getElementById('form-add-service').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const date = document.getElementById('input-service-date').value;
        const odo = document.getElementById('input-service-odo').value;
        const cost = document.getElementById('input-service-cost').value;
        const notes = document.getElementById('input-service-notes').value;

        // Collect checked components
        const checkboxes = document.querySelectorAll('input[name="service_comp"]:checked');
        if (checkboxes.length === 0) {
            alert("Harap pilih minimal satu komponen yang diservis!");
            return;
        }

        const selectedComps = Array.from(checkboxes).map(cb => cb.value);

        if (addServiceLog(date, odo, selectedComps, cost, notes)) {
            closeModal('modal-add-service');
            showToast("Catatan servis berhasil ditambahkan!", "success");
        }
    });

    // 6. Garage Form & Quick Add
    document.getElementById('btn-add-motorcycle').addEventListener('click', () => openMotorcycleModal());
    document.getElementById('btn-quick-add-motor').addEventListener('click', () => openMotorcycleModal());
    
    document.getElementById('form-motorcycle').addEventListener('submit', (e) => {
        e.preventDefault();

        const id = document.getElementById('input-motor-id').value;
        const name = document.getElementById('input-motor-name').value;
        const brand = document.getElementById('input-motor-brand').value;
        const plate = document.getElementById('input-motor-plate').value;
        const type = document.getElementById('input-motor-type').value;
        const odo = parseInt(document.getElementById('input-motor-odo').value);
        const setActive = document.getElementById('input-motor-active').checked;

        if (id) {
            // Edit existing
            const motorIndex = state.motorcycles.findIndex(m => m.id === id);
            if (motorIndex !== -1) {
                const motor = state.motorcycles[motorIndex];
                
                // If type changed, check if component list is different, reseed default lastService accordingly
                if (motor.type !== type) {
                    if (confirm("Mengubah tipe motor akan mengatur ulang interval servis komponen ke tipe baru. Lanjutkan?")) {
                        const normType = normalizeMotorType(type);
                        motor.intervals = { ...DEFAULT_INTERVALS[normType] };
                        
                        // Copy existing lastService parameters if matching, or seed 0
                        const newLastService = {};
                        getComponentsForType(type).forEach(comp => {
                            newLastService[comp] = motor.lastService[comp] || 0;
                        });
                        motor.lastService = newLastService;
                    } else {
                        return; // cancel submit
                    }
                }

                motor.name = name;
                motor.brand = brand;
                motor.plate = plate;
                motor.type = type;
                motor.currentOdo = odo;
                
                if (setActive) {
                    state.activeMotorcycleId = id;
                } else if (state.activeMotorcycleId === id) {
                    // If it was active and user unchecked it, switch to another motor
                    const otherMotor = state.motorcycles.find(m => m.id !== id);
                    state.activeMotorcycleId = otherMotor ? otherMotor.id : id;
                }
                
                showToast("Data motor berhasil diperbarui!", "success");
            }
        } else {
            // Create new
            const newId = generateUUID();
            const normType = normalizeMotorType(type);
            
            // Build default last service mappings at 0
            const initialLastService = {};
            getComponentsForType(type).forEach(comp => {
                initialLastService[comp] = 0;
            });

            const newMotor = {
                id: newId,
                name: name,
                brand: brand,
                plate: plate,
                type: type,
                currentOdo: odo,
                intervals: { ...DEFAULT_INTERVALS[normType] },
                lastService: initialLastService
            };

            state.motorcycles.push(newMotor);
            
            if (setActive || !state.activeMotorcycleId) {
                state.activeMotorcycleId = newId;
            }
            
            showToast("Motor baru berhasil ditambahkan!", "success");
        }

        saveState();
        closeModal('modal-motorcycle-form');
        refreshAllUI();
    });

    // 7. Settings Form
    document.getElementById('btn-edit-intervals').addEventListener('click', () => {
        document.getElementById('settings-view-container').style.display = "none";
        document.getElementById('settings-intervals-form').style.display = "block";
    });

    document.getElementById('btn-cancel-edit-intervals').addEventListener('click', () => {
        renderSettings();
    });

    document.getElementById('settings-intervals-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const fields = document.querySelectorAll('.interval-setting-field');
        const newIntervals = {};
        
        fields.forEach(input => {
            const comp = input.getAttribute('data-component');
            newIntervals[comp] = input.value;
        });

        saveIntervalSettings(newIntervals);
    });

    document.getElementById('btn-reset-intervals-default').addEventListener('click', () => {
        if (confirm("Apakah Anda yakin ingin mengembalikan semua interval komponen motor ini ke standar pabrikan?")) {
            resetIntervalsToDefault();
        }
    });

    // 7c. Custom Component Form Listener
    document.getElementById('btn-add-custom-comp').addEventListener('click', () => {
        const motor = getActiveMotorcycle();
        if (!motor) {
            alert("Harap pilih/tambahkan motor aktif terlebih dahulu.");
            return;
        }
        document.getElementById('form-custom-component').reset();
        document.getElementById('input-custom-comp-last-service').value = motor.currentOdo;
        document.getElementById('input-custom-comp-last-service').max = motor.currentOdo;
        openModal('modal-custom-component');
    });

    document.getElementById('form-custom-component').addEventListener('submit', (e) => {
        e.preventDefault();
        const motor = getActiveMotorcycle();
        if (!motor) return;

        const compName = document.getElementById('input-custom-comp-name').value.trim();
        const intervalVal = parseInt(document.getElementById('input-custom-comp-interval').value);
        const lastServiceVal = parseInt(document.getElementById('input-custom-comp-last-service').value);

        if (!compName) return;

        // Check duplicate name
        if (motor.intervals[compName] !== undefined) {
            alert("Komponen dengan nama ini sudah terdaftar pada motor!");
            return;
        }

        // Add
        motor.intervals[compName] = intervalVal;
        motor.lastService[compName] = lastServiceVal;

        saveState();
        closeModal('modal-custom-component');
        refreshAllUI();
        showToast(`Komponen kustom '${compName}' berhasil ditambahkan!`, "success");
    });

    // 7b. Backup Email Address Listener
    const inputBackupEmail = document.getElementById('input-backup-email');
    if (inputBackupEmail) {
        inputBackupEmail.value = state.userEmail || "";
        inputBackupEmail.addEventListener('input', (e) => {
            state.userEmail = e.target.value;
            saveState();
        });
    }

    // Danger Zone - Factory Reset
    document.getElementById('btn-factory-reset').addEventListener('click', () => {
        if (confirm("PERINGATAN: Semua data garasi, riwayat servis, dan pengaturan kustom akan dihapus permanen! Apakah Anda yakin ingin mereset aplikasi?")) {
            localStorage.removeItem('motoserv_state');
            seedDemoData();
            loadState();
            refreshAllUI();
            showToast("Aplikasi berhasil di-reset pabrik!", "danger");
            // Switch to dashboard tab
            document.querySelector('.nav-item[data-tab="dashboard"]').click();
        }
    });

    // 8. Close Modal Bindings
    document.querySelectorAll('.btn-close-modal, .btn-close-modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Find parent modal backdrop
            const backdrop = e.currentTarget.closest('.modal-backdrop');
            if (backdrop) {
                closeModal(backdrop.id);
            }
        });
    });

    // Close modal when clicking on backdrop
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                closeModal(backdrop.id);
            }
        });
    });

    // 10. Backup & Restore Event Listeners
    // Main Cadangkan (Backup) Button
    document.getElementById('btn-backup-now').addEventListener('click', () => {
        if (triggerFileBackup()) {
            if (state.userEmail && state.userEmail.trim() !== "") {
                // If email is entered, also trigger email backup draft
                showToast("Data cadangan diunduh. Membuka draf email...", "success");
                triggerMailtoBackup();
            } else {
                showToast("Data cadangan berhasil diunduh ke folder Unduhan Anda!", "success");
            }
        }
    });

    // Main Pulihkan (Restore) Button - triggers hidden file input
    document.getElementById('btn-restore-now').addEventListener('click', () => {
        document.getElementById('input-restore-file').click();
    });

    // Hidden File Input Change Listener
    document.getElementById('input-restore-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (confirm("Peringatan: Pemulihan data akan menimpa seluruh data garasi dan riwayat saat ini. Apakah Anda yakin ingin melanjutkan?")) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target.result;
                if (restoreBackupData(content)) {
                    // Reset file input value so same file can be uploaded again if needed
                    e.target.value = "";
                    // Switch to dashboard
                    document.querySelector('.nav-item[data-tab="dashboard"]').click();
                }
            };
            reader.readAsText(file);
        } else {
            // Reset file input
            e.target.value = "";
        }
    });

    // Manual Text Restore Button
    document.getElementById('btn-restore-text-manual').addEventListener('click', () => {
        const text = document.getElementById('textarea-restore-data').value;
        if (!text || text.trim() === "") {
            alert("Harap masukkan teks kode cadangan terlebih dahulu!");
            return;
        }
        if (confirm("Peringatan: Pemulihan data akan menimpa seluruh data garasi dan riwayat saat ini. Apakah Anda yakin ingin memulihkan?")) {
            if (restoreBackupData(text)) {
                document.getElementById('textarea-restore-data').value = "";
                // Collapse the details section
                const detailsEl = document.querySelector('.manual-text-option details');
                if (detailsEl) detailsEl.open = false;
                // Switch to dashboard
                document.querySelector('.nav-item[data-tab="dashboard"]').click();
            }
        }
    });

    // Filter History Component dropdown listener
    document.getElementById('filter-component').addEventListener('change', renderHistory);
});
