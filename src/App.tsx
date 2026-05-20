import { useEffect, useState } from 'react'

type Priority = 'Low' | 'Medium' | 'High'
type ColumnType = 'todo' | 'doing' | 'done'
type Task = {
  id: number
  title: string
  description: string
  status: ColumnType
  priority: Priority
  category: string
  deadline: string
}

const columnConfig: Record<ColumnType, { title: string; emoji:string; color: string }> = {
  todo: { title: 'To Do', emoji: '📝', color: 'border-blue-500' },
  doing: { title: 'Doing', emoji: '🔄', color: 'border-yellow-500' },
  done: { title: 'Done', emoji: '✅', color: 'border-green-500' }
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem('todo-tasks')
      return saved
        ? (JSON.parse(saved) as Task[]).map(task => ({
            ...task,
            category: task.category ?? 'No kategori'
          }))
        : []
    } catch {
      return []
    }
  })
  const [categories, setCategories] = useState<string[]>(() => {
    if (typeof window === 'undefined') return ['No kategori']
    try {
      const saved = localStorage.getItem('todo-categories')
      return saved ? JSON.parse(saved) as string[] : ['No kategori']
    } catch {
      return ['No kategori']
    }
  })
  const [category, setCategory] = useState('No kategori')
  const [newCategory, setNewCategory] = useState('')
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark'
    return localStorage.getItem('todo-theme') === 'light' ? 'light' : 'dark'
  })
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('Medium')
  const [deadline, setDeadline] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem('todo-tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem('todo-theme', theme)
  }, [theme])

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem('todo-categories', JSON.stringify(categories))
  }, [categories])

  const clearForm = () => {
    setTitle('')
    setDescription('')
    setPriority('Medium')
    setCategory('No kategori')
    setDeadline('')
    setEditingTaskId(null)
  }

  const addOrUpdateTask = () => {
    const trimmedTitle = title.trim()
    if (trimmedTitle === '') return

    if (editingTaskId !== null) {
      setTasks(tasks.map(task =>
        task.id === editingTaskId
          ? { ...task, title: trimmedTitle, description, priority, category, deadline }
          : task
      ))
    } else {
      const newTask: Task = {
        id: Date.now(),
        title: trimmedTitle,
        description,
        status: 'todo',
        priority,
        category,
        deadline
      }
      setTasks(prev => [...prev, newTask])
    }

    clearForm()
  }

  const moveTask = (taskId: number, newStatus: ColumnType) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ))
  }

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId))
    if (editingTaskId === taskId) clearForm()
  }

  const editTask = (task: Task) => {
    if (task.status !== 'todo') return
    setEditingTaskId(task.id)
    setTitle(task.title)
    setDescription(task.description)
    setPriority(task.priority)
    setCategory(task.category)
    setDeadline(task.deadline)
  }

  const openTaskModal = (task: Task) => {
    setSelectedTask(task)
  }

  const closeTaskModal = () => {
    setSelectedTask(null)
  }

  const getTasksByStatus = (status: ColumnType) => {
    return tasks.filter(task => task.status === status)
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const themeClasses = theme === 'dark'
    ? 'min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_20%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_25%),#020617] text-white'
    : 'min-h-screen bg-slate-100 text-slate-900'

  const inputBg = theme === 'dark' ? 'bg-slate-950/90 border-white/10 text-white placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-500'
  const sectionBg = theme === 'dark' ? 'bg-slate-900/80 border-white/10' : 'bg-white border-slate-200'

  const columns: ColumnType[] = ['todo', 'doing', 'done']
  const completedTasks = getTasksByStatus('done').length
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className={`${themeClasses} py-10 px-4`}>
      <div className="mx-auto max-w-6xl">
        <div className={`overflow-hidden rounded-[32px] border ${theme === 'dark' ? 'border-white/10 bg-slate-950/80' : 'border-slate-200 bg-slate-50'} p-8 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl`}>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Todo List</h1>
              <p className={`mt-3 max-w-2xl text-sm leading-7 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                Kelola tugas harian dengan judul, deskripsi, prioritas, dan deadline.
              </p>
            </div>

            <div className={`rounded-3xl border p-5 shadow-xl shadow-cyan-500/10 ${sectionBg}`}>
              <button
                onClick={toggleTheme}
                className="rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                {theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-[1.5fr_auto]">
            <div className={`rounded-3xl border p-6 shadow-lg shadow-slate-950/20 backdrop-blur-sm ${sectionBg}`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-400">Form tugas</p>
                  <h2 className="mt-2 text-2xl font-semibold">{editingTaskId ? 'Perbarui tugas' : 'Tambahkan tugas baru'}</h2>
                </div>
                {editingTaskId !== null && (
                  <button
                    onClick={clearForm}
                    className="rounded-2xl border border-slate-700 px-4 py-2 text-sm transition hover:bg-slate-800/80"
                  >
                    Batal
                  </button>
                )}
              </div>

              <div className="mt-6 grid gap-4">
                <div>
                  <label className="text-sm font-medium">Judul</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Masukkan judul tugas"
                    className={`mt-2 w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${inputBg} ${theme === 'dark' ? 'focus:ring-cyan-400/30' : 'focus:ring-slate-300'}`}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Deskripsi</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tambahkan detail tugas"
                    rows={3}
                    className={`mt-2 w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 ${inputBg} ${theme === 'dark' ? 'focus:ring-cyan-400/30' : 'focus:ring-slate-300'}`}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium">Prioritas</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as Priority)}
                      className={`mt-2 w-full rounded-2xl border px-4 py-3 outline-none transition ${inputBg}`}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Kategori</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`mt-2 w-full rounded-2xl border px-4 py-3 outline-none transition ${inputBg}`}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Deadline</label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className={`mt-2 w-full rounded-2xl border px-4 py-3 outline-none transition ${inputBg}`}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Tambah kategori baru</label>
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Nama kategori"
                        className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${inputBg}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const trimmedCategory = newCategory.trim()
                          if (!trimmedCategory) return
                          if (!categories.includes(trimmedCategory)) {
                            setCategories(prev => [...prev, trimmedCategory])
                          }
                          setCategory(trimmedCategory)
                          setNewCategory('')
                        }}
                        className="rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                      >
                        Tambah
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={addOrUpdateTask}
                  className="w-full rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  {editingTaskId ? 'Simpan perubahan' : '+ Tambah tugas'}
                </button>
              </div>
            </div>

            <div className={`rounded-3xl border p-6 shadow-lg shadow-slate-950/20 ${sectionBg}`}>
              <p className="text-sm text-slate-400">Ringkasan status</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className={`rounded-3xl p-4 ${theme === 'dark' ? 'bg-slate-950/80' : 'bg-slate-100'}`}>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Todo</p>
                  <p className="mt-3 text-2xl font-semibold text-blue-500">{getTasksByStatus('todo').length}</p>
                </div>
                <div className={`rounded-3xl p-4 ${theme === 'dark' ? 'bg-slate-950/80' : 'bg-slate-100'}`}>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Doing</p>
                  <p className="mt-3 text-2xl font-semibold text-yellow-500">{getTasksByStatus('doing').length}</p>
                </div>
                <div className={`rounded-3xl p-4 ${theme === 'dark' ? 'bg-slate-950/80' : 'bg-slate-100'}`}>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Done</p>
                  <p className="mt-3 text-2xl font-semibold text-emerald-500">{getTasksByStatus('done').length}</p>
                </div>
                <div className={`rounded-3xl p-4 ${theme === 'dark' ? 'bg-slate-950/80' : 'bg-slate-100'}`}>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Persentase</p>
                  <p className="mt-3 text-2xl font-semibold text-cyan-500">{completionRate}%</p>
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
                  className={`rounded-[28px] border p-5 shadow-xl transition duration-300 hover:-translate-y-1 ${theme === 'dark' ? 'border-white/10 bg-slate-950/80 shadow-cyan-500/5' : 'border-slate-200 bg-white shadow-slate-200'}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">{config.emoji} {config.title}</h2>
                    <span className={`rounded-full px-3 py-1 text-xs ${status === 'todo' ? 'bg-blue-100 text-blue-700' : status === 'doing' ? 'bg-yellow-100 text-yellow-700' : 'bg-emerald-100 text-emerald-700'}`}>{columnTasks.length}</span>
                  </div>

                  <div className="space-y-3 min-h-[120px]">
                    {columnTasks.length === 0 ? (
                      <p className="rounded-3xl px-4 py-8 text-center text-sm text-slate-500">Belum ada tugas di sini.</p>
                    ) : (
                      columnTasks.map(task => (
                        <div
                          key={task.id}
                          className={`${theme === 'dark' ? 'bg-slate-900/80 border-white/5' : 'bg-slate-50 border-slate-200'} group rounded-3xl border p-4 shadow-sm transition duration-200 hover:border-cyan-400`}
                        >
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-slate-800/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">{task.category}</span>
                              <span className="rounded-full bg-slate-800/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">{task.priority}</span>
                              <span className="rounded-full bg-slate-800/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200">
                                {task.deadline ? new Date(task.deadline).toLocaleDateString('id-ID') : 'Tanpa deadline'}
                              </span>
                            </div>

                            <div>
                              <p className="text-sm font-semibold">{task.title}</p>
                              
                              <p className="mt-2 text-sm leading-6 text-slate-400">
                                {task.description
                                  ? task.description.length > 50
                                    ? `${task.description.slice(0, 50)}...`
                                    : task.description
                                  : 'Tidak ada deskripsi tambahan.'}
                              </p>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2 opacity-80 transition duration-200 group-hover:opacity-100">
                              <button
                                onClick={() => openTaskModal(task)}
                                className="rounded-full bg-slate-700/90 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200 transition hover:bg-slate-600"
                              >
                                🔍 Detail
                              </button>
                              {task.status === 'todo' && (
                                <button
                                  onClick={() => editTask(task)}
                                  className="rounded-full bg-slate-800/90 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200 transition hover:bg-slate-700"
                                >
                                  ✏️ Edit
                                </button>
                              )}
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
                                  {status === 'todo' ? 'Kerjakan' : 'Selesai'}
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

      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-8">
          <div className={`w-full max-w-2xl rounded-3xl border p-6 shadow-2xl ${theme === 'dark' ? 'bg-slate-950 border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-cyan-400 uppercase tracking-[0.3em]">Overview tugas</p>
                <h2 className={`mt-3 text-3xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {selectedTask.title}
                </h2>
                <p className={`mt-3 text-sm leading-6 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  {selectedTask.description || 'Tidak ada deskripsi tambahan.'}
                </p>
              </div>
              <button
                onClick={closeTaskModal}
                className="rounded-full bg-slate-800 px-3 py-2 text-sm text-white transition hover:bg-slate-700"
              >
                Tutup
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className={`rounded-3xl p-4 ${theme === 'dark' ? 'bg-slate-900/80' : 'bg-slate-100'}`}>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Kategori</p>
                <p className="mt-2 text-lg font-semibold">{selectedTask.category}</p>
              </div>
              <div className={`rounded-3xl p-4 ${theme === 'dark' ? 'bg-slate-900/80' : 'bg-slate-100'}`}>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Status</p>
                <p className="mt-2 text-lg font-semibold">{selectedTask.status}</p>
              </div>
              <div className={`rounded-3xl p-4 ${theme === 'dark' ? 'bg-slate-900/80' : 'bg-slate-100'}`}>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Prioritas</p>
                <p className="mt-2 text-lg font-semibold">{selectedTask.priority}</p>
              </div>
              <div className={`rounded-3xl p-4 ${theme === 'dark' ? 'bg-slate-900/80' : 'bg-slate-100'}`}>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Deadline</p>
                <p className="mt-2 text-lg font-semibold">{selectedTask.deadline ? new Date(selectedTask.deadline).toLocaleDateString('id-ID') : 'Tanpa deadline'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
