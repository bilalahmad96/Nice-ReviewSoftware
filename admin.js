// NICE Computer Education - School of Coding, Yavatmal
// Admin Dashboard Controller

const ADMIN_CREDENTIALS = {
  user: 'nice_yavatmal',
  pass: 'Coding@445001'
};

// DOM References
const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

const statTotalReviews = document.getElementById('statTotalReviews');
const statGoogleReviews = document.getElementById('statGoogleReviews');
const statGrievances = document.getElementById('statGrievances');
const statAvgRating = document.getElementById('statAvgRating');

const searchInput = document.getElementById('searchInput');
const filterRatingSelect = document.getElementById('filterRatingSelect');
const recordCount = document.getElementById('recordCount');
const reviewsTableBody = document.getElementById('reviewsTableBody');
const exportExcelBtn = document.getElementById('exportExcelBtn');
const clearRecordsBtn = document.getElementById('clearRecordsBtn');

// Check Authentication (Persistent or Session)
function checkAuth() {
  const isPersistent = localStorage.getItem('nice_admin_persistent_auth') === 'true';
  const isSession = sessionStorage.getItem('nice_admin_authenticated') === 'true';
  const isAuth = isPersistent || isSession;

  if (isAuth) {
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    const badgeText = document.getElementById('sessionCountText');
    if (badgeText) {
      badgeText.textContent = isPersistent ? 'Stay Logged In (Saved)' : '1 Active Session';
    }
    renderDashboard();
  } else {
    loginSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
  }
}

// Login Submit
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const u = usernameInput.value.trim();
  const p = passwordInput.value.trim();
  const stayLoggedIn = document.getElementById('stayLoggedInCheckbox')
    ? document.getElementById('stayLoggedInCheckbox').checked
    : true;

  if (u === ADMIN_CREDENTIALS.user && (p === 'Coding@445001' || p === 'Coding@445002')) {
    if (stayLoggedIn) {
      localStorage.setItem('nice_admin_persistent_auth', 'true');
      sessionStorage.setItem('nice_admin_authenticated', 'true');
    } else {
      localStorage.removeItem('nice_admin_persistent_auth');
      sessionStorage.setItem('nice_admin_authenticated', 'true');
    }
    loginError.classList.add('hidden');
    checkAuth();
  } else {
    loginError.textContent = 'Invalid username or password. Please try again.';
    loginError.classList.remove('hidden');
  }
});

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('nice_admin_persistent_auth');
  sessionStorage.removeItem('nice_admin_authenticated');
  usernameInput.value = '';
  passwordInput.value = '';
  checkAuth();
});

// Fetch Reviews
function getReviews() {
  const raw = JSON.parse(localStorage.getItem('nice_reviews_db') || '[]');
  const realOnly = raw.filter((r) => !r.id || !r.id.startsWith('REV-NC'));
  if (realOnly.length !== raw.length) {
    localStorage.setItem('nice_reviews_db', JSON.stringify(realOnly));
  }
  return realOnly;
}

// Render Dashboard Metrics & Table
function renderDashboard() {
  const reviews = getReviews();
  const total = reviews.length;
  const googleList = reviews.filter((r) => r.rating >= 4);
  const grievanceList = reviews.filter((r) => r.rating < 4);

  statTotalReviews.textContent = total;
  statGoogleReviews.textContent = googleList.length;
  statGrievances.textContent = grievanceList.length;

  if (total > 0) {
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    statAvgRating.textContent = (sum / total).toFixed(1) + ' ★';
  } else {
    statAvgRating.textContent = '5.0 ★';
  }

  renderTable();
}

