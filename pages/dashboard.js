import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Card from "../components/Card";

const MODELS = ["gpt-3", "dall-e", "whisper", "codex"];

const STATUS_STYLES = {
  completed: "bg-green-900 text-green-200",
  running:   "bg-blue-900 text-blue-200",
  failed:    "bg-red-900 text-red-200",
  pending:   "bg-gray-900 text-gray-200",
};
const STATUS_LABELS = {
  completed: "Complété",
  running:   "En cours",
  failed:    "Échoué",
  pending:   "En attente",
};

const quickActions = [
  { href: "/projects",  label: "Projets",      icon: "📁", description: "Gérer les projets",    color: "from-purple-500 to-pink-500" },
  { href: "/compute",   label: "Compute",       icon: "🖥️", description: "Ressources GPU",       color: "from-green-500 to-emerald-500" },
  { href: "/billing",   label: "Facturation",   icon: "💳", description: "Gestion des coûts",    color: "from-orange-500 to-red-500" },
  { href: "/models",    label: "Modèles",       icon: "🤖", description: "Catalogue IA",         color: "from-cyan-500 to-blue-500" },
  { href: "/my-gpus",   label: "Mes GPU",       icon: "⚡", description: "Location GPU",         color: "from-yellow-500 to-orange-500" },
  { href: "/settings",  label: "Paramètres",    icon: "⚙️", description: "Préférences",          color: "from-gray-500 to-slate-500" },
];

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState(
    MODELS.includes(router.query.model) ? router.query.model : "gpt-3"
  );
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [jobError, setJobError] = useState(null);

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch("/api/jobs");
        if (!res.ok) return;
        const data = await res.json();
        setJobs((data.jobs || []).slice(0, 5));
      } finally {
        setLoadingJobs(false);
      }
    }
    loadJobs();
  }, []);

  async function runAI() {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    setSubmitting(true);
    setJobError(null);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmed.slice(0, 80),
          model: selectedModel,
          prompt: trimmed,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors du lancement");
      setJobs((prev) => [data.job, ...prev].slice(0, 5));
      setPrompt("");
    } catch (err) {
      setJobError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const runningCount = jobs.filter((j) => j.status === "running").length;
  const completedCount = jobs.filter((j) => j.status === "completed").length;

  const stats = [
    { label: "GPU disponible",   value: "12/16",          icon: "🖥️", color: "from-green-500 to-emerald-500" },
    { label: "Jobs récents",     value: String(jobs.length), icon: "⚙️", color: "from-blue-500 to-cyan-500" },
    { label: "En cours",         value: String(runningCount), icon: "⟳",  color: "from-orange-500 to-yellow-500" },
    { label: "Complétés",        value: String(completedCount), icon: "✓", color: "from-purple-500 to-pink-500" },
  ];

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-[#0B0F19] to-[#1a1f2e] animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-4xl font-bold mb-2">
          Bienvenue{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""} 👋
        </h1>
        <p className="text-gray-400">Voici votre tableau de bord neu-rix</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-slide-up">
        {stats.map((stat, idx) => (
          <Card key={idx} className={`p-5 bg-gradient-to-br ${stat.color} bg-opacity-10 border-0`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <span className="text-4xl opacity-50">{stat.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Access */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">⚡ Accès rapide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`p-4 rounded-lg border-2 border-transparent hover:border-[#6366F1] bg-gradient-to-br ${action.color} bg-opacity-10 transition hover:shadow-lg`}
            >
              <div className="text-3xl mb-2">{action.icon}</div>
              <p className="font-semibold text-sm">{action.label}</p>
              <p className="text-xs text-gray-400">{action.description}</p>
            </Link>
          ))}
        </div>
      </Card>

      {/* Launch AI Job */}
      <Card className="p-6">
        <h3 className="mb-4 text-2xl font-bold">🚀 Lancer un job IA</h3>
        <div className="flex gap-3 mb-3">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-[#0B0F19] border border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#6366F1]"
          >
            {MODELS.map((m) => (
              <option key={m} value={m}>{m.toUpperCase()}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Décrivez votre demande IA (ex: Générer une image d'un coucher de soleil)"
            className="flex-1 h-20 bg-[#0B0F19] border border-gray-700 rounded-lg p-3 outline-none focus:border-[#6366F1] resize-none"
          />
          <button
            onClick={runAI}
            disabled={submitting || !prompt.trim()}
            className="bg-[#6366F1] px-6 py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition font-semibold h-fit"
          >
            {submitting ? "⟳" : "▶ Lancer"}
          </button>
        </div>
        {jobError && <p className="text-red-400 text-sm mt-2">{jobError}</p>}
      </Card>

      {/* Recent Jobs */}
      <Card className="p-6">
        <h3 className="mb-4 text-2xl font-bold">📂 Jobs récents</h3>
        {loadingJobs && <p className="text-gray-400 text-sm">Chargement…</p>}
        {!loadingJobs && jobs.length === 0 && (
          <p className="text-gray-400 text-sm">Aucun job pour le moment. Lancez votre premier job ci-dessus.</p>
        )}
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="p-4 bg-[#0B0F19] rounded-lg border border-gray-800 flex items-center justify-between hover:border-gray-700 transition">
              <div>
                <p className="font-semibold text-sm">{job.title}</p>
                <p className="text-xs text-gray-400">{job.model} • {job.durationSec ? `${job.durationSec}s` : "en cours"}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full ${STATUS_STYLES[job.status] || STATUS_STYLES.pending}`}>
                {STATUS_LABELS[job.status] || job.status}
              </span>
            </div>
          ))}
        </div>
        {jobs.length > 0 && (
          <Link href="/jobs" className="mt-4 block text-center text-[#6366F1] hover:underline text-sm font-semibold">
            Voir tous les jobs →
          </Link>
        )}
      </Card>
    </div>
  );
}
