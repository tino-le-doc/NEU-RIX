import { useEffect, useState } from 'react';
import Card from '../components/Card';

const STATUS_STYLES = {
  completed: 'bg-green-900 text-green-200',
  running:   'bg-blue-900 text-blue-200',
  failed:    'bg-red-900 text-red-200',
  pending:   'bg-gray-900 text-gray-200',
};
const STATUS_LABELS = {
  completed: 'Complété',
  running:   'En cours',
  failed:    'Échoué',
  pending:   'En attente',
};

function formatDate(iso) {
  if (!iso) return '--';
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function formatDuration(sec) {
  if (!sec) return '--';
  return `${sec}s`;
}

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/jobs');
        if (!res.ok) throw new Error('Impossible de charger les jobs');
        const data = await res.json();
        setJobs(data.jobs || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleDelete(id) {
    if (!confirm('Supprimer ce job ?')) return;
    await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }

  const visible = filter
    ? jobs.filter((j) => j.status === filter)
    : jobs;

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Historique des jobs</h2>
          <p className="text-gray-400">Consultez tous vos jobs exécutés</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-[#0B0F19] border border-gray-700 rounded-md px-3 py-2 text-sm outline-none focus:border-[#6366F1]"
        >
          <option value="">Tous les statuts</option>
          <option value="completed">Complété</option>
          <option value="running">En cours</option>
          <option value="failed">Échoué</option>
          <option value="pending">En attente</option>
        </select>
      </div>

      {loading && <p className="text-gray-400">Chargement…</p>}
      {error && <p className="text-red-400 mb-4">Erreur : {error}</p>}

      {!loading && visible.length === 0 && (
        <Card>
          <p className="text-gray-400">Aucun job trouvé.</p>
        </Card>
      )}

      {!loading && visible.length > 0 && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Titre</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Modèle</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Statut</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Durée</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Coût</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((job) => (
                  <tr key={job.id} className="border-b border-gray-800 hover:bg-[#0B0F19] transition">
                    <td className="py-3 px-4 text-sm max-w-xs truncate">{job.title}</td>
                    <td className="py-3 px-4 text-sm text-gray-400">{job.model}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${STATUS_STYLES[job.status] || STATUS_STYLES.pending}`}>
                        {STATUS_LABELS[job.status] || job.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-400">{formatDate(job.createdAt)}</td>
                    <td className="py-3 px-4 text-sm text-gray-400">{formatDuration(job.durationSec)}</td>
                    <td className="py-3 px-4 text-sm text-gray-400">
                      {job.cost ? `$${job.cost.toFixed(4)}` : '--'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="text-red-400 hover:text-red-300 text-xs"
                        title="Supprimer"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
