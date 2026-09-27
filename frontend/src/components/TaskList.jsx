function formatStatus(status) {
  return status.replace('_', ' ');
}

function isOverdue(task) {
  if (task.status === 'completed') return false;
  const today = new Date().toISOString().slice(0, 10);
  return task.dueDate < today;
}

export default function TaskList({
  tasks,
  onEdit,
  onComplete,
  onDelete,
  busyId,
}) {
  if (!tasks.length) {
    return (
      <div className="empty-state">
        <h2>No tasks yet</h2>
        <p>Add your first task to start organizing the day.</p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id} className={`task-row status-${task.status}`}>
          <div className="task-main">
            <div className="task-heading">
              <h3>{task.title}</h3>
              <span className={`status-pill ${task.status}`}>
                {formatStatus(task.status)}
              </span>
            </div>
            {task.description ? (
              <p className="task-description">{task.description}</p>
            ) : null}
            <p className={`due ${isOverdue(task) ? 'overdue' : ''}`}>
              Due {task.dueDate}
              {isOverdue(task) ? ' · overdue' : ''}
            </p>
          </div>
          <div className="task-actions">
            {task.status !== 'completed' ? (
              <button
                type="button"
                className="btn ghost"
                disabled={busyId === task.id}
                onClick={() => onComplete(task.id)}
              >
                Complete
              </button>
            ) : null}
            <button
              type="button"
              className="btn ghost"
              disabled={busyId === task.id}
              onClick={() => onEdit(task)}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn danger"
              disabled={busyId === task.id}
              onClick={() => onDelete(task.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
