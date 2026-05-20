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

