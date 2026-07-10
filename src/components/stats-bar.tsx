const stats = [
  { value: "1.200+", label: "Matriculados activos" },
  { value: "45+", label: "Años de trayectoria" },
  { value: "2", label: "Sedes: Santa Fe y Rafaela" },
  { value: "100%", label: "Trámites disponibles online" },
];

export function StatsBar() {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-8 text-center sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label}>
          <p className="text-3xl font-bold text-ink-900 sm:text-4xl">{stat.value}</p>
          <p className="mt-1 text-sm text-ink-600">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
