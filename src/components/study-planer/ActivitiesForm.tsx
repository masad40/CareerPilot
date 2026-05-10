"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { useAuth } from "@/context/AuthContext"

interface Activity {
  _id?: string
  title?: string
  description?: string
  status?: string
  start?: string
  end?: string
}

interface EventFormPageProps {
  onActivityCreated?: () => void
  editData?: Activity | null
}

const inputClass =
  "w-full pl-11 pr-4 py-3 bg-body-bg border border-card-border focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-xl text-sm text-foreground placeholder:text-muted outline-none transition-all"

const labelClass = "text-xs font-bold text-muted uppercase tracking-wider"

export default function EventFormPage({ onActivityCreated, editData }: EventFormPageProps) {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const isEdit = !!editData?._id

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      if (isEdit) {
        const { data } = await axios.patch("/api/activities", { _id: editData!._id, ...payload })
        return data
      }
      const { data } = await axios.post("/api/activities", payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] })
      onActivityCreated?.()
      ;(document.getElementById("my_modal_5") as HTMLDialogElement)?.close()
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    mutation.mutate({
      title: fd.get("title"),
      description: fd.get("description"),
      status: fd.get("status"),
      start: new Date(fd.get("start") as string).toISOString(),
      end: new Date(fd.get("end") as string).toISOString(),
      timezone,
      userId: user?.uid ?? null,
    })
    if (!isEdit) e.currentTarget.reset()
  }

  const toLocalInput = (iso?: string) => {
    if (!iso) return ""
    const d = new Date(iso)
    const pad = (n: number) => String(n).padStart(2, "0")
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">
          {isEdit ? "Edit Activity" : "Create New Event"}
        </h2>
        <p className="text-muted text-sm">
          {isEdit ? "Update your activity details below." : "Organize your next milestone or task."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div className="space-y-1.5">
          <label className={labelClass}>Event Title</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xl">title</span>
            <input name="title" type="text" defaultValue={editData?.title ?? ""} placeholder="e.g. Q4 Strategy Sync" className={inputClass} required />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={labelClass}>Start Date</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xl">calendar_today</span>
              <input name="start" type="datetime-local" defaultValue={toLocalInput(editData?.start)} className={inputClass} required />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>End Date</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xl">event_busy</span>
              <input name="end" type="datetime-local" defaultValue={toLocalInput(editData?.end)} className={inputClass} required />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label className={labelClass}>Select Status</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted text-xl">flag</span>
            <select name="status" defaultValue={editData?.status ?? ""} className={inputClass} required>
              <option value="" disabled className="bg-background">Select status</option>
              <option value="todo" className="bg-background">To Do</option>
              <option value="process" className="bg-background">In Progress</option>
              <option value="done" className="bg-background">Done</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            rows={4}
            defaultValue={editData?.description ?? ""}
            placeholder="What is this event about? Describe the goals..."
            className="w-full p-4 bg-body-bg border border-card-border focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-xl text-sm text-foreground placeholder:text-muted outline-none transition-all resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            {mutation.isPending ? "Saving..." : isEdit ? "Save Changes" : "Create Event"}
          </button>
          <button
            type="button"
            onClick={() => (document.getElementById("my_modal_5") as HTMLDialogElement)?.close()}
            className="flex-1 bg-body-bg hover:bg-card-bg border border-card-border text-foreground/70 font-bold py-3.5 rounded-xl transition-all"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Footer info */}
      <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl p-4">
        <span className="material-symbols-outlined text-primary text-xl shrink-0">info</span>
        <p className="text-[11px] leading-relaxed text-muted">
          This activity will be synced across your calendar and activity board automatically.
        </p>
      </div>
    </div>
  )
}
