'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, User, MapPin, Mail, Phone, Github, Linkedin, ChevronDown, ChevronUp, Download, Copy, Check } from 'lucide-react';

interface Journey {
  hash: string; date: string; title: string; description: string; icon: string; branch: string; additions: number; deletions: number;
}

interface Profile {
  name: string; roles: string[]; description: string; techStack: string[];
  social: { github: string; linkedin: string; email: string; whatsapp: string; location: string; };
  journey: Journey[];
}

const iconOptions = ['Rocket', 'Briefcase', 'GraduationCap', 'Code', 'Award', 'Star', 'Heart'];

export default function ProfileAdmin() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roleInput, setRoleInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [isJourneyModalOpen, setIsJourneyModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [editingJourney, setEditingJourney] = useState<Journey | null>(null);
  const [journeyForm, setJourneyForm] = useState<Journey>({ hash: '', date: '', title: '', description: '', icon: 'Rocket', branch: 'main', additions: 100, deletions: 0 });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [expandJourney, setExpandJourney] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => { loadProfile(); }, []);

  async function loadProfile() {
    try {
      const localData = localStorage.getItem('portfolio_profile');
      if (localData) { setProfile(JSON.parse(localData)); return; }
      const data = await import('@/data/profile.json');
      setProfile(data as unknown as Profile);
    } catch (error) { console.error('Error:', error); }
  }

  const saveToLocal = (newProfile: Profile) => {
    localStorage.setItem('portfolio_profile', JSON.stringify(newProfile));
    setProfile(newProfile);
    setMessage({ type: 'success', text: 'Tersimpan di browser! Export untuk menyimpan permanen.' });
    setTimeout(() => setMessage(null), 3000);
  };

  const exportJSON = () => JSON.stringify(profile, null, 2);
  const copyToClipboard = async () => { await navigator.clipboard.writeText(exportJSON()); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const downloadJSON = () => { const blob = new Blob([exportJSON()], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'profile.json'; a.click(); };
  const resetToOriginal = async () => { if (!confirm('Reset?')) return; localStorage.removeItem('portfolio_profile'); const data = await import('@/data/profile.json'); setProfile(data as unknown as Profile); };

  const handleBasicChange = (field: string, value: string) => { if (!profile) return; saveToLocal({ ...profile, [field]: value }); };
  const handleSocialChange = (field: string, value: string) => { if (!profile) return; saveToLocal({ ...profile, social: { ...profile.social, [field]: value } }); };

  const addRole = () => { if (!profile || !roleInput.trim()) return; saveToLocal({ ...profile, roles: [...profile.roles, roleInput.trim()] }); setRoleInput(''); };
  const removeRole = (role: string) => { if (!profile) return; saveToLocal({ ...profile, roles: profile.roles.filter((r) => r !== role) }); };
  const addTech = () => { if (!profile || !techInput.trim()) return; saveToLocal({ ...profile, techStack: [...profile.techStack, techInput.trim()] }); setTechInput(''); };
  const removeTech = (tech: string) => { if (!profile) return; saveToLocal({ ...profile, techStack: profile.techStack.filter((t) => t !== tech) }); };

  const openJourneyModal = (j?: Journey) => {
    if (j) { setEditingJourney(j); setJourneyForm(j); }
    else { setEditingJourney(null); setJourneyForm({ hash: Math.random().toString(36).substring(2, 9), date: new Date().getFullYear().toString(), title: '', description: '', icon: 'Rocket', branch: 'main', additions: 100, deletions: 0 }); }
    setIsJourneyModalOpen(true);
  };

  const saveJourney = () => {
    if (!profile) return;
    let newJourney = editingJourney ? profile.journey.map((j) => (j.hash === editingJourney.hash ? journeyForm : j)) : [journeyForm, ...profile.journey];
    saveToLocal({ ...profile, journey: newJourney });
    setIsJourneyModalOpen(false);
  };

  const deleteJourney = (hash: string) => { if (!profile || !confirm('Hapus?')) return; saveToLocal({ ...profile, journey: profile.journey.filter((j) => j.hash !== hash) }); };

  if (!profile) return <div className="text-white">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-3xl font-bold text-white mb-2">Profile</h1><p className="text-slate-400">Edit profil dan informasi kontak</p></div>
        <button onClick={() => setIsExportModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:opacity-90"><Download className="w-5 h-5" />Export JSON</button>
      </div>

      {message && <div className={`p-4 rounded-xl ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>{message.text}</div>}
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-sm">💡 Export ke <code className="px-1 bg-slate-800 rounded">/data/profile.json</code></div>

      {/* Basic Info */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><User className="w-5 h-5" />Informasi Dasar</h2>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-300 mb-2">Nama</label><input type="text" value={profile.name} onChange={(e) => handleBasicChange('name', e.target.value)} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white" /></div>
          <div><label className="block text-sm font-medium text-slate-300 mb-2">Deskripsi</label><textarea value={profile.description} onChange={(e) => handleBasicChange('description', e.target.value)} rows={3} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white resize-none" /></div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Roles</label>
            <div className="flex gap-2 mb-2"><input type="text" value={roleInput} onChange={(e) => setRoleInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())} className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white" placeholder="Tambah role" /><button onClick={addRole} className="px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600"><Plus className="w-5 h-5" /></button></div>
            <div className="flex flex-wrap gap-2">{profile.roles.map((r) => (<span key={r} className="flex items-center gap-1 px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-sm text-cyan-400">{r}<button onClick={() => removeRole(r)} className="hover:text-red-400"><X className="w-3 h-3" /></button></span>))}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Tech Stack</label>
            <div className="flex gap-2 mb-2"><input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())} className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white" placeholder="Tambah tech" /><button onClick={addTech} className="px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600"><Plus className="w-5 h-5" /></button></div>
            <div className="flex flex-wrap gap-2">{profile.techStack.map((t) => (<span key={t} className="flex items-center gap-1 px-3 py-1 bg-lime-500/20 border border-lime-500/30 rounded-full text-sm text-lime-400">{t}<button onClick={() => removeTech(t)} className="hover:text-red-400"><X className="w-3 h-3" /></button></span>))}</div>
          </div>
        </div>
      </div>

      {/* Social */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Mail className="w-5 h-5" />Social & Kontak</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2"><Github className="w-4 h-4" />GitHub</label><input type="url" value={profile.social.github} onChange={(e) => handleSocialChange('github', e.target.value)} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white" /></div>
          <div><label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2"><Linkedin className="w-4 h-4" />LinkedIn</label><input type="url" value={profile.social.linkedin} onChange={(e) => handleSocialChange('linkedin', e.target.value)} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white" /></div>
          <div><label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2"><Mail className="w-4 h-4" />Email</label><input type="email" value={profile.social.email} onChange={(e) => handleSocialChange('email', e.target.value)} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white" /></div>
          <div><label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2"><Phone className="w-4 h-4" />WhatsApp</label><input type="text" value={profile.social.whatsapp} onChange={(e) => handleSocialChange('whatsapp', e.target.value)} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2"><MapPin className="w-4 h-4" />Lokasi</label><input type="text" value={profile.social.location} onChange={(e) => handleSocialChange('location', e.target.value)} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white" /></div>
        </div>
      </div>

      {/* Journey */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-slate-700/30" onClick={() => setExpandJourney(!expandJourney)}>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">🚀 Journey</h2>
          <div className="flex items-center gap-2"><span className="text-sm text-slate-400">{profile.journey.length} items</span>{expandJourney ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}</div>
        </div>
        {expandJourney && (
          <div className="border-t border-slate-700 p-6">
            <div className="flex justify-end mb-4"><button onClick={() => openJourneyModal()} className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-white text-sm rounded-lg hover:bg-slate-600"><Plus className="w-4 h-4" />Tambah</button></div>
            <div className="space-y-3">
              {profile.journey.map((item) => (
                <div key={item.hash} className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-fuchsia-500 rounded-lg flex items-center justify-center text-white">🚀</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1"><span className="font-mono text-sm text-amber-400">{item.hash}</span><span className="text-slate-500">|</span><span className="text-sm text-slate-400">{item.date}</span><span className="px-2 py-0.5 bg-fuchsia-500/20 border border-fuchsia-500/50 rounded text-xs text-fuchsia-400">{item.branch}</span></div>
                    <h4 className="font-medium text-white">{item.title}</h4><p className="text-sm text-slate-400">{item.description}</p>
                  </div>
                  <button onClick={() => openJourneyModal(item)} className="p-2 text-slate-400 hover:text-amber-400"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => deleteJourney(item.hash)} className="p-2 text-slate-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="text-center"><button onClick={resetToOriginal} className="text-sm text-slate-500 hover:text-red-400">Reset ke data original</button></div>

      {/* Journey Modal */}
      {isJourneyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700"><h2 className="text-xl font-bold text-white">{editingJourney ? 'Edit' : 'Tambah'} Journey</h2><button onClick={() => setIsJourneyModalOpen(false)} className="p-2 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button></div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-slate-300 mb-2">Tahun</label><input type="text" value={journeyForm.date} onChange={(e) => setJourneyForm({ ...journeyForm, date: e.target.value })} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white" /></div>
                <div><label className="block text-sm font-medium text-slate-300 mb-2">Branch</label><input type="text" value={journeyForm.branch} onChange={(e) => setJourneyForm({ ...journeyForm, branch: e.target.value })} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white" /></div>
              </div>
              <div><label className="block text-sm font-medium text-slate-300 mb-2">Title</label><input type="text" value={journeyForm.title} onChange={(e) => setJourneyForm({ ...journeyForm, title: e.target.value })} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white" /></div>
              <div><label className="block text-sm font-medium text-slate-300 mb-2">Description</label><textarea value={journeyForm.description} onChange={(e) => setJourneyForm({ ...journeyForm, description: e.target.value })} rows={2} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white resize-none" /></div>
              <div><label className="block text-sm font-medium text-slate-300 mb-2">Icon</label><select value={journeyForm.icon} onChange={(e) => setJourneyForm({ ...journeyForm, icon: e.target.value })} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white">{iconOptions.map((icon) => (<option key={icon} value={icon}>{icon}</option>))}</select></div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-700"><button onClick={() => setIsJourneyModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">Batal</button><button onClick={saveJourney} disabled={!journeyForm.title} className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:opacity-90 disabled:opacity-50"><Save className="w-4 h-4" />Simpan</button></div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700"><h2 className="text-xl font-bold text-white">Export JSON</h2><button onClick={() => setIsExportModalOpen(false)} className="p-2 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button></div>
            <div className="p-6 flex-1 overflow-auto"><pre className="p-4 bg-slate-900 rounded-xl text-sm text-slate-300 overflow-auto max-h-80 font-mono">{exportJSON()}</pre></div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-700"><button onClick={downloadJSON} className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600"><Download className="w-4 h-4" />Download</button><button onClick={copyToClipboard} className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:opacity-90">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied!' : 'Copy'}</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
