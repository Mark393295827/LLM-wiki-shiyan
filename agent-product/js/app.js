/**
 * STOW Agent V3.0 — Main Application
 * Full-Stack Intelligent Knowledge & Asset Transformation System
 */

(function () {
  'use strict';

  // ============================================
  // STATE
  // ============================================
  const state = {
    startTime: Date.now(),
    signals: 347,
    knowledgeNodes: 3421,
    outputs: 187,
    activeAgents: 2,
    tokenCount: 124800,
    signalFeedItems: [
      { time: '19:24', text: '检测到西班牙房产市场政策变动信号...' },
      { time: '19:21', text: 'AI Agent 框架技术突破追踪更新' },
      { time: '19:18', text: '全球宏观经济指标异动警报' },
    ],
    pipelineStep: 0,
    stowOpen: false,
  };

  // ============================================
  // INITIALIZATION
  // ============================================
  const agentSystem = new AgentSystem();

  // Animate stat counters on load
  animateCounters();

  // Setup navigation
  setupNavigation();

  // Setup STOW sidebar
  setupStowSidebar();

  // Start live updates
  startLiveUpdates();

  // Pipeline animation
  startPipelineAnimation();

  // Uptime tracker
  startUptimeTracker();

  // ============================================
  // COUNTER ANIMATION
  // ============================================
  function animateCounters() {
    animateValue('statSignals', 0, state.signals, 1500);
    animateValue('statKnowledge', 0, state.knowledgeNodes, 2000);
    animateValue('statOutputs', 0, state.outputs, 1800);
    animateValue('statAgents', 0, state.activeAgents, 800);
  }

  function animateValue(elementId, start, end, duration) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const startTime = performance.now();
    const isFloat = !Number.isInteger(end);

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);

      el.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ============================================
  // NAVIGATION
  // ============================================
  function setupNavigation() {
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.layer-section');

    // Click handler
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-section');
        const target = document.getElementById(targetId);

        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });

          links.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    });

    // Scroll spy
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach(l => {
            l.classList.toggle('active', l.getAttribute('data-section') === id);
          });
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: `-${64}px 0px -30% 0px`
    });

    sections.forEach(s => observer.observe(s));

    // Nav background on scroll
    const nav = document.getElementById('topNav');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        nav.style.background = 'rgba(10, 14, 26, 0.95)';
        nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
      } else {
        nav.style.background = 'rgba(10, 14, 26, 0.85)';
        nav.style.boxShadow = 'none';
      }
    });
  }

  // ============================================
  // STOW SIDEBAR
  // ============================================
  function setupStowSidebar() {
    const toggle = document.getElementById('stowToggle');
    const sidebar = document.getElementById('stowSidebar');

    if (!toggle || !sidebar) return;

    toggle.addEventListener('click', () => {
      state.stowOpen = !state.stowOpen;
      sidebar.classList.toggle('open', state.stowOpen);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (state.stowOpen && !sidebar.contains(e.target)) {
        state.stowOpen = false;
        sidebar.classList.remove('open');
      }
    });
  }

  // ============================================
  // LIVE UPDATES
  // ============================================
  function startLiveUpdates() {
    // Signal feed updates
    setInterval(() => {
      addNewSignal();
    }, 8000);

    // Metric updates
    setInterval(() => {
      updateMetrics();
    }, 3000);

    // Token counter
    setInterval(() => {
      state.tokenCount += Math.floor(Math.random() * 200 - 50);
      const tokenEl = document.getElementById('tokenValue');
      if (tokenEl) {
        tokenEl.textContent = (state.tokenCount / 1000).toFixed(1) + 'K';
      }
    }, 5000);
  }

  function addNewSignal() {
    const signals = [
      '新兴市场债券收益率变动监测',
      'Claude Code Agent 性能优化报告生成',
      '区块链基础设施投资信号检测',
      '欧洲央行利率决议预期分析',
      '深圳科技园区政策变动追踪',
      'LLM 推理成本下降趋势更新',
      'Web3 基金投资组合调仓提醒',
      '人工智能安全法规进展监测',
      '西班牙马德里房产价格指数更新',
      '量化策略 Alpha 因子回测结果',
    ];

    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const text = signals[Math.floor(Math.random() * signals.length)];

    const feed = document.getElementById('signalFeed');
    if (!feed) return;

    const item = document.createElement('div');
    item.className = 'feed-item';
    item.innerHTML = `
      <span class="feed-time">${time}</span>
      <span class="feed-text">${text}</span>
    `;

    feed.insertBefore(item, feed.firstChild);

    // Keep only last 5 items
    while (feed.children.length > 5) {
      feed.removeChild(feed.lastChild);
    }

    // Update signal count
    state.signals++;
    const signalEl = document.getElementById('statSignals');
    if (signalEl) signalEl.textContent = state.signals.toLocaleString();

    const clipperEl = document.getElementById('clipperCount');
    if (clipperEl) clipperEl.textContent = state.signals;
  }

  function updateMetrics() {
    // Knowledge nodes (slow growth)
    if (Math.random() < 0.3) {
      state.knowledgeNodes += Math.floor(Math.random() * 3);
      updateEl('statKnowledge', state.knowledgeNodes.toLocaleString());
      updateEl('wikiNodes', state.knowledgeNodes.toLocaleString());
    }

    // Outputs
    if (Math.random() < 0.1) {
      state.outputs++;
      updateEl('statOutputs', state.outputs.toLocaleString());
    }

    // Active agents
    const health = agentSystem.getSystemHealth();
    state.activeAgents = health.activeAgents;
    updateEl('statAgents', state.activeAgents);

    // Processing metrics with micro-variations
    updateEl('processedToday', addVariation(1283, 50));
    updateEl('linksCreated', addVariation(456, 20));

    // Wiki links
    const wikiLinksBase = 12847 + Math.floor((Date.now() - state.startTime) / 10000);
    updateEl('wikiLinks', wikiLinksBase.toLocaleString());

    // RAW library
    const rawToday = 56 + Math.floor((Date.now() - state.startTime) / 120000);
    updateEl('rawToday', `+${rawToday}`);
    updateEl('rawTotal', (2847 + rawToday).toLocaleString());

    // Transcription count
    if (Math.random() < 0.2) {
      const transcribeEl = document.getElementById('transcribeCount');
      if (transcribeEl) {
        transcribeEl.textContent = parseInt(transcribeEl.textContent) + 1;
      }
    }
  }

  function addVariation(base, range) {
    return (base + Math.floor(Math.random() * range)).toLocaleString();
  }

  function updateEl(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  // ============================================
  // PIPELINE ANIMATION
  // ============================================
  function startPipelineAnimation() {
    const steps = ['stepIncrement', 'stepLink', 'stepLint'];

    setInterval(() => {
      state.pipelineStep = (state.pipelineStep + 1) % steps.length;

      steps.forEach((stepId, i) => {
        const el = document.getElementById(stepId);
        if (!el) return;

        el.classList.remove('active', 'completed');

        if (i < state.pipelineStep) {
          el.classList.add('completed');
        } else if (i === state.pipelineStep) {
          el.classList.add('active');
        }
      });
    }, 3000);
  }

  // ============================================
  // UPTIME TRACKER
  // ============================================
  function startUptimeTracker() {
    function update() {
      const diff = Date.now() - state.startTime;
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      const uptimeEl = document.getElementById('uptime');
      if (uptimeEl) {
        uptimeEl.textContent = `${hours}h ${minutes}m ${seconds}s`;
      }

      // Last sync
      const syncEl = document.getElementById('lastSync');
      if (syncEl) {
        const syncAge = Math.floor(Math.random() * 30);
        syncEl.textContent = syncAge === 0 ? '刚刚' : `${syncAge}秒前`;
      }
    }

    setInterval(update, 1000);
    update();
  }

  // ============================================
  // HOVER EFFECTS
  // ============================================

  // Panel hover glow effect
  document.querySelectorAll('.glass-panel').forEach(panel => {
    panel.addEventListener('mouseenter', function (e) {
      const rect = this.getBoundingClientRect();
      this.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
      this.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
    });

    panel.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      this.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
      this.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
    });
  });

  // Model card click simulation
  document.querySelectorAll('.model-card').forEach(card => {
    card.addEventListener('click', function () {
      document.querySelectorAll('.model-card').forEach(c => c.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Output card click effect
  document.querySelectorAll('.output-card').forEach(card => {
    card.addEventListener('click', function () {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });

  // ============================================
  // FLOW PARTICLE ANIMATION (CSS-driven)
  // ============================================
  function createFlowParticles() {
    const containers = document.querySelectorAll('.flow-particles');
    containers.forEach(container => {
      // Create floating dots that travel along the flow arrows
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.style.cssText = `
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--accent-cyan);
          box-shadow: 0 0 6px var(--accent-cyan);
          animation: flowDot ${2 + i * 0.5}s ease-in-out infinite;
          animation-delay: ${i * 0.7}s;
        `;
        container.appendChild(dot);
      }
    });

    // Add keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
      @keyframes flowDot {
        0% { top: 0; opacity: 0; }
        20% { opacity: 1; }
        80% { opacity: 1; }
        100% { top: 100%; opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  createFlowParticles();

  // ============================================
  // KEYBOARD SHORTCUTS
  // ============================================
  document.addEventListener('keydown', (e) => {
    // 1-4 to jump to layers
    if (e.key >= '1' && e.key <= '4') {
      const sections = ['ingestion', 'engine', 'realization', 'governance'];
      const target = document.getElementById(sections[parseInt(e.key) - 1]);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }

    // S to toggle STOW
    if (e.key === 's' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
      const sidebar = document.getElementById('stowSidebar');
      if (sidebar) {
        state.stowOpen = !state.stowOpen;
        sidebar.classList.toggle('open', state.stowOpen);
      }
    }
  });

  // ============================================
  // CONSOLE BRANDING
  // ============================================
  console.log(
    '%c STOW Agent V3.0 %c 全栈智能认知与资产转化系统 ',
    'background: linear-gradient(135deg, #00d4ff, #7b2ff7); color: white; padding: 8px 16px; border-radius: 4px 0 0 4px; font-weight: bold; font-size: 14px;',
    'background: #1a2035; color: #94a3c0; padding: 8px 16px; border-radius: 0 4px 4px 0; font-size: 12px;'
  );
  console.log(
    '%c⚡ 快捷键: 1-4 跳转层级 | S 打开 STOW 分析',
    'color: #5a6a8a; font-size: 11px;'
  );

})();
