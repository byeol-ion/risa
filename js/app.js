document.addEventListener('DOMContentLoaded', () => {
    // RISA™ - 글로벌 인터랙션 및 모바일 네비게이션 엔진
    const header = document.getElementById('header');
    
    // 1. Smooth Scrolling for Anchor Links (헤더 높이 보정 포함)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (anchor) {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerHeight = header ? header.offsetHeight : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
      
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });

    // 2. Scroll Reveal Animations (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements && fadeElements.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        fadeElements.forEach(element => {
            if (element) observer.observe(element);
        });
        
        // 초기 로딩 시 화면 내 엘리먼트들 즉시 강제 리빌
        setTimeout(() => {
            fadeElements.forEach(element => {
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= window.innerHeight) {
                        element.classList.add('visible');
                    }
                }
            });
        }, 100);
    }

    // 3. 모바일 메뉴 토글 및 자동 닫기 기능
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            if (link) {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                });
            }
        });
    }
});

// ─────────────────────────────────────────────────────────────────────
// RISA™ 대표님 공장 체크리스트 — 실시간 카운터 및 피드백
// ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('.check-item input[type="checkbox"]');
    const resultEl   = document.getElementById('check-result');
    const resultText = document.getElementById('check-result-text');
    if (!checkboxes.length || !resultEl) return;

    function update() {
        const count = [...checkboxes].filter(cb => cb.checked).length;
        if (count === 0) {
            resultText.textContent = '항목을 체크해 보세요';
            resultEl.style.borderColor = 'rgba(255,152,0,0.4)';
        } else if (count <= 2) {
            resultText.textContent = count + '개 해당 — 주의 구간. 구조 점검이 필요합니다.';
            resultEl.style.borderColor = 'rgba(255,152,0,0.6)';
        } else if (count <= 4) {
            resultText.textContent = '⚠️ ' + count + '개 해당 — 위험 구간! 현장 병목 가능성이 높습니다.';
            resultEl.style.borderColor = '#FF9800';
        } else {
            resultText.textContent = '🚨 ' + count + '개 해당 — 고위험! 무료 구조 진단이 즉시 필요합니다.';
            resultEl.style.borderColor = '#FF5E5E';
            resultEl.style.color = '#FF5E5E';
        }
    }
    checkboxes.forEach(cb => cb.addEventListener('change', update));
});


// ─────────────────────────────────────────────────────────────────────
// RISA™ 모바일 전용 뒤로가기 방어 (Back-Button Guard)
// 원리: history.pushState()로 가짜 히스토리를 심어두고,
//       1차 뒤로가기 = 토스트 경고 노출 / 2차(3초 이내) = 실제 이탈
// ─────────────────────────────────────────────────────────────────────
(function() {
    // 모바일 터치 기기에서만 동작
    const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (!isMobile) return;

    // 가짜 히스토리 항목 삽입 (페이지 최초 로딩 시)
    history.pushState({ risaGuard: true }, '', location.href);

    let backPressedOnce = false;
    let backTimer = null;

    // 토스트 메시지 엘리먼트 생성
    const toast = document.createElement('div');
    toast.id = 'risa-back-toast';
    toast.textContent = '한 번 더 누르시면 페이지를 나갑니다.';
    toast.style.cssText = [
        'position:fixed',
        'bottom:80px',
        'left:50%',
        'transform:translateX(-50%) translateY(20px)',
        'background:rgba(10,37,64,0.92)',
        'color:#fff',
        'padding:13px 26px',
        'border-radius:50px',
        'font-size:0.9rem',
        'font-weight:600',
        'letter-spacing:-0.01em',
        'white-space:nowrap',
        'box-shadow:0 8px 30px rgba(0,0,0,0.25)',
        'z-index:99999',
        'opacity:0',
        'transition:opacity 0.25s ease, transform 0.25s ease',
        'pointer-events:none'
    ].join(';');
    document.body.appendChild(toast);

    function showToast() {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    }
    function hideToast() {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
    }

    window.addEventListener('popstate', function() {
        if (!backPressedOnce) {
            // 1차 뒤로가기: 가짜 히스토리를 다시 심고 토스트 표시
            history.pushState({ risaGuard: true }, '', location.href);
            backPressedOnce = true;
            showToast();

            // 3초 후 자동 리셋
            clearTimeout(backTimer);
            backTimer = setTimeout(function() {
                backPressedOnce = false;
                hideToast();
            }, 3000);
        } else {
            // 2차 뒤로가기: 실제 이탈 허용
            clearTimeout(backTimer);
            hideToast();
            history.back();
        }
    });
})();


