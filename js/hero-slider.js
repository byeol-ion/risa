document.addEventListener('DOMContentLoaded', () => {
    // RISA™ - 대문 슬라이더 6초 자동 회전 로직 (안정적인 메모리 관리형)
    let isFirstSlide = true;
    
    const s1 = document.getElementById('slide-1');
    const s2 = document.getElementById('slide-2');
    
    if (s1 && s2) {
        setInterval(() => {
            if (isFirstSlide) {
                s1.classList.remove('active');
                s2.classList.add('active');
            } else {
                s2.classList.remove('active');
                s1.classList.add('active');
            }
            isFirstSlide = !isFirstSlide;
        }, 6000); // B2B 고객 가독성 맞춤형 6초 주기
    }
});
