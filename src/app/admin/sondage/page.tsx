import { getSondageResults } from '@/lib/sondage';

export default async function AdminSondagePage() {
  const results = await getSondageResults();

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Résultats du sondage</h1>
      {results.length === 0 ? (
        <p>Aucun avis pour le moment.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Nom</th>
              <th className="border px-2 py-1">Note</th>
              <th className="border px-2 py-1">Commentaire</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r: any, i: number) => (
              <tr key={i}>
                <td className="border px-2 py-1">{new Date(r.date).toLocaleString()}</td>
                <td className="border px-2 py-1">{r.nom}</td>
                <td className="border px-2 py-1">{r.note}</td>
                <td className="border px-2 py-1">{r.commentaire}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
