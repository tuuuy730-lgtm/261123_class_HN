// ===== 예식 정보 (여기만 바꾸면 달력/디데이가 자동으로 바뀝니다) =====
const WEDDING_DATE = new Date(2027, 3, 17, 13, 0); // 월은 0부터 시작 → 3 = 4월

// ===== 토스트 메시지 =====
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

// ===== 클립보드 복사 =====
async function copyText(text, message) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // 파일로 직접 열었을 때 등 clipboard API가 막힌 경우 대비
    const temp = document.createElement('textarea');
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    temp.remove();
  }
  showToast(message);
}

document.querySelectorAll('[data-copy]').forEach((btn) => {
  btn.addEventListener('click', () => copyText(btn.dataset.copy, '복사되었습니다'));
});

document.getElementById('shareBtn').addEventListener('click', () => {
  copyText(location.href, '청첩장 링크가 복사되었습니다');
});

// ===== 달력 그리기 =====
function renderCalendar() {
  const calendar = document.getElementById('calendar');
  const year = WEDDING_DATE.getFullYear();
  const month = WEDDING_DATE.getMonth();
  const weddingDay = WEDDING_DATE.getDate();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  let html = dayNames
    .map((name, i) => {
      const cls = i === 0 ? 'sun' : i === 6 ? 'sat' : '';
      return `<div class="day-name ${cls}">${name}</div>`;
    })
    .join('');

  for (let i = 0; i < firstDay; i++) {
    html += '<div class="cell"></div>';
  }

  for (let date = 1; date <= lastDate; date++) {
    const weekday = (firstDay + date - 1) % 7;
    const classes = ['cell'];
    if (weekday === 0) classes.push('sun');
    if (weekday === 6) classes.push('sat');

    const inner = date === weddingDay
      ? `<span class="cell wedding-day">${date}</span>`
      : date;

    html += `<div class="${classes.join(' ')}">${inner}</div>`;
  }

  calendar.innerHTML = html;
}

// ===== D-day 계산 =====
function renderDday() {
  const dday = document.getElementById('dday');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(WEDDING_DATE);
  target.setHours(0, 0, 0, 0);

  const diff = Math.round((target - today) / (1000 * 60 * 60 * 24));

  if (diff > 0) {
    dday.innerHTML = `민준 ♥ 서연의 결혼식이 <strong>${diff}일</strong> 남았습니다`;
  } else if (diff === 0) {
    dday.innerHTML = '<strong>오늘</strong> 결혼합니다! 🎉';
  } else {
    dday.innerHTML = `결혼한 지 <strong>${Math.abs(diff)}일</strong>째 되는 날입니다`;
  }
}

// ===== 아코디언 (계좌번호) =====
document.querySelectorAll('.accordion-head').forEach((head) => {
  head.addEventListener('click', () => {
    const body = head.nextElementSibling;
    const isOpen = head.getAttribute('aria-expanded') === 'true';

    head.setAttribute('aria-expanded', String(!isOpen));
    body.style.maxHeight = isOpen ? '0' : `${body.scrollHeight}px`;
  });
});

// ===== 갤러리 모달 =====
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');

document.querySelectorAll('.gallery-item').forEach((item) => {
  item.addEventListener('click', () => {
    modalImage.style.background = getComputedStyle(item).background;
    modalCaption.textContent = item.dataset.caption;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  });
});

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

document.getElementById('modalClose').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ===== 스크롤 페이드인 =====
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

// ===== 실행 =====
renderCalendar();
renderDday();
