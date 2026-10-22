const express = require('express');
const cors = require('cors');
const { listTasks, addTask, setTaskCompleted, removeTask } = require('../lib/tasks');

const app = express();
app.use(cors());
app.use(express.json());

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// 任务列表：GET /api/tasks?priority=全部|高|中|低
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await listTasks(req.query.priority);
    res.json(tasks);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 添加任务：POST /api/tasks  { title, priority }
app.post('/api/tasks', async (req, res) => {
  try {
    const task = await addTask(req.body.title, req.body.priority);
    res.status(201).json(task);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// 切换完成状态：PATCH /api/tasks/:id  { completed }
app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const task = await setTaskCompleted(Number(req.params.id), req.body.completed);
    res.json(task);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// 删除任务：DELETE /api/tasks/:id
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await removeTask(Number(req.params.id));
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = app;
