"use client"

import { useEffect, useState } from "react"
import PostCard from "./PostCard"
import { Send, Plus, X, Sparkles } from "lucide-react"
import { toast } from "react-toastify"

export default function CommunityFeed() {
  const [posts, setPosts] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const loadPosts = async () => {
    try {
      const res = await fetch("/api/community/posts")
      const data = await res.json()
      setPosts(data)
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const createPost = async () => {
    if (!content.trim()) return
    setIsLoading(true)
    
    try {
      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          userId: "demoUser",
          userEmail: "user@email.com"
        })
      })

      if(res.ok) {
        toast.success("Post created successfully! ✨")
        setContent("")
        setIsModalOpen(false) // Modal bondho hobe
        loadPosts()
      }
    } catch (error) {
      toast.error("Something went wrong!")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      
      {/* 1. TRIGGER BUTTON (Looks like an input) */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl cursor-pointer hover:border-zinc-700 transition-all flex items-center gap-4 group"
      >
        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-cyan-500 transition-colors">
          <Plus size={20} />
        </div>
        <span className="text-zinc-500 font-medium">What's on your mind?</span>
      </div>

      {/* 2. MODERN MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => !isLoading && setIsModalOpen(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Sparkles size={18} className="text-cyan-500" />
                Create Post
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <textarea
                autoFocus
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts with the community..."
                className="w-full bg-transparent outline-none text-zinc-100 placeholder:text-zinc-600 resize-none min-h-[150px] text-lg leading-relaxed"
              />

              <div className="mt-6 flex justify-end">
                <button
                  onClick={createPost}
                  disabled={!content.trim() || isLoading}
                  className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all duration-200 
                    ${!content.trim() || isLoading 
                      ? "bg-zinc-800 text-zinc-600 cursor-not-allowed" 
                      : "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20 active:scale-95"}`}
                >
                  {isLoading ? "Posting..." : "Post Now"}
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. FEED SECTION */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
            <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-medium">Syncing feed...</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} reload={loadPosts} />
          ))
        )}
      </div>
    </div>
  )
}