import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TaskList from '../components/TaskList.jsx';

describe('TaskList', () => {
  it('shows empty state when there are no tasks', () => {
    render(
      <TaskList
        tasks={[]}
        onEdit={() => {}}
        onComplete={() => {}}
        onDelete={() => {}}
      />,
    );

    expect(screen.getByText('No tasks yet')).toBeInTheDocument();
  });

  it('renders task titles and actions', () => {
    render(
      <TaskList
        tasks={[
          {
            id: '1',
            title: 'Ship assignment',
            description: 'Finish CRUD',
            status: 'pending',
            dueDate: '2099-01-01',
          },
        ]}
        onEdit={() => {}}
        onComplete={() => {}}
        onDelete={() => {}}
      />,
    );

    expect(screen.getByText('Ship assignment')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Complete' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });
});
