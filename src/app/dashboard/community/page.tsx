import CommunityFeed from "@/components/Community/CommunityFeed";

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              Community
            </span>
            <span className="text-cyan-500 ml-1">.</span>
          </h1>
          <p className="text-zinc-500 mt-2 text-sm md:text-base font-medium">
            Connect, share, and grow with other members.
          </p>
        </div>

        {/* Decorative Element or Stats (Optional) */}
        <div className="hidden md:block text-right">
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-600 mb-1">Status</div>
          <div className="flex items-center gap-2 justify-end text-sm text-emerald-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Discussion
          </div>
        </div>
      </div>

      {/* Feed Section */}
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Background Glow Effect */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full"></div>
          
          <CommunityFeed />
        </div>
      </div>
    </div>
  );
}