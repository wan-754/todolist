import { useState } from 'react'

type Task = {
  id: number
  title: string
  status: 'todo' | 'doing' | 'done'
}

type ColumnType = 'todo' | 'doing' | 'done'
const columnConfig: Record<ColumnType, { title: string; emoji:string; color: string }> = {
  todo: { title: 'To Do', emoji: '📝', color: 'border-blue-500' },
  doing: { title: 'Doing', emoji: '🔄', color: 'border-yellow-500' },
  done: { title: 'Done', emoji: '✅', color: 'border-green-500' }
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [inputValue, setInputValue] = useState('')

  const addTask = () => {
    const title = inputValue.trim()
    if (title === '') return

    const newTask: Task = {
      id: Date.now(),
      title,
      status: 'todo'
    }

    setTasks(prev => [...prev, newTask])
    setInputValue('')
  }

  const moveTask = (taskId: number, newStatus: ColumnType) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ))
  }

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const getTasksByStatus = (status: ColumnType) => {
    return tasks.filter(task => task.status === status)
  }

  const columns: ColumnType[] = ['todo', 'doing', 'done']

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_20%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_25%),#020617] py-10 px-4 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Todo List</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Kelola tugas harian dengan UI yang lebih rapi, status visual, dan interaksi yang lebih nyaman.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/85 p-5 shadow-xl shadow-cyan-500/10">
              <p className="text-sm text-slate-400">Total tugas aktif</p>
              <p className="mt-2 text-3xl font-semibold text-white">{tasks.length}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-blue-200">📝 {getTasksByStatus('todo').length} todo</span>
                <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-yellow-200">🔄 {getTasksByStatus('doing').length} doing</span>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-200">✅ {getTasksByStatus('done').length} done</span>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-[1.5fr_auto]">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/20 backdrop-blur-sm">
              <label className="text-sm text-slate-400">Tambahkan tugas baru</label>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTask()}
                  placeholder="Misal: Kerjakan desain dashboard"
                  className="flex-1 rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
                <button
                  onClick={addTask}
                  className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400"
                >
                  + Tambah tugas
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-lg shadow-slate-950/20 backdrop-blur-sm">
              <p className="text-sm text-slate-400">Ringkasan status</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-950/80 p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Todo</p>
                  <p className="mt-3 text-2xl font-semibold text-blue-300">{getTasksByStatus('todo').length}</p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Doing</p>
                  <p className="mt-3 text-2xl font-semibold text-yellow-300">{getTasksByStatus('doing').length}</p>
                </div>
                <div className="rounded-3xl bg-slate-950/80 p-4 text-center">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Done</p>
                  <p className="mt-3 text-2xl font-semibold text-emerald-300">{getTasksByStatus('done').length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {columns.map(status => {
              const config = columnConfig[status]
              const columnTasks = getTasksByStatus(status)

              return (
                <div
                  key={status}
                  className={`rounded-[28px] border border-white/10 border-t-4 bg-slate-950/80 p-5 shadow-xl shadow-cyan-500/5 transition duration-300 hover:-translate-y-1 ${config.color}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">{config.emoji} {config.title}</h2>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">{columnTasks.length}</span>
                  </div>

                  <div className="space-y-3 min-h-[120px]">
                    {columnTasks.length === 0 ? (
                      <p className="rounded-3xl bg-white/5 px-4 py-8 text-center text-sm text-slate-500">Belum ada tugas di sini.</p>
                    ) : (
                      columnTasks.map(task => (
                        <div
                          key={task.id}
                          className="group rounded-3xl border border-white/5 bg-slate-900/80 p-4 shadow-sm shadow-slate-950/10 transition duration-200 hover:border-cyan-400"
                        >
                          <div className="flex items-start gap-3">
                            <div className="min-w-[48px] rounded-2xl bg-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                              {status}
                            </div>
                            <p className="flex-1 text-sm leading-6 text-slate-100">{task.title}</p>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-2 opacity-80 transition duration-200 group-hover:opacity-100">
                            {status !== 'todo' && (
                              <button
                                onClick={() => moveTask(task.id, status === 'doing' ? 'todo' : 'doing')}
                                className="rounded-full bg-slate-800/90 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200 transition hover:bg-slate-700"
                              >
                                🔄 Back
                              </button>
                            )}
                            {status !== 'done' && (
                              <button
                                onClick={() => moveTask(task.id, status === 'todo' ? 'doing' : 'done')}
                                className="rounded-full bg-cyan-500 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-cyan-400"
                              >
                                ✅ Next
                              </button>
                            )}
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="ml-auto rounded-full bg-red-600/90 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-red-500"
                            >
                              🗑️ Hapus
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
