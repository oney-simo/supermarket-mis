function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">

      <div>
        <h3>{title}</h3>
        <h1>{value}</h1>
      </div>

      <div>
        <span>{icon}</span>
      </div>

    </div>
  );
}

export default StatCard;