'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, Star, Download, Copy, Check } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  project: string;
}

const emptyTestimonial: Testimonial = {
  id: 0, name: '', role: '', avatar: '', content: '', rating: 5, project: '',
};

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<Testimonial>(emptyTestimonial);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { loadTestimonials(); }, []);

  async function loadTestimonials() {
    try {
      const localData = localStorage.getItem('portfolio_testimonials');
      if (localData) { setTestimonials(JSON.parse(localData).testimonials || JSON.parse(localData)); return; }
      const data = await import('@/data/testimonials.json');
      setTestimonials(data.testimonials);
    } catch (error) { console.error('Error:', error); }
  }

  const saveToLocal = (updated: Testimonial[]) => {
    localStorage.setItem('portfolio_testimonials', JSON.stringify({ testimonials: updated }));
    setTestimonials(updated);
    setMessage({ type: 'success', text: 'Tersimpan di browser! Export untuk menyimpan permanen.' });
    setTimeout(() => setMessage(null), 3000);
  };

  const exportJSON = () => JSON.stringify({ testimonials }, null, 2);
  const copyToClipboard = async () => { await navigator.clipboard.writeText(exportJSON()); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const downloadJSON = () => { const blob = new Blob([exportJSON()], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'testimonials.json'; a.click(); };
  const resetToOriginal = async () => { if (!confirm('Reset?')) return; localStorage.removeItem('portfolio_testimonials'); const data = await import('@/data/testimonials.json'); setTestimonials(data.testimonials); };

  const openModal = (t?: Testimonial) => { if (t) { setEditingTestimonial(t); setFormData(t); } else { setEditingTestimonial(null); setFormData({ ...emptyTestimonial, id: Date.now() }); } setIsModalOpen(true); };
  const closeModal = () => { setIsModalOpen(false); setEditingTestimonial(null); setFormData(emptyTestimonial); };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { const { name, value } = e.target; setFormData((p) => ({ ...p, [name]: value })); };
  const handleSave = () => { let updated = editingTestimonial ? testimonials.map((t) => (t.id === editingTestimonial.id ? formData : t)) : [...testimonials, formData]; saveToLocal(updated); closeModal(); };
  const handleDelete = (id: number) => { if (!confirm('Hapus?')) return; saveToLocal(testimonials.filter((t) => t.id !== id)); };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div><h1 className="text-3xl font-bold text-white mb-2">Testimonials</h1><p className="text-slate-400">Kelola testimonial klien</p></div>
        <div className="flex gap-2">
          <button onClick={() => setIsExportModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600"><Download className="w-5 h-5" />Export</button>
          <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white rounded-xl hover:opacity-90"><Plus className="w-5 h-5" />Tambah</button>
        </div>
      </div>

      {message && <div className={`mb-4 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>{message.text}</div>}
      <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-sm">💡 Export ke <code className="px-1 bg-slate-800 rounded">/data/testimonials.json</code></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
            <div className="flex items-start gap-4 mb-4">
              <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover bg-slate-700" />
              <div className="flex-1"><h3 className="font-semibold text-white">{t.name}</h3><p className="text-sm text-slate-400">{t.role}</p><p className="text-xs text-cyan-400 mt-1">{t.project}</p></div>
              <div className="flex gap-1">
                <button onClick={() => openModal(t)} className="p-2 text-slate-400 hover:text-amber-400"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(t.id)} className="p-2 text-slate-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex gap-1 mb-3">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} className={`w-4 h-4 ${i < t.rating ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} />))}</div>
            <p className="text-slate-300 text-sm line-clamp-3">"{t.content}"</p>
          </div>
        ))}
        {testimonials.length === 0 && <div className="col-span-full bg-slate-800 rounded-2xl border border-slate-700 p-12 text-center text-slate-400">Belum ada testimonial.</div>}
      </div>
      <div className="mt-4 text-center"><button onClick={resetToOriginal} className="text-sm text-slate-500 hover:text-red-400">Reset ke data original</button></div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700"><h2 className="text-xl font-bold text-white">{editingTestimonial ? 'Edit' : 'Tambah'} Testimonial</h2><button onClick={closeModal} className="p-2 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button></div>
            <div className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-slate-300 mb-2">Nama</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white" /></div>
              <div><label className="block text-sm font-medium text-slate-300 mb-2">Role</label><input type="text" name="role" value={formData.role} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white" /></div>
              <div><label className="block text-sm font-medium text-slate-300 mb-2">Avatar URL</label><input type="url" name="avatar" value={formData.avatar} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white" />{formData.avatar && <img src={formData.avatar} alt="Preview" className="mt-2 w-16 h-16 rounded-full object-cover bg-slate-700" />}</div>
              <div><label className="block text-sm font-medium text-slate-300 mb-2">Project</label><input type="text" name="project" value={formData.project} onChange={handleInputChange} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white" /></div>
              <div><label className="block text-sm font-medium text-slate-300 mb-2">Rating</label><div className="flex gap-2">{[1,2,3,4,5].map((r) => (<button key={r} type="button" onClick={() => setFormData((p) => ({ ...p, rating: r }))} className="p-2"><Star className={`w-6 h-6 ${r <= formData.rating ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} /></button>))}</div></div>
              <div><label className="block text-sm font-medium text-slate-300 mb-2">Testimonial</label><textarea name="content" value={formData.content} onChange={handleInputChange} rows={4} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white resize-none" /></div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-700"><button onClick={closeModal} className="px-4 py-2 text-slate-400 hover:text-white">Batal</button><button onClick={handleSave} disabled={!formData.name || !formData.content} className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white rounded-xl hover:opacity-90 disabled:opacity-50"><Save className="w-4 h-4" />Simpan</button></div>
          </div>
        </div>
      )}

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
