/* ============================================
   天水师范大学 · 综合材料技法与创作课程
   学生作品在线展厅 - 交互脚本
   ============================================ */

(async function () {

  'use strict';

  // ===== State =====
  let works = [];
  let filteredWorks = [];
  let currentIndex = 0;
  const state = {
    filter: 'all',
    sort: 'default',
    search: ''
  };

  // ===== DOM Refs =====
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

  const gridEl = $('#gallery-grid');
  const countEl = $('#result-count');
  const searchInput = $('#search-input');
  const filterBtns = $$('.filter-btn');
  const sortBtns = $$('.sort-btn');
  const lightbox = $('#lightbox');
  const lightboxClose = $('#lb-close');
  const lbImage = $('#lb-image');
  const lbTitle = $('#lb-title');
  const lbStudent = $('#lb-student');
  const lbMeta = $('#lb-meta');
  const lbDesc = $('#lb-desc');
  const lbPrev = $('#lb-prev');
  const lbNext = $('#lb-next');
  const emptyEl = $('#empty-state');

  // ===== Load Data =====
  async function loadData() {
    try {
      const res = await fetch('data/works.json');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      works = await res.json();
      // If works.json has no data, fallback to embedded sample
      if (!works || works.length === 0) {
        works = getSampleWorks();
      }
    } catch (e) {
      console.warn('加载 works.json 失败，使用内置示例数据:', e.message);
      works = getSampleWorks();
    }
    filteredWorks = [...works];
    updateStats();
    render();
  }

  // ===== Fallback Sample Data =====
  function getSampleWorks() {
    return [
      { id: 1, title: '《综绘印象》', student: '张三', class: '2022级美术学1班', medium: '综合材料', materials: '丙烯、沙粒、宣纸', description: '以自然肌理为灵感，通过材料叠加与组合探索综合材料的视觉表现力。', date: '2026-03', image: 'images/placeholder.jpg', featured: true },
      { id: 2, title: '《时间的褶皱》', student: '李四', class: '2022级美术学1班', medium: '拼贴·综合', materials: '旧报纸、麻布、乳胶', description: '运用旧报纸与麻布的拼接组合，表达时间沉淀后的质感与温度。', date: '2026-03', image: 'images/placeholder.jpg', featured: true },
      { id: 3, title: '《大地之痕》', student: '王五', class: '2022级美术学2班', medium: '综合材料', materials: '泥土、矿物颜料、木板', description: '采集自然泥土为材料，以大地纹理为语言构建抽象的画面叙事。', date: '2026-04', image: 'images/placeholder.jpg', featured: false },
      { id: 4, title: '《弦外之音》', student: '赵六', class: '2022级美术学2班', medium: '装置·综合', materials: '铁丝、棉线、丙烯', description: '以线性材料在空间中交织，探索平面与立体的边界关系。', date: '2026-04', image: 'images/placeholder.jpg', featured: false },
      { id: 5, title: '《纸的叙事》', student: '陈七', class: '2023级美术学1班', medium: '纸艺·综合', materials: '手工纸、墨水、植物纤维', description: '以不同质感的纸张为载体，通过撕、揉、染等手法重塑纸的表现可能。', date: '2026-03', image: 'images/placeholder.jpg', featured: true },
      { id: 6, title: '《光影残片》', student: '刘八', class: '2023级美术学1班', medium: '综合材料', materials: '亚克力板、树脂、色粉', description: '利用透明材料的透光特性，捕捉光线在材质内部游走的瞬间美感。', date: '2026-04', image: 'images/placeholder.jpg', featured: false },
      { id: 7, title: '《锈蚀记忆》', student: '孙九', class: '2022级美术学1班', medium: '金属·综合', materials: '铁片、铜丝、锈蚀剂', description: '利用金属的自然氧化过程，记录时间在材料表面留下的痕迹。', date: '2026-05', image: 'images/placeholder.jpg', featured: false },
      { id: 8, title: '《织物诗篇》', student: '周十', class: '2023级美术学2班', medium: '纤维·综合', materials: '棉麻布料、刺绣线、蜡染', description: '将传统纺织工艺与当代综合材料结合，织造出富有诗意的视觉语言。', date: '2026-05', image: 'images/placeholder.jpg', featured: true }
    ];
  }

  // ===== Stats =====
  function updateStats() {
    const total = works.length;
    document.getElementById('stat-total').textContent = total;
    const mediums = new Set(works.map(w => w.medium));
    document.getElementById('stat-mediums').textContent = mediums.size;
    const classes = new Set(works.map(w => w.class));
    document.getElementById('stat-classes').textContent = classes.size;
  }

  // ===== Filter & Sort =====
  function applyFilters() {
    let result = [...works];

    // Search
    if (state.search.trim()) {
      const q = state.search.trim().toLowerCase();
      result = result.filter(w =>
        w.title.toLowerCase().includes(q) ||
        w.student.toLowerCase().includes(q) ||
        (w.medium || '').toLowerCase().includes(q) ||
        (w.materials || '').toLowerCase().includes(q) ||
        (w.description || '').toLowerCase().includes(q) ||
        (w.class || '').toLowerCase().includes(q)
      );
    }

    // Filter by medium/class
    if (state.filter !== 'all') {
      result = result.filter(w => {
        if (state.filter === 'featured') return w.featured;
        return w.medium === state.filter || w.class === state.filter;
      });
    }

    // Sort
    switch (state.sort) {
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title, 'zh'));
        break;
      case 'date':
        result.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        break;
      case 'default':
      default:
        result.sort((a, b) => (a.id || 0) - (b.id || 0));
        break;
    }

    filteredWorks = result;
    render();
  }

  // ===== Render Grid =====
  function render() {
    if (filteredWorks.length === 0) {
      gridEl.innerHTML = '';
      emptyEl.style.display = 'block';
      countEl.innerHTML = '共 <strong>0</strong> 件作品';
      return;
    }

    emptyEl.style.display = 'none';
    countEl.innerHTML = `共 <strong>${filteredWorks.length}</strong> 件作品  <span style="opacity:0.5">·</span>  第 ${((currentIndex / 20) | 0) + 1} 页`;

    gridEl.innerHTML = filteredWorks.map((w, i) => `
      <article class="card" data-index="${i}" role="button" tabindex="0" aria-label="${w.title} — ${w.student}">
        <div class="card-image-wrap">
          <img
            src="${w.image}"
            alt="${w.title}"
            loading="lazy"
            onerror="this.src='data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#efece4"/><text x="200" y="150" text-anchor="middle" fill="#c4956a" font-size="48">🎨</text><text x="200" y="195" text-anchor="middle" fill="#7a7a7a" font-size="14">暂无图片</text></svg>')}'">
          <span class="card-badge ${w.featured ? 'show' : ''}">精选</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${w.title}</h3>
          <p class="card-student">${w.student} <span style="opacity:0.4">·</span> ${w.class || ''}</p>
          <div class="card-tags">
            ${w.medium ? `<span class="card-tag">${w.medium}</span>` : ''}
            ${w.materials ? `<span class="card-tag">${w.materials}</span>` : ''}
          </div>
        </div>
      </article>
    `).join('');

    // Click handler
    $$('.card').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.index, 10);
        openLightbox(idx);
      });
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const idx = parseInt(el.dataset.index, 10);
          openLightbox(idx);
        }
      });
    });
  }

  // ===== Lightbox =====
  function openLightbox(index) {
    currentIndex = index;
    const w = filteredWorks[currentIndex];
    if (!w) return;

    lbImage.src = w.image;
    lbImage.alt = w.title;
    lbImage.onerror = function() {
      this.src = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="500" height="375" viewBox="0 0 500 375"><rect width="500" height="375" fill="#efece4"/><text x="250" y="188" text-anchor="middle" fill="#c4956a" font-size="64">🎨</text><text x="250" y="240" text-anchor="middle" fill="#7a7a7a" font-size="16">暂无图片</text></svg>');
    };

    lbTitle.textContent = w.title;
    lbStudent.textContent = `${w.student} · ${w.class || ''}`;

    let metaHtml = '';
    if (w.medium) metaHtml += `<span class="lb-meta-item">${w.medium}</span>`;
    if (w.materials) metaHtml += `<span class="lb-meta-item">${w.materials}</span>`;
    if (w.date) metaHtml += `<span class="lb-meta-item">${w.date}</span>`;
    lbMeta.innerHTML = metaHtml;

    lbDesc.textContent = w.description || '暂无作品说明';

    lbPrev.classList.toggle('disabled', currentIndex <= 0);
    lbNext.classList.toggle('disabled', currentIndex >= filteredWorks.length - 1);

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function prevWork() {
    if (currentIndex > 0) openLightbox(currentIndex - 1);
  }

  function nextWork() {
    if (currentIndex < filteredWorks.length - 1) openLightbox(currentIndex + 1);
  }

  // ===== Keyboard =====
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevWork();
    if (e.key === 'ArrowRight') nextWork();
  });

  // ===== Event Listeners =====
  // Lightbox
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  lbPrev.addEventListener('click', prevWork);
  lbNext.addEventListener('click', nextWork);

  // Search
  searchInput.addEventListener('input', e => {
    state.search = e.target.value;
    currentIndex = 0;
    applyFilters();
  });

  // Filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.filter = btn.dataset.filter;
      currentIndex = 0;
      applyFilters();
    });
  });

  // Sort buttons
  sortBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sortBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.sort = btn.dataset.sort;
      applyFilters();
    });
  });

  // ===== Init =====
  await loadData();

})();
