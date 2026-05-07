/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Dna, FlaskConical, Atom, Calculator, Cpu, Library, HardDriveDownload, BookOpen, BadgeCheck, XCircle } from 'lucide-react';
import { mockArchives } from './data/mockArchives';
import { ArchiveItem, ArchiveCategory } from './types';
import { motion, AnimatePresence } from 'motion/react';

const TypeIcon = ({ type, className, size = 24 }: { type: string, className?: string, size?: number }) => {
  // NOTE: If you decide to use Google Drive image URLs, you must use the `uc?export=view` format.
  // Instead of the share link: https://drive.google.com/file/d/FILE_ID/view
  // Use this formatted URL:     https://drive.google.com/uc?export=view&id=FILE_ID
  const getIconPath = () => {
    switch (type.toLowerCase()) {
      case 'posn': return 'https://drive.google.com/thumbnail?id=1bYZ03JwDRCJODvH9CIPRMazYqItUBrtv&sz=w400';
      default: return 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=128&q=80';
    }
  };

  return (
    <img 
      src={getIconPath()} 
      alt={`${type} icon`} 
      className={`${className || ''} rounded-md object-cover`} 
      style={{ width: size, height: size }} 
      referrerPolicy="no-referrer"
      onError={(e) => {
        // Fallback to default if image fails to load (often due to Google Drive permissions)
        const target = e.target as HTMLImageElement;
        target.onerror = null; // Prevent infinite loop
        target.src = 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=128&q=80';
      }}
    />
  );
};

const DifficultyBar = ({ level }: { level: number }) => {
  return (
    <div className="flex items-center gap-1.5 shrink-0 border-l border-neutral-200 pl-3" title={`Difficulty: ${level}/5`}>
      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest hidden sm:inline">Difficulty</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <div 
            key={i} 
            className={`w-1.5 h-3 rounded-[1px] ${i <= level ? (level > 3 ? 'bg-rose-500' : level > 2 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-neutral-200'}`}
          />
        ))}
      </div>
    </div>
  );
};

