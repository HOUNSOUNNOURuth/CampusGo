export default function HistoryTable({ history = [] }) {
  return (
    <table>
      <thead>
        <tr><th>Destination</th><th>Date</th><th>Distance</th></tr>
      </thead>
      <tbody>
        {history.map((h) => (
          <tr key={h.id}>
            <td>{h.destination_name}</td>
            <td>{new Date(h.created_at).toLocaleDateString('fr-FR')}</td>
            <td>{h.distance_m ? `${h.distance_m} m` : '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
