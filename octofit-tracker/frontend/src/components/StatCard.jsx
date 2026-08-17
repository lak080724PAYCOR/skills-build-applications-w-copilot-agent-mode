function StatCard({ label, value, hint }) {
  return (
    <div className="col-md-6 col-xl-3">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body">
          <p className="text-uppercase small text-secondary mb-2">{label}</p>
          <h2 className="display-6 fw-semibold mb-2">{value}</h2>
          <p className="text-secondary mb-0">{hint}</p>
        </div>
      </div>
    </div>
  )
}

export default StatCard