const handleMockDownload = (item: ArchiveItem) => {
  // Create a mock blob of data to act as the "download" file
  const element = document.createElement("a");
  const file = new Blob(
    [
      `DIGITAL ARCHIVE EXPORT\n\nID: ${item.id}\nTitle: ${item.title}\nCategory: ${item.category}\nDate Added: ${item.dateAdded}\n\nDescription: ${item.description}\n\n[End of File - Mock Archive]`
    ], 
    {type: 'text/plain'}
  );
  element.href = URL.createObjectURL(file);
  element.download = `${item.id}-${item.title.replace(/\\s+/g, '-').toLowerCase()}.txt`;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
  document.body.removeChild(element);
};

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'about'>('home');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ArchiveCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<'default' | 'year-desc' | 'year-asc' | 'difficulty-desc' | 'difficulty-asc'>('default');
  const [showDifficulty, setShowDifficulty] = useState(false);
  
  const categories: (ArchiveCategory | 'All')[] = ['All', 'Mathematics', 'Biology', 'Chemistry', 'Physics'];

  const filteredArchives = mockArchives.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'year-desc': return b.yearPublished - a.yearPublished;
      case 'year-asc': return a.yearPublished - b.yearPublished;
      case 'difficulty-desc': return b.difficulty - a.difficulty;
      case 'difficulty-asc': return a.difficulty - b.difficulty;
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-neutral-900 text-white p-2 rounded-lg">
                <Library size={24} />
              </div>
              <div>
                <h1 className="font-semibold text-lg leading-tight tracking-tight text-neutral-900">uunknown</h1>
                <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Exam Archive</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button onClick={() => setCurrentView('home')} className={`text-sm font-medium transition-colors ${currentView === 'home' ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}>Home</button>
              <button onClick={() => setCurrentView('about')} className={`text-sm font-medium transition-colors ${currentView === 'about' ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-900'}`}>About Me</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {currentView === 'about' ? (
          <section className="max-w-3xl mx-auto py-12 px-4 sm:px-0 flex flex-col gap-8 w-full">
            <h2 className="text-3xl font-semibold text-neutral-900 tracking-tight">About Me</h2>
            <div className="prose prose-neutral max-w-none text-neutral-700">
              <p className="text-lg">
                Hello! I am the creator and curator of the Scholar Academic Archive. My passion lies in 
                democratizing access to scientific knowledge, making peer-reviewed papers, experimental datasets, 
                and breakthrough research available to everyone, everywhere.
              </p>
              <div className="my-8 flex gap-4">
                <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=400&q=80" alt="Library" className="rounded-xl w-1/2 object-cover" />
                <img src="https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80" alt="Books" className="rounded-xl w-1/2 object-cover" />
              </div>
              <h3>Mission</h3>
              <p>
                Our mission is to index the world's most critical scientific papers and experimental datasets 
                with open access forever. We organize them by discipline—from theoretical physics to modern biology—and 
                ensure they are searchable and easy to download.
              </p>
              <h3>Contact</h3>
              <p>
                If you have questions, contributions, or just want to discuss science, feel free to reach out. 
                Keep exploring!
              </p>
            </div>
          </section>
        ) : (
          <>
        {/* Controls */}
        <section className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-2 bg-neutral-200/50 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'bg-white text-neutral-900 shadow-sm' 
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-neutral-900 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="ค้นหาข้อสอบโดยพิมพ์ ชื่อ, tag, ฯลฯ"
            className="w-full bg-white border border-neutral-300 rounded-xl py-4 pl-12 pr-4 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Archive Grid/List */}
        <section className="pb-24">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 border-b border-neutral-200 pb-4">
            <h3 className="text-xl font-semibold">Results ({filteredArchives.length})</h3>
            
            <div className="flex flex-wrap gap-4 items-center">
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-600 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={showDifficulty} 
                  onChange={(e) => setShowDifficulty(e.target.checked)} 
                  className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 w-4 h-4 cursor-pointer"
                />
                เเสดงความยาก
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-neutral-200 text-neutral-700 text-sm rounded-lg focus:ring-neutral-900 focus:border-neutral-900 block w-full sm:w-auto p-2 outline-none shadow-sm font-medium"
              >
                <option value="default">เรียงปกติ</option>
                <option value="year-desc">Newest</option>
                <option value="year-asc">Oldest</option>
                <option value="difficulty-desc">Hardest</option>
                <option value="difficulty-asc">Easiest</option>
              </select>
            </div>
          </div>

          {filteredArchives.length === 0 ? (
            <div className="text-center py-24 bg-white border border-neutral-200 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 text-neutral-500">
              <Search size={48} className="text-neutral-300" />
              <p className="text-lg">No archives found matching your criteria.</p>
              <button 
                onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
                className="text-neutral-900 font-medium hover:underline focus:outline-none"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <motion.div 
              layout 
              className="flex flex-col gap-3"
            >
              <AnimatePresence>
                {filteredArchives.map((item) => (
                  <motion.div
                    key={item.id}
                    layoutId={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="bg-white border border-neutral-200 rounded-xl overflow-hidden hover:border-neutral-400 transition-colors shadow-sm focus-within:ring-2 focus-within:ring-neutral-900 flex items-center p-3 gap-4"
                  >
                    <div className="shrink-0 hidden sm:block">
                      <TypeIcon type={item.type} size={48} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-medium text-neutral-900 truncate">{item.title}</h4>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider shrink-0">{item.category}</span>
                        <div className="flex flex-wrap gap-1.5 shrink-0">
                          {item.tags.map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 bg-neutral-100 text-neutral-600 text-[10px] font-mono rounded-md">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        {showDifficulty && <DifficultyBar level={item.difficulty} />}
                      </div>
                    </div>

                    <div className="shrink-0 pl-2 flex items-center gap-4">
                      {!item.isOfficialSource && (
                        <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-md text-[10px] uppercase tracking-wider font-semibold border border-amber-200 shrink-0" title="Unofficial Source">
                          <span>ข้อสอบจากการจำ</span>
                        </div>
                      )}
                      <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 px-2 py-1 rounded-md shrink-0 border border-neutral-200">
                        {item.yearPublished}
                      </span>
                      {item.downloadUrl ? (
                        <a
                          href={item.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center bg-neutral-900 hover:bg-neutral-800 text-white p-2 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                          title="Download External Link"
                        >
                          <HardDriveDownload size={16} className="sm:mr-2" />
                          <span className="hidden sm:inline">Download</span>
                        </a>
                      ) : (
                        <button
                          onClick={() => handleMockDownload(item)}
                          className="flex items-center justify-center bg-neutral-900 hover:bg-neutral-800 text-white p-2 sm:px-4 sm:py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                          title="Download Mock"
                        >
                          <HardDriveDownload size={16} className="sm:mr-2" />
                          <span className="hidden sm:inline">Download</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
        </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="bg-neutral-200 text-neutral-500 p-2 rounded-md">
                <Library size={20} />
              </div>
              <p className="text-neutral-500 text-sm">เว็บไซต์รวมข้อสอบของพรรค uunknown</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
