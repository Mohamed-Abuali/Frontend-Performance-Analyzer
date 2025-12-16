/**
 * A medium-length TypeScript module that demonstrates
 * a small event-driven task queue with async retries.
 */

type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';

interface Task<T = unknown> {
  id: string;
  payload: T;
  status: TaskStatus;
  retries: number;
  maxRetries: number;
  createdAt: Date;
  startedAt?: Date;
  finishedAt?: Date;
}

type TaskHandler<T> = (payload: T) => Promise<void>;

class TaskQueue<T = unknown> {
  private tasks: Map<string, Task<T>> = new Map();
  private handlers: Map<string, TaskHandler<T>> = new Map();
  private concurrency = 3;
  private running = 0;

  registerHandler(type: string, handler: TaskHandler<T>): void {
    this.handlers.set(type, handler);
  }

  enqueue(type: string, payload: T, maxRetries = 2): string {
    const id = `task-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const task: Task<T> = {
      id,
      payload,
      status: 'pending',
      retries: 0,
      maxRetries,
      createdAt: new Date(),
    };
    this.tasks.set(id, task);
    setImmediate(() => this.pump());
    return id;
  }

  private async pump(): Promise<void> {
    if (this.running >= this.concurrency) return;
    const next = Array.from(this.tasks.values()).find(
      (t) => t.status === 'pending'
    );
    if (!next) retur

    this.running++;
    next.status = 'running';
    next.startedAt = new Date();

    const handler = this.handlers.get('default');
    if (!handler) {
      next.status = 'failed';
      this.running--;
      return;
    }

    try {
      await handler(next.payload);
      next.status = 'completed';
      next.finishedAt = new Date();
    } catch (err) {
      next.retries++;
      if (next.retries < next.maxRetries) {
        next.status = 'pending';
        next.startedAt = undefined;
      } else {
        next.status = 'failed';
        next.finishedAt = new Date();
      }
    } finally {
      this.running--;
      setImmediate(() => this.pump());
    }
  }

  summary(): Record<TaskStatus, number> {
    const counts: Record<TaskStatus, number> = {
      pending: 0,
      running: 0,
      completed: 0,
      failed: 0,
    };
    for (const t of this.tasks.values()) counts[t.status]++;
    return counts;
  }
}

/* Example usage */
const queue = new TaskQueue<{ url: string }>();

queue.registerHandler('default', async ({ url }) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  console.log(`Fetched ${url} – ${res.status}`);
});

['https://jsonplaceholder.typicode.com/todos/1',
 'https://jsonplaceholder.typicode.com/todos/2',
 'https://jsonplaceholder.typicode.com/todos/3'].forEach((url) =>
  queue.enqueue('fetch', { url })
);

setInterval(() => console.table(queue.summary()), 1000);
