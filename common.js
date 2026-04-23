// ── ELJNINA COMMON LIBRARY ──
// Handles Sidebar, Navigation, Trial Timer, and Database Connections

const SUPPORT_NUMBER = "201109163370";

// Standard Sidebar Navigation Links
const NAV_LINKS = [
  { key:'manage',        icon:'⚙️',  label:'إدارة الروابط',     file:'manage.html' },
  { key:'exam-builder',  icon:'📝',  label:'الاختبارات',         file:'exam-builder.html' },
  { key:'students-list', icon:'👥',  label:'قائمة الطلاب',      file:'students-list.html' },
  { key:'dashboard',     icon:'📊',  label:'الإحصائيات',         file:'dashboard.html' },
  { key:'classroom',     icon:'🎥',  label:'القاعة الافتراضية',  file:'classroom.html' },
];

const common = {
  supabase: null,
  
  // Initialize Supabase (Dynamic import to support different environments)
  async initSupabase() {
    if (this.supabase) return this.supabase;
    
    // Check if initialization is already in progress to avoid race conditions
    if (this._initPromise) return this._initPromise;

    this._initPromise = (async () => {
        try {
            // Try to get config from window or file
            let config = window.SAAS_CONFIG;
            if (!config) {
                const mod = await import('./config.js').catch(() => ({ default: { SUPABASE_URL: '', SUPABASE_ANON_KEY: '' } }));
                config = mod.default;
            }
            
            if (!config.SUPABASE_URL || config.SUPABASE_URL === 'YOUR_SUPABASE_URL' || config.SUPABASE_URL.includes('fpvtcgafpgdvuwtwxunm')) {
                console.warn("Supabase is using fallback/demo credentials. Data might not go to YOUR project.");
            }

            const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
            this.supabase = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
            
            // Basic connection test
            const { error } = await this.supabase.from('teachers').select('id').limit(1);
            if (error) {
                console.error("Supabase Connection Error:", error.message);
                if (error.message.includes('relation')) {
                    console.error("TIP: Did you run setup.sql in Supabase SQL Editor?");
                }
            }
            
            return this.supabase;
        } catch(e) {
            console.error("Supabase init failed", e);
            return null;
        } finally {
            this._initPromise = null;
        }
    })();

    return this._initPromise;
  },

  // Sidebar Injection (Main Admin Navigation)
  injectSidebar(currentView, teacherName = 'تحميل...') {
    // Prevent duplicate injection
    if (document.getElementById('main-sidebar')) {
        const nameEl = document.querySelector('.sb-teacher');
        if (nameEl && teacherName !== 'تحميل...') nameEl.textContent = teacherName;
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const teacherId = params.get('teacher') || params.get('teacher_id') || 'demo';
    
    // Inject CSS
    if (!document.getElementById('sb-style')) {
        const s = document.createElement('style');
        s.id = 'sb-style';
        s.textContent = `
            :root{--sb-w:260px; --primary: #10b981; --bg-dark: #0f172a;}
            body.has-sb{padding-right:var(--sb-w) !important;}
            @media(max-width:1023px){ body.has-sb{padding-right:0 !important} }
            
            .sidebar{position:fixed;top:0;right:0;bottom:0;width:var(--sb-w);
              background:var(--bg-dark);border-left:1px solid rgba(255,255,255,.07);
              display:flex;flex-direction:column;z-index:99999;
              transition:transform .3s cubic-bezier(0.4, 0, 0.2, 1);overflow-y:auto;overflow-x:hidden}
            .sb-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);
              z-index:99998;backdrop-filter:blur(4px);cursor:pointer}
            .sb-overlay.on{display:block}
            .sb-hamburger{display:none;position:fixed;top:.85rem;right:.85rem;z-index:100000;
              width:44px;height:44px;background:var(--bg-dark);border:1px solid rgba(255,255,255,.15);
              border-radius:12px;align-items:center;justify-content:center;
              cursor:pointer;font-size:1.4rem;color:#fff;box-shadow:0 6px 16px rgba(0,0,0,0.4)}

            @media(max-width:1023px){
              .sidebar{transform:translateX(var(--sb-w))}
              .sidebar.open{transform:translateX(0)}
              .sb-hamburger{display:flex}
            }
            .sb-header{padding:1.8rem 1.2rem 1.2rem;border-bottom:1px solid rgba(255,255,255,.06);
              display:flex;align-items:center;gap:1rem;color:#fff}
            .sb-logo{width:42px;height:42px;background:var(--primary);border-radius:14px;
              display:flex;align-items:center;justify-content:center;font-size:1.3rem;
              box-shadow:0 0 20px rgba(16,185,129,.35)}
            .sb-teacher{font-size:1.1rem;font-weight:900;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:150px}
            .sb-nav{padding:1.5rem 0.75rem;flex:1}
            .sb-link{display:flex;align-items:center;gap:.9rem;padding:0.9rem 1rem;
              color:rgba(255,255,255,.6);text-decoration:none;font-weight:700;font-size:.9rem;
              border-radius:16px;margin-bottom:.35rem;transition:all .2s ease}
            .sb-link:hover{background:rgba(255,255,255,.04);color:#fff}
            .sb-link.active{background:var(--primary);color:#fff;box-shadow:0 10px 20px rgba(16,185,129,.2)}
            .sb-foot{padding:1.5rem;border-top:1px solid rgba(255,255,255,.06);background:rgba(0,0,0,.2)}
            .sb-support{display:block;padding:1rem;background:rgba(255,255,255,.05);
              border:1px solid rgba(255,255,255,.1);border-radius:18px;color:#fff;
              text-decoration:none;font-size:.85rem;font-weight:900;text-align:center;transition:all .3s ease}
            .sb-trial-card{margin:1.5rem 0.75rem;padding:1.25rem;background:linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
              border:1px solid rgba(255,255,255,.1);border-radius:24px;text-align:center}
            .sb-trial-timer{font-size:1.4rem;font-weight:900;color:var(--primary);letter-spacing:1px}
        `;
        document.head.appendChild(s);
    }

    document.body.classList.add('has-sb');

    const links = NAV_LINKS.map(l => `
      <a href="${l.file}?teacher=${teacherId}"
         class="sb-link ${currentView === l.key ? 'active' : ''}">
        <span class="sb-icon">${l.icon}</span>
        <span>${l.label}</span>
      </a>`).join('');

    const html = `
      <div class="sb-overlay" id="sb-overlay"></div>
      <button class="sb-hamburger" id="sb-ham">☰</button>
      <aside class="sidebar" id="main-sidebar">
        <div class="sb-header">
          <div class="sb-logo">📚</div>
          <div>
            <div style="font-size:.7rem;font-weight:900;color:rgba(255,255,255,.4)">Eljnina</div>
            <div class="sb-teacher">${teacherName}</div>
          </div>
        </div>
        
        <div class="sb-trial-card">
          <span style="font-size:.6rem;color:rgba(255,255,255,.5);display:block;margin-bottom:5px">التجربة تنتهي خلال</span>
          <div class="sb-trial-timer" id="sb-trial-timer">--:--:--</div>
        </div>

        <nav class="sb-nav">
          <div style="font-size:.65rem;color:rgba(255,255,255,.2);margin-bottom:1rem;padding-right:.75rem">القائمة</div>
          ${links}
        </nav>

        <div class="sb-foot">
          <a href="https://wa.me/${SUPPORT_NUMBER}" target="_blank" class="sb-support">💬 الدعم الفني</a>
          <div style="display:flex;justify-content:center;gap:1.5rem;margin-top:1rem;opacity:.3">
            <a href="https://www.facebook.com/profile.php?id=61572099418400" target="_blank" style="color:#fff;text-decoration:none">FB</a>
            <a href="https://www.instagram.com/eljni_na/" target="_blank" style="color:#fff;text-decoration:none">IG</a>
          </div>
        </div>
      </aside>`;

    document.body.insertAdjacentHTML('afterbegin', html);

    // Event Listeners
    const ham = document.getElementById('sb-ham');
    const side = document.getElementById('main-sidebar');
    const over = document.getElementById('sb-overlay');
    
    ham?.addEventListener('click', () => { side.classList.toggle('open'); over.classList.toggle('on'); });
    over?.addEventListener('click', () => { side.classList.remove('open'); over.classList.remove('on'); });

    this.initTrialTimer(teacherId);
  },

  // Navigation Injection (For start.html / landing)
  injectNavigation(view) {
    const nav = `
    <nav style="height:80px;background:rgba(255,255,255,.8);backdrop-filter:blur(10px);border-bottom:1px solid #e2e8f0;padding:0 2rem;position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between" dir="rtl">
      <a href="index.html" style="display:flex;align-items:center;gap:.75rem;text-decoration:none">
        <div style="width:40px;height:40px;background:#10b981;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff">📚</div>
        <span style="font-size:1.25rem;font-weight:900;color:#0f172a;font-family:'Cairo'">الجنينة / <span style="color:#10b981">Eljnina</span></span>
      </a>
    </nav>`;
    const container = document.getElementById('navbar-container');
    if (container) {
        container.innerHTML = nav;
        container.style.display = 'block';
    }
  },

  initTrialTimer(teacherId) {
    const el = document.getElementById('sb-trial-timer');
    if (!el) return;
    const START_KEY = `eljnina_trial_start_${teacherId}`;
    let start = localStorage.getItem(START_KEY);
    if (!start) { start = Date.now(); localStorage.setItem(START_KEY, start); }
    const expiry = parseInt(start) + (4 * 24 * 60 * 60 * 1000);
    const update = () => {
      const diff = expiry - Date.now();
      if (diff <= 0) { el.textContent = "00:00:00"; this.showTrialLock(teacherId); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      el.textContent = `${d}d ${h}:${m}:${s}`;
    };
    update(); setInterval(update, 1000);
  },

  async showTrialLock(teacherId) {
    const sb = await this.initSupabase();
    if (!sb) return;
    const { data } = await sb.from('teachers').select('subscription_tier').eq('id', teacherId).single();
    if (data && data.subscription_tier !== 'basic') return;

    if (document.getElementById('trial-lock')) return;
    const lock = `
      <div id="trial-lock" style="position:fixed;inset:0;background:rgba(15,23,42,.98);z-index:999999;display:flex;align-items:center;justify-content:center;font-family:'Cairo';text-align:center">
        <div style="background:#fff;padding:3rem;border-radius:2.5rem;max-width:400px">
          <div style="font-size:3rem;margin-bottom:1rem">⌛</div>
          <h2 style="font-weight:900">انتهت الفترة التجريبية</h2>
          <p style="color:#64748b;margin:1.5rem 0 2rem">يرجى تفعيل حسابك للاستمرار.</p>
          <a href="https://wa.me/${SUPPORT_NUMBER}" target="_blank" style="display:block;background:#10b981;color:#fff;padding:1rem;border-radius:1rem;font-weight:900;text-decoration:none">تفعيل الحساب الآن</a>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', lock);
  },

  injectFooter() {
    const el = document.getElementById('footer-container');
    if (el) el.innerHTML = '';
  }
};

// Auto-init Supabase
common.initSupabase();

export default common;
window.common = common;
