'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ExternalLink, X, Save, Download, Copy, Check } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  technologies: string[];
  language: string;
  languageColor: string;
  github: string;
  live: string;
  stars: number;
  forks: number;
}

const emptyProject: Project = {
  id: 0,
  title: '',
  description: '',
  fullDescription: '',
  image: '',
  technologies: [],
  language: 'TypeScript',
  languageColor: '#3178C6',
  github: '',
  live: '',
  stars: 0,
  forks: 0,
};

const languageColors: Record<string, string> = {
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  Python: '#3776AB',
  PHP: '#777BB4',
  Go: '#00ADD8',
  Rust: '#DEA584',
  Java: '#ED8B00',
};

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Project>(emptyProject);
  const [techInput, setTechInput] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      // Try to load from localStorage first (for unsaved changes)
      const localData = localStorage.getItem('portfolio_projects');
      if (localData) {
        const parsed = JSON.parse(localData);
        setProjects(parsed.projects || parsed);
        return;
      }
      
      // Fall back to JSON file
      const data = await import('@/data/projects.json');
      setProjects(data.projects);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  }

  const saveToLocal = (updatedProjects: Project[]) => {
    localStorage.setItem('portfolio_projects', JSON.stringify({ projects: updatedProjects }));
    setProjects(updatedProjects);
    setMessage({ type: 'success', text: 'Tersimpan di browser! Klik "Export JSON" untuk menyimpan permanen.' });
    setTimeout(() => setMessage(null), 3000);
  };

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData(project);
    } else {
      setEditingProject(null);
      setFormData({ ...emptyProject, id: Date.now() });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData(emptyProject);
    setTechInput('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'stars' || name === 'forks' ? parseInt(value) || 0 : value,
    }));

    if (name === 'language') {
      setFormData((prev) => ({
        ...prev,
        languageColor: languageColors[value] || '#3178C6',
      }));
    }
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()],
      }));
      setTechInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  const handleSave = () => {
    let updatedProjects: Project[];
    if (editingProject) {
      updatedProjects = projects.map((p) => (p.id === editingProject.id ? formData : p));
    } else {
      updatedProjects = [...projects, formData];
    }
    saveToLocal(updatedProjects);
    closeModal();
  };

  const handleDelete = (id: number) => {
    if (!confirm('Yakin ingin menghapus project ini?')) return;
    const updatedProjects = projects.filter((p) => p.id !== id);
    saveToLocal(updatedProjects);
  };

  const exportJSON = () => {
    const json = JSON.stringify({ projects }, null, 2);
    return json;
  };

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
    a.download = 'projects.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetToOriginal = async () => {
    if (!confirm('Yakin ingin reset ke data original? Perubahan yang belum di-export akan hilang.')) return;
    localStorage.removeItem('portfolio_projects');
    const data = await import('@/data/projects.json');
    setProjects(data.projects);
    setMessage({ type: 'success', text: 'Data berhasil di-reset!' });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-slate-400">Kelola project portfolio Anda</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export JSON
          </button>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            Tambah Project
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
        💡 <strong>Cara menyimpan:</strong> Perubahan disimpan di browser. Untuk menyimpan permanen, klik "Export JSON" lalu salin isi ke file <code className="px-1 bg-slate-800 rounded">/data/projects.json</code>
      </div>

      {/* Projects Table */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">Project</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 hidden md:table-cell">Technologies</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300 hidden sm:table-cell">Language</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-700"
                      />
                      <div>
                        <p className="font-medium text-white">{project.title}</p>
                        <p className="text-sm text-slate-400 line-clamp-1">{project.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-400">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: project.languageColor }}
                      />
                      <span className="text-sm text-slate-300">{project.language}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-slate-400 hover:text-cyan-400 transition-colors"
                        title="View Live"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => openModal(project)}
                        className="p-2 text-slate-400 hover:text-amber-400 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    Belum ada project. Klik "Tambah Project" untuk menambahkan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-4 text-center">
        <button
          onClick={resetToOriginal}
          className="text-sm text-slate-500 hover:text-red-400 transition-colors"
        >
          Reset ke data original
        </button>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">
                {editingProject ? 'Edit Project' : 'Tambah Project Baru'}
              </h2>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="my-awesome-project"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Short Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Deskripsi singkat project"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Description</label>
                <textarea
                  name="fullDescription"
                  value={formData.fullDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                  placeholder="Deskripsi lengkap project"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Image URL</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="https://... atau generate dari Live URL"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.live) {
                        const encodedUrl = encodeURIComponent(formData.live);
                        const screenshotUrl = `https://s0.wordpress.com/mshots/v1/${encodedUrl}?w=1280&h=720`;
                        setFormData((prev) => ({ ...prev, image: screenshotUrl }));
                      } else {
                        alert('Masukkan Live URL terlebih dahulu untuk generate screenshot!');
                      }
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white rounded-xl hover:opacity-90 whitespace-nowrap"
                    title="Generate screenshot dari Live URL"
                  >
                    🖼️ Generate
                  </button>
                </div>
                <p className="text-xs text-slate-500 mb-2">
                  💡 Klik "Generate" untuk membuat screenshot otomatis dari Live URL menggunakan WordPress mshots
                </p>
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-lg bg-slate-700" />
                )}
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Technologies</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                    className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Tambah technology (Enter)"
                  />
                  <button
                    type="button"
                    onClick={addTechnology}
                    className="px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="flex items-center gap-1 px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-sm text-cyan-400"
                    >
                      {tech}
                      <button onClick={() => removeTechnology(tech)} className="hover:text-red-400">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Language</label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {Object.keys(languageColors).map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Language Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      name="languageColor"
                      value={formData.languageColor}
                      onChange={handleInputChange}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.languageColor}
                      readOnly
                      className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">GitHub URL</label>
                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Live URL</label>
                  <input
                    type="url"
                    name="live"
                    value={formData.live}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Stars & Forks */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Stars</label>
                  <input
                    type="number"
                    name="stars"
                    value={formData.stars}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Forks</label>
                  <input
                    type="number"
                    name="forks"
                    value={formData.forks}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-700">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.title}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Simpan
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
              <button onClick={() => setIsExportModalOpen(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 flex-1 overflow-auto">
              <p className="text-slate-400 text-sm">
                Salin JSON di bawah ini dan paste ke file <code className="px-2 py-1 bg-slate-900 rounded text-cyan-400">/data/projects.json</code>
              </p>
              
              <pre className="p-4 bg-slate-900 rounded-xl text-sm text-slate-300 overflow-auto max-h-80 font-mono">
                {exportJSON()}
              </pre>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-700">
              <button
                onClick={downloadJSON}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600"
              >
                <Download className="w-4 h-4" />
                Download File
              </button>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:opacity-90"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
