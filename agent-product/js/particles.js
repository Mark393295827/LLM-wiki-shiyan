/**
 * Animated Particle Background & Knowledge Graph Visualization
 * Creates a floating particle network effect with connecting lines
 */

class ParticleBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.maxParticles = 60;
    this.connectionDistance = 150;
    this.mouse = { x: null, y: null, radius: 200 };
    this.animationId = null;

    this.resize();
    this.init();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 0.5,
        color: this.getRandomColor(),
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  getRandomColor() {
    const colors = [
      '0, 212, 255',    // cyan
      '123, 47, 247',   // purple
      '59, 130, 246',   // blue
      '0, 230, 118',    // green
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((p, i) => {
      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      // Mouse interaction
      if (this.mouse.x !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          p.vx -= (dx / dist) * force * 0.02;
          p.vy -= (dy / dist) * force * 0.02;
        }
      }

      // Limit velocity
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 1) {
        p.vx = (p.vx / speed) * 1;
        p.vy = (p.vy / speed) * 1;
      }

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
      this.ctx.fill();

      // Draw connections
      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.connectionDistance) {
          const opacity = (1 - dist / this.connectionDistance) * 0.15;
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(${p.color}, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}


/**
 * Knowledge Graph Mini Visualization
 */
class KnowledgeGraphViz {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.edges = [];
    this.nodeCount = 25;
    this.animationId = null;

    this.initGraph();
    this.animate();
  }

  initGraph() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const centerX = w / 2;
    const centerY = h / 2;

    // Create nodes in a force-directed-like layout
    const clusters = [
      { cx: centerX - 80, cy: centerY - 30, count: 6, color: '0, 212, 255', label: 'Index' },
      { cx: centerX + 80, cy: centerY - 30, count: 5, color: '123, 47, 247', label: 'MOC' },
      { cx: centerX, cy: centerY + 40, count: 6, color: '59, 130, 246', label: 'Log' },
      { cx: centerX - 60, cy: centerY + 50, count: 4, color: '0, 230, 118', label: 'Schema' },
      { cx: centerX + 60, cy: centerY + 50, count: 4, color: '255, 179, 0', label: 'Raw' },
    ];

    this.nodes = [];
    this.edges = [];

    clusters.forEach((cluster, ci) => {
      // Central node
      const centralIdx = this.nodes.length;
      this.nodes.push({
        x: cluster.cx + (Math.random() - 0.5) * 10,
        y: cluster.cy + (Math.random() - 0.5) * 10,
        vx: 0, vy: 0,
        radius: 4,
        color: cluster.color,
        label: cluster.label,
        isCenter: true,
        opacity: 0.9
      });

      // Satellite nodes
      for (let i = 0; i < cluster.count; i++) {
        const angle = (Math.PI * 2 / cluster.count) * i;
        const dist = 25 + Math.random() * 20;
        const idx = this.nodes.length;
        this.nodes.push({
          x: cluster.cx + Math.cos(angle) * dist + (Math.random() - 0.5) * 10,
          y: cluster.cy + Math.sin(angle) * dist + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          radius: 2 + Math.random() * 1.5,
          color: cluster.color,
          isCenter: false,
          opacity: 0.4 + Math.random() * 0.3
        });

        // Connect to center
        this.edges.push({ from: centralIdx, to: idx, opacity: 0.2 });
      }

      // Cross-cluster connections
      if (ci > 0) {
        const prevCentralIdx = this.nodes.findIndex((n, idx) =>
          n.isCenter && idx < centralIdx
        );
        if (prevCentralIdx >= 0) {
          this.edges.push({ from: centralIdx, to: prevCentralIdx, opacity: 0.1 });
        }
      }
    });

    // Add some random cross-connections
    for (let i = 0; i < 8; i++) {
      const from = Math.floor(Math.random() * this.nodes.length);
      const to = Math.floor(Math.random() * this.nodes.length);
      if (from !== to) {
        this.edges.push({ from, to, opacity: 0.06 });
      }
    }
  }

  animate() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Gentle movement
    this.nodes.forEach(node => {
      if (!node.isCenter) {
        node.x += node.vx;
        node.y += node.vy;

        // Soft bounds
        if (node.x < 10 || node.x > w - 10) node.vx *= -1;
        if (node.y < 10 || node.y > h - 10) node.vy *= -1;

        // Slow down
        node.vx *= 0.998;
        node.vy *= 0.998;

        // Random perturbation
        if (Math.random() < 0.01) {
          node.vx += (Math.random() - 0.5) * 0.1;
          node.vy += (Math.random() - 0.5) * 0.1;
        }
      }
    });

    // Draw edges
    this.edges.forEach(edge => {
      const from = this.nodes[edge.from];
      const to = this.nodes[edge.to];
      if (!from || !to) return;

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = `rgba(255, 255, 255, ${edge.opacity})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });

    // Draw nodes
    this.nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${node.color}, ${node.opacity})`;
      ctx.fill();

      // Glow for center nodes
      if (node.isCenter) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${node.color}, 0.08)`;
        ctx.fill();
      }
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}


/**
 * Flow Canvas Mini Diagram
 */
class FlowDiagram {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.time = 0;
    this.animate();
  }

  animate() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.time += 0.02;

    ctx.clearRect(0, 0, w, h);

    // Draw flow layers
    const layers = [
      { y: 30, label: '摄取', color: '0, 212, 255' },
      { y: 70, label: '编译', color: '123, 47, 247' },
      { y: 120, label: '行动', color: '255, 107, 53' },
      { y: 165, label: '治理', color: '0, 230, 118' },
    ];

    layers.forEach((layer, i) => {
      // Layer line
      ctx.beginPath();
      ctx.moveTo(40, layer.y);
      ctx.lineTo(w - 40, layer.y);
      ctx.strokeStyle = `rgba(${layer.color}, 0.3)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Layer dot
      const dotX = 40 + ((this.time * 30 + i * 80) % (w - 80));
      ctx.beginPath();
      ctx.arc(dotX, layer.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${layer.color}, 0.8)`;
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(dotX, layer.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${layer.color}, 0.15)`;
      ctx.fill();

      // Connection down
      if (i < layers.length - 1) {
        const nextLayer = layers[i + 1];
        ctx.beginPath();
        ctx.moveTo(w / 2, layer.y);
        ctx.lineTo(w / 2, nextLayer.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Label
      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = `rgba(${layer.color}, 0.6)`;
      ctx.textAlign = 'left';
      ctx.fillText(layer.label, 8, layer.y + 4);
    });

    // Feedback loop arrow (right side)
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.moveTo(w - 25, layers[3].y);
    ctx.quadraticCurveTo(w - 10, h / 2, w - 25, layers[0].y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Feedback loop particle
    const loopT = (this.time * 0.3) % 1;
    const loopY = layers[3].y + (layers[0].y - layers[3].y) * loopT;
    const loopX = w - 25 + Math.sin(loopT * Math.PI) * 15;
    ctx.beginPath();
    ctx.arc(loopX, loopY, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 212, 255, 0.6)';
    ctx.fill();

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  window.particleBg = new ParticleBackground('bg-canvas');
  window.knowledgeGraph = new KnowledgeGraphViz('graphCanvas');
  window.flowDiagram = new FlowDiagram('flowCanvas');
});
