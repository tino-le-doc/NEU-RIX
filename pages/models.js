import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Card from '../components/Card';

export default function Models() {
  const router = useRouter();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/models');
        if (!res.ok) throw new Error('Impossible de charger les modèles');
        const data = await res.json();
        setModels(data.models || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function handleUse(modelId) {
    router.push(`/dashboard?model=${modelId}`);
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Modèles disponibles</h2>
        <p className="text-gray-400">Sélectionnez un modèle pour commencer</p>
      </div>

      {loading && <p className="text-gray-400">Chargement des modèles…</p>}
      {error && <p className="text-red-400">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
        {models.map((model) => (
          <Card key={model.id}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold">{model.name}</h3>
                <p className="text-xs text-gray-500">{model.category}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                model.status === 'available'
                  ? 'bg-green-900 text-green-200'
                  : 'bg-yellow-900 text-yellow-200'
              }`}>
                {model.status === 'available' ? 'Disponible' : 'Beta'}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-3">{model.description}</p>
            <div className="flex gap-2 mb-3 flex-wrap">
              {(model.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-[#0B0F19] border border-gray-700 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            {model.pricing && (
              <p className="text-xs text-gray-500 mb-3">
                {model.pricing.amount} € / {model.pricing.unit}
              </p>
            )}
            <button
              onClick={() => handleUse(model.id)}
              className="w-full bg-[#6366F1] py-2 rounded-md text-sm hover:opacity-90 transition"
            >
              Utiliser
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
