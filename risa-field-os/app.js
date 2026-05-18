/**
 * RISA™ Quick Scan v5 - App Logic
 * Features: Auto-save, JSON Backup, Photo Compression, Structural Cause Templates
 */

const STORAGE_KEY = 'RISA_QUICK_SCAN_V5_DATA';
const MAX_IMAGE_WIDTH = 800; // Even more aggressive compression for speed

const state = {
    company: '',
    process: '',
    date: new Date().toISOString().split('T')[0],
    attendees: '',
    cards: []
};

// --- Core Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupEventListeners();
});

function initApp() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            Object.assign(state, parsed);
            renderState();
        } catch (e) {
            console.error('Failed to load saved data', e);
        }
    } else {
        addRiskCard();
    }
}

function setupEventListeners() {
    ['company-name', 'process-name', 'audit-date', 'attendees'].forEach(id => {
        const key = id.replace('-name', '').replace('audit-', '');
        document.getElementById(id).addEventListener('input', (e) => {
            state[key] = e.target.value;
            autoSave();
        });
    });

    document.getElementById('btn-add-card').addEventListener('click', () => addRiskCard());
    document.getElementById('btn-export').addEventListener('click', exportJSON);
    document.getElementById('btn-import-trigger').addEventListener('click', () => {
        document.getElementById('file-import').click();
    });
    document.getElementById('file-import').addEventListener('change', importJSON);
}

// --- Card Management ---

function addRiskCard(data = null) {
    const container = document.getElementById('risk-cards-container');
    const template = document.getElementById('risk-card-template');
    const clone = template.content.cloneNode(true);
    const cardEl = clone.querySelector('.risk-card');
    
    const id = data ? data.id : Date.now().toString();
    cardEl.dataset.id = id;

    if (data) {
        cardEl.querySelector('.input-symptom').value = data.symptom || '';
        cardEl.querySelector('.input-cause').value = data.cause || '';
        cardEl.querySelector('.input-insight').value = data.insight || '';
        cardEl.querySelector('.input-immediate').value = data.immediate || '';
        cardEl.querySelector('.input-structural').value = data.structural || '';
        cardEl.querySelector('.input-ceo').value = data.ceo || '';
        
        if (data.image) {
            const img = cardEl.querySelector('.preview-img');
            img.src = data.image;
            img.classList.remove('hidden');
            cardEl.querySelector('.image-placeholder').classList.add('hidden');
        }

        // Apply active state to tags if cause contains them
        cardEl.querySelectorAll('.tag-btn').forEach(btn => {
            if (data.cause && data.cause.includes(btn.dataset.value)) {
                btn.classList.add('active');
            }
        });
    } else {
        state.cards.push({ 
            id, symptom: '', cause: '', insight: '', 
            immediate: '', structural: '', ceo: '', image: null 
        });
    }

    // Event Listeners
    cardEl.querySelectorAll('textarea').forEach(input => {
        input.addEventListener('input', () => {
            updateCardState(id);
            autoSave();
        });
    });

    // Tag Logic
    cardEl.querySelectorAll('.tag-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            const textarea = cardEl.querySelector('.input-cause');
            const activeTags = Array.from(cardEl.querySelectorAll('.tag-btn.active')).map(b => b.dataset.value);
            
            // Sync tags to textarea
            textarea.value = activeTags.join(', ') + (textarea.value.includes('\n') ? '\n' + textarea.value.split('\n').slice(1).join('\n') : '');
            
            updateCardState(id);
            autoSave();
        });
    });

    cardEl.querySelector('.btn-delete').addEventListener('click', () => {
        state.cards = state.cards.filter(c => c.id !== id);
        cardEl.remove();
        autoSave();
    });

    const photoInput = cardEl.querySelector('.photo-input');
    photoInput.addEventListener('change', (e) => handlePhotoUpload(e, id, cardEl));

    // 사진 변경 버튼 활성화
    cardEl.querySelector('.btn-change-photo').addEventListener('click', () => {
        photoInput.click();
    });

    container.appendChild(clone);
}

function updateCardState(id) {
    const cardEl = document.querySelector(`.risk-card[data-id="${id}"]`);
    if (!cardEl) return;

    const cardData = state.cards.find(c => c.id === id);
    if (cardData) {
        cardData.symptom = cardEl.querySelector('.input-symptom').value;
        cardData.cause = cardEl.querySelector('.input-cause').value;
        cardData.insight = cardEl.querySelector('.input-insight').value;
        cardData.immediate = cardEl.querySelector('.input-immediate').value;
        cardData.structural = cardEl.querySelector('.input-structural').value;
        cardData.ceo = cardEl.querySelector('.input-ceo').value;
    }
}

// --- Image Compression ---

async function handlePhotoUpload(event, id, cardEl) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        const compressedBase64 = await compressImage(e.target.result);
        const img = cardEl.querySelector('.preview-img');
        img.src = compressedBase64;
        img.classList.remove('hidden');
        cardEl.querySelector('.image-placeholder').classList.add('hidden');

        const cardData = state.cards.find(c => c.id === id);
        if (cardData) cardData.image = compressedBase64;
        autoSave();
    };
    reader.readAsDataURL(file);
}

function compressImage(base64Str) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            if (width > MAX_IMAGE_WIDTH) {
                height = (MAX_IMAGE_WIDTH / width) * height;
                width = MAX_IMAGE_WIDTH;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.6)); // Lower quality for faster mobile use
        };
    });
}

// --- Persistence ---

let saveTimeout;
function autoSave() {
    const status = document.getElementById('save-status');
    status.textContent = '저장 중...';
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        status.textContent = '저장 완료';
    }, 500);
}

function exportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchorNode = document.createElement('a');
    const fileName = `RISA_QuickScan_${state.company || 'Unnamed'}_${state.date}.json`;
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function importJSON(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            Object.assign(state, imported);
            renderState();
            autoSave();
            alert('데이터 복원 완료');
        } catch (err) {
            alert('파일 오류');
        }
    };
    reader.readAsText(file);
}

function renderState() {
    document.getElementById('company-name').value = state.company || '';
    document.getElementById('process-name').value = state.process || '';
    document.getElementById('audit-date').value = state.date || '';
    document.getElementById('attendees').value = state.attendees || '';
    
    const container = document.getElementById('risk-cards-container');
    container.innerHTML = '';
    state.cards.forEach(card => addRiskCard(card));
}
