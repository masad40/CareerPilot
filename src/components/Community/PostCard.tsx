"use client"

import { useState, useRef } from "react"
import { Heart, MessageCircle, Share2, MoreHorizontal, Edit2, Trash2, Check, X } from "lucide-react"
import CommentSection from "./CommentSection"
import { toast } from "react-toastify"

export default function PostCard({ post, reload }: any) {
  const [showMenu, setShowMenu] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(post.content)
  
  // New States for Comments
  const [showAllComments, setShowAllComments] = useState(false)
  const commentInputRef = useRef<HTMLInputElement>(null)

  const handleReplyClick = () => {
    setShowAllComments(true) // Sob comment dekhabe
    // Chotto ekta timeout jate UI render hobar por focus hoy
    setTimeout(() => {
      commentInputRef.current?.focus()
    }, 100)
  }

  // --- Like, Delete, Update, Share Logics (Ager motoi thakbe) ---
  const likePost = async () => {
    if (isLiking) return
    setIsLiking(true)
    try {
      const res = await fetch("/api/community/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post._id, userId: "demoUser" })
      })
      const data = await res.json()
      if (data.isLiked) toast.success("Liked! ❤️", { autoClose: 1000 })
      reload()
    } catch (error) {
      toast.error("Error liking post")
    } finally {
      setIsLiking(false)
    }
  }

  const confirmDelete = () => {
    setShowMenu(false)
    const Msg = ({ closeToast }: any) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-zinc-200">Delete this post?</p>
        <div className="flex gap-2">
          <button onClick={async () => {
              await fetch(`/api/community/posts?postId=${post._id}`, { method: "DELETE" })
              toast.success("Deleted! 🗑️"); reload(); closeToast()
            }} className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-md font-bold hover:bg-red-600">Delete</button>
          <button onClick={closeToast} className="px-3 py-1.5 bg-zinc-700 text-white text-xs rounded-md font-bold">Cancel</button>
        </div>
      </div>
    )
    toast.warn(<Msg />, { position: "top-center", autoClose: false, theme: "dark" })
  }

  const handleUpdate = async () => {
    if (!editedContent.trim()) return toast.error("Content empty")
    try {
      await fetch("/api/community/posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post._id, content: editedContent })
      })
      toast.success("Updated! ✨"); setIsEditing(false); reload()
    } catch (error) { toast.error("Failed") }
  }

  const handleShare = async () => {
    navigator.clipboard.writeText(window.location.href)
    toast.info("Link copied! 📋")
  }

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-5 backdrop-blur-sm relative hover:border-zinc-700/50 transition-all shadow-xl">
      
      {/* Header Section (Profile & Menu) */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
            {post.userEmail?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="text-zinc-100 font-medium leading-tight">{post.userEmail?.split('@')[0]}</h4>
            <p className="text-xs text-zinc-500 mt-0.5">{post.userEmail}</p>
          </div>
        </div>

        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded-full transition-all">
            <MoreHorizontal size={20} />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
              <button onClick={() => { setIsEditing(true); setShowMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-800 border-b border-zinc-800/50"><Edit2 size={14} className="text-cyan-500" /> Edit</button>
              <button onClick={confirmDelete} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10"><Trash2 size={14} /> Delete</button>
            </div>
          )}
          {showMenu && <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>}
        </div>
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="mb-5 space-y-3">
          <textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} className="w-full bg-zinc-800/30 border border-zinc-700 rounded-xl p-4 text-zinc-200 outline-none focus:border-cyan-500 min-h-[100px] resize-none" />
          <div className="flex justify-end gap-2">
            <button onClick={() => setIsEditing(false)} className="p-2 text-zinc-400 hover:bg-zinc-800 rounded-lg"><X size={20}/></button>
            <button onClick={handleUpdate} className="p-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500"><Check size={20}/></button>
          </div>
        </div>
      ) : (
        <div className="text-zinc-200 leading-relaxed text-[15px] mb-5 whitespace-pre-wrap">{post.content}</div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-6 border-y border-zinc-800/50 py-3 mb-4">
        <button onClick={likePost} disabled={isLiking} className="flex items-center gap-2 group transition-all active:scale-90">
          <Heart size={18} className={post.likes > 0 ? "fill-rose-500 text-rose-500" : "text-zinc-500 group-hover:text-rose-500"} />
          <span className="text-sm font-medium">{post.likes || 0}</span>
        </button>

        <button onClick={handleReplyClick} className="flex items-center gap-2 group cursor-pointer transition-all active:scale-90">
          <MessageCircle size={18} className="text-zinc-500 group-hover:text-cyan-500" />
          <span className="text-sm font-medium text-zinc-500 group-hover:text-cyan-500">Reply</span>
        </button>

        <button onClick={handleShare} className="flex items-center gap-2 group ml-auto transition-all text-zinc-500 hover:text-cyan-400">
          <Share2 size={18} />
        </button>
      </div>

      {/* Comment Section with Logic */}
      <div className="mt-4">
        <CommentSection 
          postId={post._id} 
          isExpanded={showAllComments} 
          setIsExpanded={setShowAllComments}
          inputRef={commentInputRef}
        />
      </div>
    </div>
  )
}