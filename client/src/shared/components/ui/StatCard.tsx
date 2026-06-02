interface StatCardProps {
  title: string;
  value: string;
  change: string;
}

const StatCard = ({ title, value, change }: StatCardProps) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm text-slate-400">{title}</p>

      <h3 className="mt-2 text-3xl font-bold">{value}</h3>

      <p className="mt-2 text-green-400">{change}</p>
    </div>
  );
};

export default StatCard;
