export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
        </div>
    );
}
