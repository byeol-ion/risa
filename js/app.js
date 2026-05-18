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
