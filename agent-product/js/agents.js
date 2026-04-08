/**
 * Agent Management System
 * Simulates agent status, task queues, and coordination
 */

class AgentSystem {
  constructor() {
    this.agents = {
      initializer: {
        name: 'Initializer',
        role: '系统初始化',
        status: 'active',
        taskQueue: [],
        completedTasks: 47,
        currentTask: '初始化知识图谱索引',
        progress: 78,
        lastActive: Date.now()
      },
      coding: {
        name: 'Coding Agent',
        role: '代码生成',
        status: 'active',
        taskQueue: ['实现投资模型 API', '重构数据管线'],
        completedTasks: 234,
        currentTask: '西班牙房产分析模型 v2.1',
        progress: 65,
        lastActive: Date.now()
      },
      operator: {
        name: 'Operator',
        role: '运维操作',
        status: 'idle',
        taskQueue: ['备份知识库', '清理过期缓存'],
        completedTasks: 89,
        currentTask: null,
        progress: 0,
        lastActive: Date.now() - 300000
      }
    };

    this.securityStatus = {
      grade: 'A+',
      testsPass: 1282,
      rulesChecked: 102,
      threats: 0,
      lastScan: Date.now() - 120000,
      hookAuditActive: true
    };

    this.gitMetrics = {
      branches: 7,
      commits: 1171,
      contributors: 3,
      recentCommits: [
        { hash: 'a3f7b2c', msg: 'feat: 西班牙房产分析模型 v2.1', time: '2 分钟前', type: 'feat' },
        { hash: 'e9d4f1a', msg: 'refactor: 知识图谱关联算法优化', time: '15 分钟前', type: 'refactor' },
        { hash: 'b2c8e3d', msg: 'docs: MOC 地图更新 - AI Agent 领域', time: '1 小时前', type: 'docs' },
        { hash: 'f1a5c7b', msg: 'fix: 信号采集器 SHA-256 校验修复', time: '3 小时前', type: 'fix' },
      ]
    };

    this.startSimulation();
  }

  startSimulation() {
    // Simulate agent activity
    setInterval(() => {
      this.simulateAgentActivity();
    }, 5000);

    // Simulate progress updates
    setInterval(() => {
      this.updateProgress();
    }, 2000);
  }

  simulateAgentActivity() {
    const agents = Object.values(this.agents);
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];

    if (randomAgent.status === 'active') {
      randomAgent.progress = Math.min(100, randomAgent.progress + Math.random() * 5);

      if (randomAgent.progress >= 100) {
        randomAgent.completedTasks++;
        randomAgent.progress = 0;

        if (randomAgent.taskQueue.length > 0) {
          randomAgent.currentTask = randomAgent.taskQueue.shift();
        } else {
          randomAgent.status = 'idle';
          randomAgent.currentTask = null;
        }
      }
    } else if (randomAgent.status === 'idle' && Math.random() < 0.3) {
      // Wake up idle agent
      const tasks = [
        '分析新采集信号',
        '生成周报摘要',
        '更新知识关联',
        '运行安全扫描',
        '优化查询性能',
        '同步外部数据源',
      ];
      randomAgent.currentTask = tasks[Math.floor(Math.random() * tasks.length)];
      randomAgent.status = 'active';
      randomAgent.progress = Math.random() * 20;
    }

    randomAgent.lastActive = Date.now();
  }

  updateProgress() {
    Object.entries(this.agents).forEach(([key, agent]) => {
      const el = document.getElementById(`agent${key.charAt(0).toUpperCase() + key.slice(1)}`);
      if (!el) return;

      const statusEl = el.querySelector('.agent-status-indicator');
      if (statusEl) {
        if (agent.status === 'active') {
          statusEl.className = 'agent-status-indicator active';
          statusEl.querySelector('span').textContent = agent.currentTask
            ? `${Math.round(agent.progress)}%`
            : '运行中';
        } else {
          statusEl.className = 'agent-status-indicator idle';
          statusEl.querySelector('span').textContent = '待命';
        }
      }
    });
  }

  getSystemHealth() {
    const activeAgents = Object.values(this.agents).filter(a => a.status === 'active').length;
    const totalTasks = Object.values(this.agents).reduce((sum, a) => sum + a.completedTasks, 0);

    return {
      activeAgents,
      totalAgents: Object.keys(this.agents).length,
      totalTasks,
      securityGrade: this.securityStatus.grade,
      uptime: this.calculateUptime()
    };
  }

  calculateUptime() {
    // Simulated uptime
    const now = Date.now();
    const start = now - 3600000 * 4; // 4 hours ago
    const diff = now - start;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  }
}

// Export for use in app.js
window.AgentSystem = AgentSystem;
