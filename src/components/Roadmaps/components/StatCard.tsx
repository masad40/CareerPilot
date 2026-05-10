export default function StatCard({ label, value }: any) {
    return (
        <div className="bg-body-bg backdrop-blur-md border border-card-border rounded-xl p-4 text-center">
            <p className="text-xs text-muted">{label}</p>
            <p className="font-semibold text-foreground">{value}</p>
        </div>
    );
}
