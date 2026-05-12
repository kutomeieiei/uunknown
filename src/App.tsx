/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, Dna, FlaskConical, Atom, Calculator, Cpu, Library, HardDriveDownload, BookOpen, BadgeCheck, XCircle, ChevronDown, ExternalLink, ArrowLeft, Sun, Moon, Menu, X } from 'lucide-react';
import { mockArchives } from './data/mockArchives';
import { externalLinks } from './data/externalLinks';
import { ArchiveItem, ArchiveCategory } from './types';
import { motion, AnimatePresence } from 'motion/react';

const TypeIcon = ({ type, className, size = 24 }: { type: string, className?: string, size?: number }) => {
  // NOTE: If you decide to use Google Drive image URLs, you must use the `uc?export=view` format.
  // Instead of the share link: https://drive.google.com/file/d/FILE_ID/view
  // Use this formatted URL:     https://drive.google.com/uc?export=view&id=FILE_ID
  const getIconPath = () => {
    switch (type.toLowerCase()) {
      case 'posn': return 'https://drive.google.com/thumbnail?id=1bYZ03JwDRCJODvH9CIPRMazYqItUBrtv&sz=w400';
      case 'tcas': return 'https://drive.google.com/thumbnail?id=1eS1Q7O3FyDwqGsm64DZxN6TBrOaoUMfI';
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
    <div className="flex items-center gap-1.5 shrink-0 border-l border-neutral-200 dark:border-neutral-800 pl-3" title={`Difficulty: ${level}/5`}>
      <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest hidden sm:inline">Difficulty</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <div 
            key={i} 
            className={`w-1.5 h-3 rounded-[1px] ${i <= level ? (level > 3 ? 'bg-rose-500 dark:bg-rose-600' : level > 2 ? 'bg-amber-500 dark:bg-amber-600' : 'bg-emerald-500 dark:bg-emerald-600') : 'bg-neutral-200 dark:bg-neutral-800'}`}
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
  const [currentView, setCurrentView] = useState<'home' | 'exams' | 'about' | 'more-exams'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ArchiveCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<'default' | 'year-desc' | 'year-asc' | 'difficulty-desc' | 'difficulty-asc'>('default');
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  const categories: (ArchiveCategory | 'All')[] = ['All', 'Mathematics', 'Biology', 'Chemistry', 'Physics'];

  const sortOptions = [
    { id: 'default', label: 'เรียงปกติ' },
    { id: 'year-desc', label: 'Newest' },
    { id: 'year-asc', label: 'Oldest' },
    { id: 'difficulty-desc', label: 'Hardest' },
    { id: 'difficulty-asc', label: 'Easiest' },
  ];

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
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-neutral-900 dark:bg-neutral-800 text-white dark:text-neutral-300 p-2 rounded-lg transition-colors">
                <Library size={24} />
              </div>
              <div>
                <h1 className="font-semibold text-lg leading-tight tracking-tight text-neutral-900 dark:text-neutral-300 transition-colors">uunknown</h1>
                <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-500 uppercase tracking-widest transition-colors">Exam Archive</p>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-4">
              <button onClick={() => setCurrentView('home')} className={`text-sm font-medium transition-colors ${currentView === 'home' ? 'text-neutral-900 dark:text-neutral-300' : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-300'}`}>Home</button>
              <button onClick={() => setCurrentView('exams')} className={`text-sm font-medium transition-colors ${currentView === 'exams' ? 'text-neutral-900 dark:text-neutral-300' : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-300'}`}>Exams</button>
              <button onClick={() => setCurrentView('about')} className={`text-sm font-medium transition-colors ${currentView === 'about' ? 'text-neutral-900 dark:text-neutral-300' : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-300'}`}>About Me</button>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 ml-2"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>

            {/* Mobile Nav Toggle */}
            <div className="flex sm:hidden items-center gap-2">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-4">
                <button 
                  onClick={() => { setCurrentView('home'); setIsMobileMenuOpen(false); }} 
                  className={`text-left text-base font-medium transition-colors ${currentView === 'home' ? 'text-neutral-900 dark:text-neutral-300' : 'text-neutral-500 dark:text-neutral-500'}`}
                >
                  Home
                </button>
                <button 
                  onClick={() => { setCurrentView('exams'); setIsMobileMenuOpen(false); }} 
                  className={`text-left text-base font-medium transition-colors ${currentView === 'exams' ? 'text-neutral-900 dark:text-neutral-300' : 'text-neutral-500 dark:text-neutral-500'}`}
                >
                  Exams
                </button>
                <button 
                  onClick={() => { setCurrentView('about'); setIsMobileMenuOpen(false); }} 
                  className={`text-left text-base font-medium transition-colors ${currentView === 'about' ? 'text-neutral-900 dark:text-neutral-300' : 'text-neutral-500 dark:text-neutral-500'}`}
                >
                  About Me
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.section 
              key="home"
              initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="py-20 flex flex-col items-center text-center justify-center min-h-[60vh] max-w-3xl mx-auto w-full gap-8"
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-neutral-300 tracking-tight leading-tight transition-colors">
                ยินดีต้อนรับสู่ <br/> <span className="text-neutral-500 dark:text-neutral-500">Exam Archive</span>
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-500 max-w-xl transition-colors">
                ค้นหาและดาวน์โหลดข้อสอบเก่าและข้อสอบแข่งขันต่างๆ ได้ที่นี่ เราได้รวบรวมข้อสอบที่น่าสนใจมาไว้ให้คุณแล้ว
              </p>
              <button 
                onClick={() => setCurrentView('exams')}
                className="mt-4 px-8 py-4 bg-neutral-900 dark:bg-neutral-800 text-white dark:text-neutral-300 rounded-xl font-medium hover:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors shadow-lg shadow-neutral-900/20 dark:shadow-black/10 active:scale-95"
              >
                เริ่มค้นหาข้อสอบ
              </button>
            </motion.section>
          )}

          {currentView === 'about' && (
            <motion.section 
              key="about"
              initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="max-w-3xl mx-auto py-12 px-4 sm:px-0 flex flex-col gap-8 w-full"
            >
            <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-300 tracking-tight transition-colors">About Me</h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-400 transition-colors">
              <p className="text-lg">
                ok doraymifasol
              </p>
              <div className="my-8 flex gap-4">
                <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=400&q=80" alt="Library" className="rounded-xl w-1/2 object-cover" />
                <img src="https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80" alt="Books" className="rounded-xl w-1/2 object-cover" />
              </div>
              <h3>Mission</h3>
              <p>
                skibidi skibidi
              </p>
              <h3>Contact</h3>
              <p>
                tornado tornado
              </p>
            </div>
            </motion.section>
          )}

          {currentView === 'exams' && (
            <motion.div
              key="exams"
              initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-col gap-8 w-full"
            >
        {/* Controls */}
        <section className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-2 bg-neutral-200/50 dark:bg-neutral-900 p-1 rounded-lg w-full sm:w-auto overflow-x-auto transition-colors">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'text-neutral-900 dark:text-neutral-200' 
                    : 'text-neutral-600 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                }`}
              >
                {selectedCategory === cat && (
                  <motion.div
                    layoutId="active-category"
                    className="absolute inset-0 bg-white dark:bg-neutral-800 rounded-md shadow-sm"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="relative group flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-600 group-focus-within:text-neutral-900 dark:group-focus-within:text-neutral-400 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="ค้นหาข้อสอบโดยพิมพ์ ชื่อ, tag, ฯลฯ"
              className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl py-3 pl-12 pr-4 text-neutral-900 dark:text-neutral-300 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-700 focus:border-transparent transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setCurrentView('more-exams')}
            className="px-4 py-2 text-sm bg-neutral-900 dark:bg-neutral-800 text-white dark:text-neutral-300 rounded-lg font-medium hover:bg-neutral-800 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0 active:scale-95"
          >
            ข้อสอบเพิ่มเติม
          </button>
        </div>

        {/* Archive Grid/List */}
        <section className="pb-24">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-4 transition-colors">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-300 transition-colors">ผลลัพธ์ ({filteredArchives.length} รายการ)</h3>
            
            <div className="flex flex-wrap gap-4 items-center">
              <label className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-500 cursor-pointer select-none transition-colors">
                <input 
                  type="checkbox" 
                  checked={showDifficulty} 
                  onChange={(e) => setShowDifficulty(e.target.checked)} 
                  className="rounded border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-400 focus:ring-neutral-900 dark:focus:ring-neutral-600 w-4 h-4 cursor-pointer"
                />
                เเสดงความยาก
              </label>
              <div className="relative w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-700 flex items-center justify-between gap-2 w-full sm:w-36 px-3 py-2 shadow-sm font-medium transition-all"
                >
                  <span>{sortOptions.find((o) => o.id === sortBy)?.label || 'เรียงปกติ'}</span>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isSortOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-full sm:w-48 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg z-20 py-1.5 overflow-hidden origin-top-right transition-colors"
                      >
                        {sortOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => {
                              setSortBy(option.id as any);
                              setIsSortOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                              sortBy === option.id
                                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-300 font-medium'
                                : 'text-neutral-600 dark:text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-300'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {filteredArchives.length === 0 ? (
            <div className="text-center py-24 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 text-neutral-500 dark:text-neutral-500 transition-colors">
              <Search size={48} className="text-neutral-300 dark:text-neutral-700" />
              <p className="text-lg">No archives found matching your criteria.</p>
              <button 
                onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
                className="text-neutral-900 dark:text-neutral-300 font-medium hover:underline focus:outline-none"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <motion.div 
              layout 
              className="flex flex-col gap-3"
            >
              <AnimatePresence mode="popLayout">
                {filteredArchives.map((item) => (
                  <motion.div
                    key={item.id}
                    layoutId={item.id}
                    layout="position"
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                    transition={{
                      layout: { type: 'spring', bounce: 0.2, duration: 0.6 },
                      opacity: { duration: 0.2 },
                      y: { type: 'spring', bounce: 0, duration: 0.4 },
                      scale: { duration: 0.2 }
                    }}
                    className="bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800/50 rounded-xl overflow-hidden hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors shadow-sm focus-within:ring-2 focus-within:ring-neutral-900 dark:focus-within:ring-neutral-700 p-4 sm:p-3 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="shrink-0 sm:block">
                        <div className="sm:hidden mt-0.5">
                          <TypeIcon type={item.type} size={40} />
                        </div>
                        <div className="hidden sm:block">
                          <TypeIcon type={item.type} size={48} />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base sm:text-lg font-medium text-neutral-900 dark:text-neutral-300 leading-snug truncate sm:whitespace-normal line-clamp-2 transition-colors">{item.title}</h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 sm:mt-1.5">
                          <span className="text-[10px] sm:text-xs font-mono text-neutral-500 dark:text-neutral-500 uppercase tracking-wider shrink-0 transition-colors">{item.category}</span>
                          <div className="flex flex-wrap gap-1.5 shrink-0">
                            {item.tags.map(tag => (
                              <span key={tag} className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-[10px] font-mono rounded-md border border-neutral-200/60 dark:border-neutral-700/60 transition-colors">
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <div className="hidden sm:block">
                            {showDifficulty && <DifficultyBar level={item.difficulty} />}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-3 sm:pt-0 mt-1 sm:mt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800/50 transition-colors">
                      <div className="flex items-center gap-2">
                        {!item.isOfficialSource && (
                          <div className="flex items-center gap-1 text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-md text-[10px] uppercase tracking-wider font-semibold border border-amber-200 dark:border-amber-900/50 shrink-0 transition-colors" title="Unofficial Source">
                            <span>ข้อสอบจากการจำ</span>
                          </div>
                        )}
                        <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800/50 px-2 py-1 rounded-md shrink-0 border border-neutral-200 dark:border-neutral-700/50 transition-colors">
                          {item.yearPublished}
                        </span>
                        <div className="sm:hidden">
                          {showDifficulty && <DifficultyBar level={item.difficulty} />}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.solutionUrl && (
                          <a
                            href={item.solutionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/50 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-300 py-2 px-3 sm:px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer shrink-0"
                            title="View Solution"
                          >
                            <span>เฉลย</span>
                          </a>
                        )}
                        {item.downloadUrl ? (
                          <a
                            href={item.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center bg-neutral-900 dark:bg-neutral-800 hover:bg-neutral-800 dark:hover:bg-neutral-700 text-white dark:text-neutral-300 py-2 px-3 sm:px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer shrink-0"
                            title="Download External Link"
                          >
                            <span>Download</span>
                          </a>
                        ) : (
                          <button
                            onClick={() => handleMockDownload(item)}
                            className="flex items-center justify-center bg-neutral-900 dark:bg-neutral-800 hover:bg-neutral-800 dark:hover:bg-neutral-700 text-white dark:text-neutral-300 py-2 px-3 sm:px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer shrink-0"
                            title="Download Mock"
                          >
                            <span>Download</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
        </motion.div>
        )}
          {currentView === 'more-exams' && (
            <motion.section 
              key="more-exams"
              initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="py-12 flex flex-col items-center justify-center min-h-[50vh] w-full gap-8 max-w-3xl mx-auto relative"
            >
              <div className="w-full flex justify-start -mt-8 sm:-mt-12">
                <button 
                  onClick={() => setCurrentView('exams')}
                  className="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-300 bg-neutral-100 dark:bg-neutral-800/50 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg font-medium transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} />
                  กลับไปหน้าข้อสอบหลัก
                </button>
              </div>

              <div className="text-center">
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-300 mb-2 transition-colors">ข้อสอบเพิ่มเติม</h2>
                <p className="text-neutral-600 dark:text-neutral-500 max-w-xl mx-auto transition-colors">
                  หน้านี้จะรวมข้อสอบที่มาจากแหล่งอื่นๆ หรือกำลังอยู่ในช่วงรวบรวม
                </p>
              </div>

              <div className="w-full flex justify-center">
                <div className="flex flex-col gap-4 w-full">
                  {externalLinks.map((link) => (
                    <div key={link.id} className="w-full bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800/50 rounded-2xl p-5 sm:p-6 shadow-sm hover:border-neutral-400 dark:hover:border-neutral-700 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-left group">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-300 line-clamp-1 transition-colors">{link.title}</h3>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {link.subjects && link.subjects.map(sub => (
                              <span key={sub} className="text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded-full whitespace-nowrap transition-colors">
                                {sub}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-500 transition-colors">{link.description}</p>
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-100 dark:bg-neutral-800/50 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-300 rounded-xl text-sm font-medium transition-colors sm:shrink-0"
                      >
                        <span>ไปที่เว็บไซต์</span>
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-12 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 p-2 rounded-md transition-colors">
                <Library size={20} />
              </div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm transition-colors">เว็บไซต์รวมข้อสอบของพรรค uunknown</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
