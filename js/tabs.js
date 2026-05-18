document.addEventListener('DOMContentLoaded', () => {
    // RISA™ - 인사이트 탭 전환 로직 (Brunch & YouTube)
    window.showTab = function(tabName) {
        const contents = document.querySelectorAll('.case-content');
        const buttons = document.querySelectorAll('.tab-container .btn');
        
        if (contents) {
            contents.forEach(el => {
                if (el) el.style.display = 'none';
            });
        }
        
        if (buttons) {
            buttons.forEach(btn => {
                if (btn) btn.classList.remove('active');
            });
        }
        
        const targetContent = document.getElementById(tabName + '-tab');
        const targetBtn = document.getElementById('btn-' + tabName);
        
        if (targetContent) {
            targetContent.style.display = 'block';
        }
        if (targetBtn) {
            targetBtn.classList.add('active');
        }
    };
});
