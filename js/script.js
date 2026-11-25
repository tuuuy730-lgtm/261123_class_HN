/* ==========================================================
   MELLOW BEAN — 움직임 효과
   가이드: .claude/skills/mellow-bean-site/SKILL.md
   ========================================================== */

// JS가 동작 중임을 표시 → CSS의 스크롤 등장 효과가 켜짐
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  setupHeader();
  setupReveal();
});

/* 1. 첫 화면을 지나면 헤더 배경을 베이지로 바꾸기 */
function setupHeader() {
  const header = document.getElementById('siteHeader');
  const hero = document.querySelector('.hero');
  if (!header || !hero) return;

  const update = () => {
    const passedHero = hero.getBoundingClientRect().bottom <= header.offsetHeight;
    header.classList.toggle('is-scrolled', passedHero);
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

/* 2. 화면에 들어오는 요소를 부드럽게 나타내기 */
function setupReveal() {
  const items = document.querySelectorAll('.reveal');

  // 오래된 브라우저에서는 효과 없이 바로 보여주기
  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // 한 번 나타나면 끝
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => observer.observe(item));
}
