import { useSession } from 'next-auth/react';
import Card from '../components/Card';

export default function Profile() {
  const { data: session } = useSession();
  const user = session?.user || {};

  const stats = [
    { label: 'Plan',          value: user.plan || 'Starter',  icon: '📋', note: 'Abonnement actuel' },
    { label: 'Rôle',          value: user.role || 'user',     icon: '👤', note: 'Niveau d\'accès' },
  ];

  return (
    <div className="p-6 max-w-3xl animate-fade-in">
      {/* Profile Header */}
      <Card className="mb-6 p-8 animate-slide-up">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-[#6366F1] flex items-center justify-center text-3xl font-bold flex-shrink-0">
            {user.name ? user.name[0].toUpperCase() : '?'}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1">{user.name || '—'}</h1>
            <p className="text-gray-400">{user.email || '—'}</p>
            <div className="flex gap-2 mt-2">
              <span className="bg-green-900 text-green-200 text-xs px-3 py-1 rounded-full">Actif</span>
              <span className="bg-[#6366F1] text-white text-xs px-3 py-1 rounded-full capitalize">
                {user.plan || 'Starter'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold capitalize">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.note}</p>
          </Card>
        ))}
      </div>

      {/* Account Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Informations du compte</h3>
        <div className="space-y-4">
          <div className="flex justify-between border-b border-gray-800 pb-3">
            <span className="text-gray-400 text-sm">Nom</span>
            <span className="text-sm font-medium">{user.name || '—'}</span>
          </div>
          <div className="flex justify-between border-b border-gray-800 pb-3">
            <span className="text-gray-400 text-sm">Email</span>
            <span className="text-sm font-medium">{user.email || '—'}</span>
          </div>
          <div className="flex justify-between border-b border-gray-800 pb-3">
            <span className="text-gray-400 text-sm">Rôle</span>
            <span className="text-sm font-medium capitalize">{user.role || 'user'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-sm">Plan</span>
            <span className="text-sm font-medium text-[#6366F1] capitalize">{user.plan || 'Starter'}</span>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-6">
          Pour modifier vos informations, contactez le support.
        </p>
      </Card>
    </div>
  );
}
