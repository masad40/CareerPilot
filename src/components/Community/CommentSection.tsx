"use client"

import { useEffect, useState } from "react"
import { Send, User, ChevronDown, ChevronUp, Edit2, Trash2, Heart } from "lucide-react"
import { toast } from "react-toastify"

export default function CommentSection({ postId, isExpanded, setIsExpanded, inputRef }: any) {
  const [comments, setComments] = useState<any[]>([])
  const [text, setText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  const currentUserId = "demoUser" // Authenticated user ashle seta ekhane hobe

  const loadComments = async () => {
    try {
      const res = await fetch(`/api/community/comments?postId=${postId}`)
      const data = await res.json()
      setComments(data)
    } catch (error) { console.error("Error:", error) }
  }

  useEffect(() => { loadComments() }, [])

  // 1. Add Comment
  const addComment = async () => {
    if (!text.trim()) return
    setIsSubmitting(true)
    try {
      await fetch("/api/community/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userId: currentUserId, text })
      })
      setText(""); loadComments(); setIsExpanded(true)
    } finally { setIsSubmitting(false) }
  }

  // 2. Modern Delete Confirmation with Toast
  const deleteComment = (id: string) => {
    const Msg = ({ closeToast }: any) => (
      <div className="flex flex-col gap-3 p-1">
        <p className="text-sm font-medium text-zinc-200">Delete this comment forever?</p>
        <div className="flex gap-2">
          <button 
            onClick={async () => {
              await fetch(`/api/community/comments?commentId=${id}`, { method: "DELETE" })
              toast.success("Deleted! 🗑️")
              loadComments(); closeToast()
            }}
            className="px-3 py-1.5 bg-red-500 text-white text-[11px] rounded-md font-bold hover:bg-red-600 transition-all active:scale-95"
          >
            Confirm
          </button>
          <button onClick={closeToast} className="px-3 py-1.5 bg-zinc-700 text-white text-[11px] rounded-md font-bold transition-all">
            Cancel
          </button>
        </div>
      </div>
    )
    toast.warn(<Msg />, { position: "top-center", autoClose: false, theme: "dark", icon: false })
  }

  // 3. Like Logic
  const handleLike = async (commentId: string) => {
    try {
      await fetch("/api/community/comments/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, userId: currentUserId })
      })
      loadComments()
    } catch (error) { toast.error("Failed to like") }
  }

  // 4. Update Logic
  const updateComment = async (id: string) => {
    if (!editText.trim()) return
    await fetch("/api/community/comments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId: id, text: editText })
    })
    setEditingId(null); loadComments()
  }

  const visibleComments = isExpanded ? comments : comments.slice(0, 2)

  return (
    <div className="mt-4 pt-4 border-t border-zinc-800/30">
      
      {/* Comments List Section */}
      <div className="space-y-4 mb-6">
        {visibleComments.length === 0 ? (
          <p className="text-[11px] text-zinc-600 italic ml-11">No thoughts yet. Start the conversation!</p>
        ) : (
          visibleComments.map((c) => {
            const hasLiked = c.likes?.includes(currentUserId)
            return (
              <div key={c._id} className="flex gap-3 group animate-in fade-in slide-in-from-left-2 duration-300">
                {/* User Avatar */}
                <div className="w-8 h-8 rounded-full bg-zinc-800/80 flex items-center justify-center shrink-0 mt-1 border border-zinc-700/30">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">{c.userId?.charAt(0)}</span>
                </div>
                
                {/* Comment Content Bubble */}
                <div className="flex-1 flex flex-col gap-1">
                  <div className="relative group/item max-w-[95%]">
                    {editingId === c._id ? (
                      <div className="flex flex-col gap-2 bg-zinc-800/30 p-2 rounded-xl border border-cyan-500/20">
                        <input 
                          value={editText} 
                          onChange={(e) => setEditText(e.target.value)}
                          className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 outline-none focus:border-cyan-500/50"
                          autoFocus
                        />
                        <div className="flex gap-3 text-[10px] px-1">
                          <button onClick={() => updateComment(c._id)} className="text-cyan-500 font-bold hover:text-cyan-400">SAVE</button>
                          <button onClick={() => setEditingId(null)} className="text-zinc-500 hover:text-zinc-400 uppercase tracking-tighter">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-zinc-800/20 px-4 py-2.5 rounded-2xl rounded-tl-none border border-zinc-800/40 group-hover:bg-zinc-800/40 transition-all duration-300 shadow-sm">
                        <div className="flex justify-between items-start mb-0.5">
                          <p className="text-[10px] font-bold text-cyan-500/70 uppercase tracking-wider">User {c.userId?.slice(-4)}</p>
                          
                          {/* Hover Actions */}
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button onClick={() => { setEditingId(c._id); setEditText(c.text); }} className="text-zinc-600 hover:text-cyan-500"><Edit2 size={12}/></button>
                            <button onClick={() => deleteComment(c._id)} className="text-zinc-600 hover:text-red-500"><Trash2 size={12}/></button>
                          </div>
                        </div>
                        <p className="text-sm text-zinc-300 leading-relaxed font-light">{c.text}</p>
                      </div>
                    )}
                  </div>

                  {/* Like Button Under Comment */}
                  <div className="flex items-center gap-4 ml-2 mt-0.5">
                    <button 
                      onClick={() => handleLike(c._id)}
                      className={`flex items-center gap-1.5 text-[10px] font-bold transition-all active:scale-90 ${
                        hasLiked ? "text-rose-500" : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      <Heart size={11} className={hasLiked ? "fill-current animate-bounce" : ""} />
                      <span>{c.likes?.length || 0} {c.likes?.length === 1 ? 'Like' : 'Likes'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
        
        {/* Toggle Button for More Comments */}
        {comments.length > 2 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="text-[11px] text-zinc-500 hover:text-cyan-500 ml-11 font-bold flex items-center gap-1 transition-all group"
          >
            {isExpanded ? (
              <><ChevronUp size={14} className="group-hover:-translate-y-0.5 transition-transform" /> Show less</>
            ) : (
              <><ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" /> View all {comments.length} comments</>
            )}
          </button>
        )}
      </div>

      {/* Modern Comment Input Field */}
      <div className="flex items-center gap-3 bg-zinc-900/40 p-1.5 pl-4 pr-1.5 rounded-full border border-zinc-800/50 focus-within:border-cyan-500/30 transition-all shadow-inner">
        <User size={14} className="text-zinc-600" />
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addComment()}
          placeholder="Add a comment..."
          className="flex-1 bg-transparent text-sm py-2 outline-none text-zinc-200 placeholder:text-zinc-600"
        />
        <button 
          onClick={addComment} 
          disabled={!text.trim() || isSubmitting} 
          className="bg-cyan-600 hover:bg-cyan-500 text-white p-2.5 rounded-full disabled:bg-zinc-800 disabled:text-zinc-600 transition-all shadow-lg active:scale-95"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  )
}