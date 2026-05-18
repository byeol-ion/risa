document.addEventListener('DOMContentLoaded', () => {
    // RISA™ - 고정 헤더 스크롤 클래스 토글 효과
    const header = document.getElementById('header');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
});
