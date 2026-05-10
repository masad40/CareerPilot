"use client"
import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { motion } from "framer-motion"
import TaskCard from "../reuseable/TaskCard"
import EventFormPage from "./ActivitiesForm"
import { useAuth } from "@/context/AuthContext"
import DashboardPageWrapper from "@/components/reuseable/DashboardPageWrapper"

interface Activity {
  _id: string
  title: string
  description?: string
  tag?: string
  status: "todo" | "process" | "done"
  start: string
  end: string
}

// Brand colors: primary #ED8936, accent #38BDF8
const columns = [
  {
    key: "todo",
    label: "To Do",
    hex: "#ED8936",
  },
  {
    key: "process",
    label: "In Progress",
    hex: "#38BDF8",
  },
  {
    key: "done",
    label: "Done",
    hex: "#22C55E",
  },
]

export default function Activities() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [editData, setEditData] = useState<Activity | null>(null)

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["activities", user?.uid],
    queryFn: async () => {
      const url = user ? `/api/activities?userId=${user.uid}` : "/api/activities"
      const { data } = await axios.get(url)
      return data
    },
    refetchInterval: 5000,
  })

  const openCreate = () => {
    setEditData(null)
    ;(document.getElementById("my_modal_5") as HTMLDialogElement)?.showModal()
  }

  const openEdit = (task: Activity) => {
    setEditData(task)
    ;(document.getElementById("my_modal_5") as HTMLDialogElement)?.showModal()
  }

  const handleDone = () => {
    queryClient.invalidateQueries({ queryKey: ["activities"] })
  }

  const markDone = async (task: Activity) => {
    await axios.patch("/api/activities", { _id: task._id, status: "done" })
    queryClient.invalidateQueries({ queryKey: ["activities"] })
  }
  const grouped = {
    todo:    tasks.filter((t: Activity) => t.status === "todo"),
    process: tasks.filter((t: Activity) => t.status === "process"),
    done:    tasks.filter((t: Activity) => t.status === "done"),
  }

  if (isLoading) {
    return (
      <main className="min-h-screen flex justify-center items-center bg-background">
        <div className="text-muted text-sm">Loading activities...</div>
      </main>
    )
  }

  return (
    <DashboardPageWrapper>
      <div className="py-6 px-2">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {columns.map(({ key, label, hex }, i) => {
            const colTasks = grouped[key as keyof typeof grouped]
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex flex-col gap-3 bg-card-bg backdrop-blur-md border border-card-border rounded-2xl p-4 min-h-[500px] transition-colors duration-300"
                style={{ borderColor: `${hex}22` }}
              >
                <header className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-foreground font-semibold text-sm">{label}</h2>
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full border"
                      style={{ color: hex, backgroundColor: `${hex}18`, borderColor: `${hex}33` }}
                    >
                      {colTasks.length}
                    </span>
                  </div>
                  <button className="text-muted hover:text-foreground transition-colors text-lg tracking-widest leading-none">···</button>
                </header>

                <div className="flex flex-col gap-3 flex-1">
                  {colTasks.map((task: Activity) => (
                    <TaskCard key={task._id} task={task} onEdit={() => openEdit(task)} onMarkDone={(t) => markDone(t as Activity)} />
                  ))}
                </div>

                <button
                  onClick={openCreate}
                  className="mt-2 w-full border border-dashed border-card-border hover:border-primary/40 text-muted hover:text-foreground text-sm py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1"
                >
                  + Create
                </button>
              </motion.div>
            )
          })}
        </div>

        {/* Modal */}
        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box bg-background border border-card-border rounded-2xl max-w-[540px] p-8">
            <EventFormPage onActivityCreated={handleDone} editData={editData} />
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </DashboardPageWrapper>
  )
}
