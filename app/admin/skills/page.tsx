'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, ChevronDown, ChevronUp, Download, Copy, Check } from 'lucide-react';

interface Skill {
  name: string;
  level: number;
  color: string;
}

interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  skills: Skill[];
}

interface OverviewItem {
  icon: string;
  name: string;
  level: number;
  color: string;
  description: string;
}

interface SkillsData {
  categories: SkillCategory[];
  overview: OverviewItem[];
}

const iconOptions = ['Layout', 'Server', 'GitBranch', 'Code2', 'Database', 'Palette', 'Smartphone', 'Globe', 'Zap', 'Brain'];

export default function SkillsAdmin() {
  const [data, setData] = useState<SkillsData>({ categories: [], overview: [] });
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null);
  const [editingSkill, setEditingSkill] = useState<{ categoryId: string; skill: Skill | null }>({ categoryId: '', skill: null });
  const [skillForm, setSkillForm] = useState<Skill>({ name: '', level: 80, color: '#61DAFB' });
  const [categoryForm, setCategoryForm] = useState<SkillCategory>({ id: '', name: '', icon: 'Layout', skills: [] });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const localData = localStorage.getItem('portfolio_skills');
      if (localData) {
        setData(JSON.parse(localData));
        return;
      }
      const skillsData = await import('@/data/skills.json');
      setData(skillsData as unknown as SkillsData);
    } catch (error) {
      console.error('Error loading skills:', error);
    }
  }

  const saveToLocal = (newData: SkillsData) => {
    localStorage.setItem('portfolio_skills', JSON.stringify(newData));
    setData(newData);
    setMessage({ type: 'success', text: 'Tersimpan di browser! Klik "Export JSON" untuk menyimpan permanen.' });
    setTimeout(() => setMessage(null), 3000);
  };

  const exportJSON = () => JSON.stringify(data, null, 2);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(exportJSON());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadJSON = () => {
    const blob = new Blob([exportJSON()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skills.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetToOriginal = async () => {
    if (!confirm('Yakin ingin reset ke data original?')) return;
    localStorage.removeItem('portfolio_skills');
    const skillsData = await import('@/data/skills.json');
    setData(skillsData as unknown as SkillsData);
    setMessage({ type: 'success', text: 'Data berhasil di-reset!' });
    setTimeout(() => setMessage(null), 3000);
  };

  // Category CRUD
  const openCategoryModal = (category?: SkillCategory) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm(category);
    } else {
      setEditingCategory(null);
      setCategoryForm({ id: '', name: '', icon: 'Layout', skills: [] });
    }
    setIsCategoryModalOpen(true);
  };

  const saveCategory = () => {
    const formWithId = {
      ...categoryForm,
      id: categoryForm.id || categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
    };

    let newCategories: SkillCategory[];
    if (editingCategory) {
      newCategories = data.categories.map((c) => (c.id === editingCategory.id ? formWithId : c));
    } else {
      newCategories = [...data.categories, formWithId];
    }

    saveToLocal({ ...data, categories: newCategories });
    setIsCategoryModalOpen(false);
  };

  const deleteCategory = (id: string) => {
    if (!confirm('Yakin ingin menghapus kategori ini beserta semua skillnya?')) return;
    saveToLocal({ ...data, categories: data.categories.filter((c) => c.id !== id) });
  };

  // Skill CRUD
  const openSkillModal = (categoryId: string, skill?: Skill) => {
    setEditingSkill({ categoryId, skill: skill || null });
    setSkillForm(skill || { name: '', level: 80, color: '#61DAFB' });
    setIsSkillModalOpen(true);
  };

  const saveSkill = () => {
    const newCategories = data.categories.map((cat) => {
      if (cat.id !== editingSkill.categoryId) return cat;

      let newSkills: Skill[];
      if (editingSkill.skill) {
        newSkills = cat.skills.map((s) => (s.name === editingSkill.skill!.name ? skillForm : s));
      } else {
        newSkills = [...cat.skills, skillForm];
      }

      return { ...cat, skills: newSkills };
    });

    saveToLocal({ ...data, categories: newCategories });
    setIsSkillModalOpen(false);
  };

  const deleteSkill = (categoryId: string, skillName: string) => {
    if (!confirm('Yakin ingin menghapus skill ini?')) return;
    const newCategories = data.categories.map((cat) => {
      if (cat.id !== categoryId) return cat;
      return { ...cat, skills: cat.skills.filter((s) => s.name !== skillName) };
    });
    saveToLocal({ ...data, categories: newCategories });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Skills</h1>
          <p className="text-slate-400">Kelola skills & expertise Anda</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600"
          >
            <Download className="w-5 h-5" />
            Export
          </button>
          <button
            onClick={() => openCategoryModal()}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-lime-500 to-green-500 text-white rounded-xl hover:opacity-90"
          >
            <Plus className="w-5 h-5" />
            Tambah Kategori
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
          {message.text}
        </div>
      )}

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-sm">
        💡 Perubahan disimpan di browser. Export JSON untuk menyimpan ke <code className="px-1 bg-slate-800 rounded">/data/skills.json</code>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        {data.categories.map((category) => (
          <div key={category.id} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <div
              className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-slate-700/30 transition-colors"
              onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">📁</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{category.name}</h3>
                  <p className="text-sm text-slate-400">{category.skills.length} skills</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); openCategoryModal(category); }} className="p-2 text-slate-400 hover:text-amber-400">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); deleteCategory(category.id); }} className="p-2 text-slate-400 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
                {expandedCategory === category.id ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </div>
            </div>

            {expandedCategory === category.id && (
              <div className="border-t border-slate-700 p-4">
                <div className="flex justify-end mb-4">
                  <button onClick={() => openSkillModal(category.id)} className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-white text-sm rounded-lg hover:bg-slate-600">
                    <Plus className="w-4 h-4" />
                    Tambah Skill
                  </button>
                </div>
                <div className="space-y-3">
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="flex items-center gap-4 p-3 bg-slate-700/30 rounded-xl">
                      <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: skill.color }} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white">{skill.name}</span>
                          <span className="text-sm text-slate-400">{skill.level}%</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${skill.level}%`, backgroundColor: skill.color }} />
                        </div>
                      </div>
                      <button onClick={() => openSkillModal(category.id, skill)} className="p-2 text-slate-400 hover:text-amber-400"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => deleteSkill(category.id, skill.name)} className="p-2 text-slate-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  {category.skills.length === 0 && <p className="text-center text-slate-400 py-4">Belum ada skill.</p>}
                </div>
              </div>
            )}
          </div>
        ))}
        {data.categories.length === 0 && <div className="bg-slate-800 rounded-2xl border border-slate-700 p-12 text-center text-slate-400">Belum ada kategori.</div>}
      </div>

      <div className="mt-4 text-center">
        <button onClick={resetToOriginal} className="text-sm text-slate-500 hover:text-red-400">Reset ke data original</button>
      </div>

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">{editingCategory ? 'Edit Kategori' : 'Tambah Kategori'}</h2>
              <button onClick={() => setIsCategoryModalOpen(false)} className="p-2 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nama Kategori</label>
                <input type="text" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Frontend" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Icon</label>
                <select value={categoryForm.icon} onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  {iconOptions.map((icon) => (<option key={icon} value={icon}>{icon}</option>))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-700">
              <button onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">Batal</button>
              <button onClick={saveCategory} disabled={!categoryForm.name} className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-lime-500 to-green-500 text-white rounded-xl hover:opacity-90 disabled:opacity-50">
                <Save className="w-4 h-4" />Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skill Modal */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">{editingSkill.skill ? 'Edit Skill' : 'Tambah Skill'}</h2>
              <button onClick={() => setIsSkillModalOpen(false)} className="p-2 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nama Skill</label>
                <input type="text" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="React" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Level: {skillForm.level}%</label>
                <input type="range" min="0" max="100" value={skillForm.level} onChange={(e) => setSkillForm({ ...skillForm, level: parseInt(e.target.value) })} className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Warna</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={skillForm.color} onChange={(e) => setSkillForm({ ...skillForm, color: e.target.value })} className="w-12 h-10 rounded cursor-pointer" />
                  <input type="text" value={skillForm.color} onChange={(e) => setSkillForm({ ...skillForm, color: e.target.value })} className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-700">
              <button onClick={() => setIsSkillModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">Batal</button>
              <button onClick={saveSkill} disabled={!skillForm.name} className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:opacity-90 disabled:opacity-50">
                <Save className="w-4 h-4" />Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Export JSON</h2>
              <button onClick={() => setIsExportModalOpen(false)} className="p-2 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4 flex-1 overflow-auto">
              <p className="text-slate-400 text-sm">Salin ke <code className="px-2 py-1 bg-slate-900 rounded text-cyan-400">/data/skills.json</code></p>
              <pre className="p-4 bg-slate-900 rounded-xl text-sm text-slate-300 overflow-auto max-h-80 font-mono">{exportJSON()}</pre>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-700">
              <button onClick={downloadJSON} className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600"><Download className="w-4 h-4" />Download</button>
              <button onClick={copyToClipboard} className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:opacity-90">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