// Render Table
function renderTable() {
  const reviews = getReviews();
  const query = searchInput.value.toLowerCase().trim();
  const ratingFilter = filterRatingSelect.value;

  const filtered = reviews.filter((r) => {
    const matchesQuery =
      (r.name && r.name.toLowerCase().includes(query)) ||
      (r.course && r.course.toLowerCase().includes(query)) ||
      (r.reviewText && r.reviewText.toLowerCase().includes(query));

    let matchesRating = true;
    if (ratingFilter === '5') matchesRating = r.rating === 5;
    else if (ratingFilter === '4') matchesRating = r.rating === 4;
    else if (ratingFilter === 'grievances') matchesRating = r.rating < 4;

    return matchesQuery && matchesRating;
  });

  recordCount.textContent = filtered.length;

  if (filtered.length === 0) {
    reviewsTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="p-10 text-center text-slate-400">
          <div class="text-3xl mb-2">🎓</div>
          <div class="font-bold text-slate-700 text-sm">No Student Reviews Logged Yet</div>
          <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Real student reviews will appear here automatically when students generate &amp; submit reviews via the student app.</p>
        </td>
      </tr>
    `;
    return;
  }

  reviewsTableBody.innerHTML = filtered.map((r) => {
    const dateFormatted = new Date(r.timestamp).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const isGoogle = r.rating >= 4;
    let statusPill = '';
    if (!isGoogle) {
      statusPill = `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">⚠ Grievance Caught</span>`;
    } else if (r.status === 'direct_google') {
      statusPill = `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">⭐ Direct 5★ Rating</span>`;
    } else {
      statusPill = `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">✓ Google Review</span>`;
    }

    const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);

    return `
      <tr class="hover:bg-slate-50 transition">
        <td class="p-3.5 pl-5 text-slate-500 whitespace-nowrap">${dateFormatted}</td>
        <td class="p-3.5">
          <div class="font-bold text-slate-900">${escapeHtml(r.name)}</div>
          <div class="text-[10px] text-slate-400 uppercase">${escapeHtml(r.stream || 'coding')}</div>
        </td>
        <td class="p-3.5">
          <span class="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-[11px]">${escapeHtml(r.course)}</span>
        </td>
        <td class="p-3.5 whitespace-nowrap">
          <span class="text-amber-500 font-bold">${stars}</span>
          <span class="text-[11px] text-slate-400 font-semibold ml-1">(${r.rating}★)</span>
        </td>
        <td class="p-3.5">${statusPill}</td>
        <td class="p-3.5 pr-5 max-w-xs text-slate-600 line-clamp-2">
          ${escapeHtml(r.reviewText)}
          ${r.hasPhoto ? `<span class="ml-1 text-emerald-600 font-bold text-[10px]">📸 Photo</span>` : ''}
        </td>
      </tr>
    `;
  }).join('');
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Excel Export (UTF-8 BOM CSV)
exportExcelBtn.addEventListener('click', () => {
  const reviews = getReviews();
  if (reviews.length === 0) {
    alert('No reviews found to export!');
    return;
  }

  const headers = ['Record ID', 'Timestamp', 'Student Name', 'Course Stream', 'Course Name', 'Rating', 'Status', 'Feedback / Review Note'];

  const rows = reviews.map((r) => [
    r.id || '',
    new Date(r.timestamp).toLocaleString('en-IN'),
    `"${(r.name || '').replace(/"/g, '""')}"`,
    `"${(r.stream || '').replace(/"/g, '""')}"`,
    `"${(r.course || '').replace(/"/g, '""')}"`,
    r.rating,
    r.status === 'direct_google'
      ? 'Direct 5-Star Google Rating'
      : r.status === 'copied_google'
        ? 'Google Review'
        : 'Grievance Handled',
    `"${(r.reviewText || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `NICE_Computer_Education_Reviews_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

// Clear All Records Action
if (clearRecordsBtn) {
  clearRecordsBtn.addEventListener('click', () => {
    const current = getReviews();
    if (current.length === 0) {
      alert('No review records exist to clear.');
      return;
    }
    if (confirm('Are you sure you want to clear all review logs? Only new genuine student reviews will be recorded.')) {
      localStorage.removeItem('nice_reviews_db');
      renderDashboard();
    }
  });
}

// Filter & Search Listeners
searchInput.addEventListener('input', renderTable);
filterRatingSelect.addEventListener('change', renderTable);

// Standee Modal Open / Close Handlers
function openStandeeModal() {
  const modal = document.getElementById('standeeModal');
  if (modal) modal.classList.remove('hidden');
}

function closeStandeeModal() {
  const modal = document.getElementById('standeeModal');
  if (modal) modal.classList.add('hidden');
}

// Helper: Draw rounded rectangle path on Canvas
function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function loadImageAsync(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load ' + src));
    img.src = src;
  });
}

// Render & Download Full Standee Artwork as High-Resolution PNG (1400 x 1980)
async function downloadStandeeAsPng() {
  const btn = document.getElementById('downloadStandeePngBtn');
  const originalHtml = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>⏳ Generating HD Standee PNG...</span>';
  }

  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const [logoImg, qrImg] = await Promise.all([
      loadImageAsync('assets/original-logo.jpg'),
      loadImageAsync('nice-googlereviews-qr.png')
    ]);

    const W = 1400;
    const H = 1980;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    // White Card Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    // Subtle outer border
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, W - 4, H - 4);

    // Top-left & Top-right Google 4-color dots
    const dotColors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];
    dotColors.forEach((color, idx) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(64 + idx * 34, 62, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(W - 64 - (3 - idx) * 34, 62, 10, 0, Math.PI * 2);
      ctx.fill();
    });

    // Centered NICE Logo (Rounded square)
    const logoSize = 144;
    const logoX = (W - logoSize) / 2;
    const logoY = 82;
    ctx.save();
    roundRectPath(ctx, logoX, logoY, logoSize, logoSize, 32);
    ctx.clip();
    ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
    ctx.restore();
    ctx.strokeStyle = '#d1fae5';
    ctx.lineWidth = 3;
    roundRectPath(ctx, logoX, logoY, logoSize, logoSize, 32);
    ctx.stroke();

    // Brand Title: NICE (Arial Black) + COMPUTER EDUCATION (Plus Jakarta Sans)
    const titleY = 294;
    ctx.textBaseline = 'alphabetic';
    ctx.font = '900 72px Arial, Helvetica, sans-serif';
    const niceW = ctx.measureText('NICE').width;
    ctx.font = '800 46px "Plus Jakarta Sans", Inter, sans-serif';
    const eduW = ctx.measureText('COMPUTER EDUCATION').width;
    const gap = 22;
    const startX = (W - (niceW + gap + eduW)) / 2;

    ctx.fillStyle = '#064E3B';
    ctx.font = '900 72px Arial, Helvetica, sans-serif';
    ctx.fillText('NICE', startX, titleY);

    ctx.fillStyle = '#0f172a';
    ctx.font = '800 46px "Plus Jakarta Sans", Inter, sans-serif';
    ctx.fillText('COMPUTER EDUCATION', startX + niceW + gap, titleY);

    // Subtitle Pill Badge
    const pillText = 'SCHOOL OF CODING  •  OFFICIAL IT TRAINING CENTER';
    ctx.font = '800 24px "Plus Jakarta Sans", Inter, sans-serif';
    const pillW = ctx.measureText(pillText).width + 92;
    const pillH = 56;
    const pillX = (W - pillW) / 2;
    const pillY = 328;

    ctx.fillStyle = '#ecfdf5';
    roundRectPath(ctx, pillX, pillY, pillW, pillH, 28);
    ctx.fill();
    ctx.strokeStyle = '#a7f3d0';
    ctx.lineWidth = 2.5;
    roundRectPath(ctx, pillX, pillY, pillW, pillH, 28);
    ctx.stroke();

    ctx.fillStyle = '#065f46';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(pillText, W / 2, pillY + pillH / 2 + 1);

    // Multi-colored "Google Reviews" Title
    const gLetters = [
      { ch: 'G', color: '#4285F4' },
      { ch: 'o', color: '#EA4335' },
      { ch: 'o', color: '#FBBC05' },
      { ch: 'g', color: '#4285F4' },
      { ch: 'l', color: '#34A853' },
      { ch: 'e', color: '#EA4335' }
    ];
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '800 72px "Plus Jakarta Sans", Inter, sans-serif';
    const googleWidth = gLetters.reduce((acc, item) => acc + ctx.measureText(item.ch).width, 0);
    const reviewsText = ' Reviews';
    const reviewsWidth = ctx.measureText(reviewsText).width;
    let gx = (W - (googleWidth + reviewsWidth)) / 2;
    const gy = 486;

    gLetters.forEach((item) => {
      ctx.fillStyle = item.color;
      ctx.fillText(item.ch, gx, gy);
      gx += ctx.measureText(item.ch).width;
    });
    ctx.fillStyle = '#1e293b';
    ctx.fillText(reviewsText, gx, gy);

    // "SCAN TO LEAVE US A REVIEW"
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 46px "Plus Jakarta Sans", Inter, sans-serif';
    ctx.fillText('SCAN TO LEAVE US A REVIEW', W / 2, 558);

    // 4-Color Google Gradient Frame around QR Code
    const frameSize = 740;
    const frameX = (W - frameSize) / 2;
    const frameY = 626;
    const grad = ctx.createLinearGradient(frameX, frameY, frameX + frameSize, frameY + frameSize);
    grad.addColorStop(0, '#4285F4');
    grad.addColorStop(0.35, '#EA4335');
    grad.addColorStop(0.68, '#FBBC05');
    grad.addColorStop(1, '#34A853');

    ctx.fillStyle = grad;
    roundRectPath(ctx, frameX, frameY, frameSize, frameSize, 64);
    ctx.fill();

    // Inner White QR Box
    const borderThick = 14;
    const innerSize = frameSize - borderThick * 2;
    const innerX = frameX + borderThick;
    const innerY = frameY + borderThick;
    ctx.fillStyle = '#ffffff';
    roundRectPath(ctx, innerX, innerY, innerSize, innerSize, 52);
    ctx.fill();

    // Draw High-Res QR Code inside
    const qrPad = 36;
    const qrDrawSize = innerSize - qrPad * 2;
    ctx.drawImage(qrImg, innerX + qrPad, innerY + qrPad, qrDrawSize, qrDrawSize);

    // Dark Camera Pill Below QR
    const camText = 'Point Your Phone Camera to Scan';
    ctx.font = '700 30px "Plus Jakarta Sans", Inter, sans-serif';
    const camPillW = ctx.measureText(camText).width + 110;
    const camPillH = 74;
    const camPillX = (W - camPillW) / 2;
    const camPillY = 1420;

    ctx.fillStyle = '#0f172a';
    roundRectPath(ctx, camPillX, camPillY, camPillW, camPillH, 37);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'middle';
    ctx.fillText(camText, W / 2, camPillY + camPillH / 2 + 1);

    // Live URL label below dark pill
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#475569';
    ctx.font = '600 28px "Plus Jakarta Sans", Inter, sans-serif';
    ctx.fillText('nice-googlereviews.vercel.app', W / 2, 1546);

    // 5 Golden Stars
    ctx.fillStyle = '#fbbf24';
    ctx.font = '700 50px Arial, sans-serif';
    ctx.fillText('★  ★  ★  ★  ★', W / 2, 1656);

    // THANK YOU
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 46px "Plus Jakarta Sans", Inter, sans-serif';
    ctx.fillText('THANK YOU', W / 2, 1726);

    ctx.fillStyle = '#475569';
    ctx.font = '500 28px "Plus Jakarta Sans", Inter, sans-serif';
    ctx.fillText('We appreciate your valuable feedback & support!', W / 2, 1776);

    // Footer Divider
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 1832);
    ctx.lineTo(W - 80, 1832);
    ctx.stroke();

    // Footer Text
    ctx.fillStyle = '#064E3B';
    ctx.font = '800 27px "Plus Jakarta Sans", Inter, sans-serif';
    ctx.fillText('NICE COMPUTER EDUCATION • YAVATMAL', W / 2, 1876);

    ctx.fillStyle = '#475569';
    ctx.font = '500 23px "Plus Jakarta Sans", Inter, sans-serif';
    ctx.fillText('Plot No. 45, Bharathi Layout, Near Darda Nagar, Wadgaon, Yavatmal – 445001', W / 2, 1916);

    ctx.fillStyle = '#334155';
    ctx.font = '600 22px "Plus Jakarta Sans", Inter, sans-serif';
    ctx.fillText('Shailesh Sambhe: +91 97675 41889 • Namrata Sambhe: +91 97637 17418 (Call & WhatsApp) • computereducation.nice@gmail.com', W / 2, 1952);

    // Export as PNG and trigger download
    canvas.toBlob((blob) => {
      if (!blob) {
        alert('Could not generate PNG. Please try opening via your live Vercel link.');
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'NICE_Google_Review_Standee.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    }, 'image/png');

    if (btn) {
      btn.innerHTML = '<span>✓ Standee PNG Downloaded!</span>';
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
      }, 2200);
    }
  } catch (err) {
    console.error('Standee PNG export failed:', err);
    alert('Unable to export standee PNG in this view. Try printing via "Open Fullscreen & Print" or opening from your live site.');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalHtml;
    }
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeStandeeModal();
});

document.addEventListener('DOMContentLoaded', checkAuth);
