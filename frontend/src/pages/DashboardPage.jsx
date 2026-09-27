import { useCallback, useEffect, useState } from 'react';
import {
  completeTask,
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
} from '../api/tasks.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import TaskForm from '../components/TaskForm.jsx';
import TaskList from '../components/TaskList.jsx';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchTasks(filter === 'all' ? undefined : filter);
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleCreate(values) {
    await createTask(values);
    setShowCreate(false);
    await loadTasks();
  }

  async function handleUpdate(values) {
    await updateTask(editing.id, values);
    setEditing(null);
    await loadTasks();
  }

  async function handleComplete(id) {
    setBusyId(id);
    try {
      await completeTask(id);
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not complete task');
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this task?')) return;
    setBusyId(id);
    try {
      await deleteTask(id);
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete task');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="brand compact">TaskFlow</p>
          <p className="muted">Hello, {user?.name}</p>
        </div>
        <button type="button" className="btn ghost" onClick={logout}>
          Log out
        </button>
      </header>

      <main className="dashboard">
        <section className="dashboard-head">
          <div>
            <h1>Your tasks</h1>
            <p className="lede">Create, update, and finish work on your schedule.</p>
          </div>
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              setEditing(null);
              setShowCreate((open) => !open);
            }}
          >
            {showCreate ? 'Close' : 'New task'}
          </button>
        </section>

        {(showCreate || editing) && (
          <section className="panel">
            <h2>{editing ? 'Edit task' : 'Add a task'}</h2>
            <TaskForm
              key={editing?.id || 'create'}
              initialValues={
                editing
                  ? {
                      title: editing.title,
                      description: editing.description || '',
                      status: editing.status,
                      dueDate: editing.dueDate,
                    }
                  : undefined
              }
              submitLabel={editing ? 'Update task' : 'Add task'}
              onCancel={() => {
                setShowCreate(false);
                setEditing(null);
              }}
              onSubmit={editing ? handleUpdate : handleCreate}
            />
          </section>
        )}

        <div className="filters" role="tablist" aria-label="Task filters">
          {FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={filter === item.value}
              className={`filter-chip ${filter === item.value ? 'active' : ''}`}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {error ? <p className="form-error">{error}</p> : null}

        {loading ? (
          <p className="muted">Loading tasks…</p>
        ) : (
          <TaskList
            tasks={tasks}
            busyId={busyId}
            onEdit={(task) => {
              setShowCreate(false);
              setEditing(task);
            }}
            onComplete={handleComplete}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
}
