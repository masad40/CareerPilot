import { Pencil } from "lucide-react"

export interface Task {
  _id?: string
  title: string
  description?: string
  status?: string
  tag?: string
  start?: string
  end?: string
}

const STATUS_HEX: Record<string, string> = {
  todo:    "#ED8936",
  process: "#38BDF8",
  done:    "#22C55E",
}

function getHex(key?: string) {
  return STATUS_HEX[key?.toLowerCase() ?? ""] ?? "#ED8936"
}

export default function TaskCard({
  task,
  onEdit,
  onMarkDone,
}: {
  task: Task
  onEdit?: (task: Task) => void
  onMarkDone?: (task: Task) => void
}) {
  const isDone = task.status === "done"
  const statusKey = task.status ?? "todo"
  const hex = getHex(statusKey)
  const tagKey = task.tag ?? task.status

  const handleCheck = () => {
    if (!isDone && onMarkDone) onMarkDone(task)
  }

  return (
    <article
      className="group bg-card-bg hover:bg-card-bg/80 border border-card-border rounded-xl p-4 flex flex-col gap-3 transition-all duration-300"
      style={{ borderColor: `${hex}22` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={handleCheck}
            disabled={isDone}
            aria-label={isDone ? "Task completed" : "Mark as done"}
            className="mt-0.5 w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors disabled:cursor-default"
            style={isDone
              ? { backgroundColor: hex, borderColor: hex }
              : { borderColor: `${hex}60`, backgroundColor: "transparent", cursor: "pointer" }
            }
          >
            {isDone && (
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <h2 className={`text-sm font-medium leading-snug ${isDone ? "line-through text-muted" : "text-foreground"}`}>
            {task.title}
          </h2>
        </div>

        {onEdit && (
          <button
            onClick={() => onEdit(task)}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-card-bg transition-all shrink-0"
            style={{ color: hex }}
          >
            <Pencil size={13} />
          </button>
        )}
      </div>

      {task.description && (
        <p className="text-muted text-xs pl-7 leading-relaxed">{task.description}</p>
      )}

      <div className="pl-7">
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border"
          style={{ color: getHex(tagKey), borderColor: `${getHex(tagKey)}40`, backgroundColor: `${getHex(tagKey)}15` }}
        >
          {tagKey}
        </span>
      </div>
    </article>
  )
}
