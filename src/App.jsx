import React, { useEffect, useState } from 'react';

const PRIORITIES = ['高', '中', '低'];
const FILTERS = ['全部', '高', '中', '低'];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('中');
  const [filter, setFilter] = useState('全部');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function fetchTasks(nextFilter = filter) {
    setLoading(true);
    setError('');
    try {
      const q = nextFilter === '全部' ? '' : `?priority=${encodeURIComponent(nextFilter)}`;
      const res = await fetch(`/api/tasks${q}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '加载失败');
      setTasks(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks('全部');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setError('');
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, priority }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '添加失败');
      setTitle('');
      fetchTasks();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleToggle(task) {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '更新失败');
      }
      fetchTasks();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '删除失败');
      }
      fetchTasks();
    } catch (e) {
      setError(e.message);
    }
  }

  function handleFilter(f) {
    setFilter(f);
    fetchTasks(f);
  }

  return (
    <div className="page">
      <div className="card">
        <h1>智能任务管理系统</h1>

        <form className="add-row" onSubmit={handleAdd}>
          <input
            className="title-input"
            placeholder="输入任务标题…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}优先级
              </option>
            ))}
          </select>
          <button type="submit" className="primary">添加</button>
        </form>

        <div className="filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={f === filter ? 'filter active' : 'filter'}
              onClick={() => handleFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {error && <div className="error">⚠️ {error}</div>}
        {loading && <div className="muted">加载中…</div>}

        <ul className="task-list">
          {tasks.length === 0 && !loading && (
            <li className="muted">暂无任务，从上方添加一条吧～</li>
          )}
          {tasks.map((t) => (
            <li key={t.id} className={t.completed ? 'task done' : 'task'}>
              <div className="task-main">
                <span className={`tag p-${t.priority}`}>{t.priority}</span>
                <span className="task-title">{t.title}</span>
              </div>
              <div className="task-actions">
                <button onClick={() => handleToggle(t)}>
                  {t.completed ? '标记未完成' : '标记完成'}
                </button>
                <button className="danger" onClick={() => handleDelete(t.id)}>删除</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
