'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FolderKanban, Lightbulb, MessageSquareQuote, User, ArrowRight } from 'lucide-react';

interface Stats {
  projects: number;
  skills: number;
  testimonials: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ projects: 0, skills: 0, testimonials: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [projectsRes, skillsRes, testimonialsRes] = await Promise.all([
          import('@/data/projects.json'),
          import('@/data/skills.json'),
          import('@/data/testimonials.json'),
        ]);
        
        setStats({
          projects: projectsRes.projects.length,
          skills: skillsRes.categories.reduce((acc: number, cat: any) => acc + cat.skills.length, 0),
          testimonials: testimonialsRes.testimonials.length,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const cards = [
    {
      title: 'Projects',
      count: stats.projects,
      icon: FolderKanban,
      href: '/admin/projects',
      color: 'from-cyan-500 to-blue-500',
      description: 'Kelola project portfolio',
    },
    {
      title: 'Skills',
      count: stats.skills,
      icon: Lightbulb,
      href: '/admin/skills',
      color: 'from-lime-500 to-green-500',
      description: 'Kelola skills & expertise',
    },
    {
      title: 'Testimonials',
      count: stats.testimonials,
      icon: MessageSquareQuote,
      href: '/admin/testimonials',
      color: 'from-fuchsia-500 to-pink-500',
      description: 'Kelola testimonial klien',
    },
    {
      title: 'Profile',
      count: null,
      icon: User,
      href: '/admin/profile',
      color: 'from-amber-500 to-orange-500',
      description: 'Edit profil & social links',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Selamat datang di Admin Panel Portfolio</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group bg-slate-800 rounded-2xl border border-slate-700 p-6 hover:border-slate-600 transition-all hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-white">
                    {loading ? '...' : card.count !== null ? card.count : '→'}
                  </span>
                  <span className="text-slate-400">{card.title}</span>
                </div>
                <p className="text-sm text-slate-500">{card.description}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Info</h2>
        <div className="space-y-3 text-sm text-slate-400">
          <p>💡 <span className="text-slate-300">Tip:</span> Klik card di atas untuk mengelola setiap section.</p>
          <p>📁 Data disimpan di folder <code className="px-2 py-1 bg-slate-900 rounded text-cyan-400">/data/</code> sebagai JSON files.</p>
          <p>🔄 Perubahan akan langsung terlihat setelah refresh halaman portfolio.</p>
          <p>🌐 Kunjungi <Link href="/" className="text-cyan-400 hover:underline">portfolio</Link> untuk melihat hasil.</p>
        </div>
      </div>
    </div>
  );
}
