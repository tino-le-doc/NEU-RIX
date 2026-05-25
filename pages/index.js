import Link from 'next/link'

const features = [
  { icon: '🤖', title: 'GPT-3',   desc: 'Génération de texte, chat, résumé.' },
  { icon: '🎨', title: 'DALL-E',  desc: 'Images à partir de descriptions.' },
  { icon: '🎤', title: 'Whisper', desc: 'Transcription audio multilingue.' },
  { icon: '💻', title: 'Codex',   desc: 'Génération et complétion de code.' },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-[#0B0F19] to-[#111827]">
      {/* Hero */}
      <div className="animate-fade-in mb-12">
        <span className="text-xs uppercase tracking-widest text-[#6366F1] font-semibold mb-4 block">
          Plateforme IA
        </span>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          La puissance de l&apos;IA<br />
          <span className="text-[#6366F1]">accessible à tous</span>
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
          Lancez vos modèles sans complexité. GPT-3, DALL-E, Whisper, Codex —
          un seul endroit, un seul prix transparent.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/dashboard"
            className="bg-[#6366F1] hover:bg-[#5558e6] px-8 py-3 rounded-md font-semibold transition"
          >
            Accéder au dashboard
          </Link>
          <Link
            href="/gpu-rental"
            className="border border-gray-700 hover:border-[#6366F1] px-8 py-3 rounded-md font-semibold transition text-gray-300"
          >
            Louer un GPU ⚡
          </Link>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl w-full animate-slide-up">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-[#111827] border border-gray-800 rounded-xl p-5 hover:border-[#6366F1] transition"
          >
            <div className="text-3xl mb-3">{f.icon}</div>
            <p className="font-semibold mb-1">{f.title}</p>
            <p className="text-xs text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
