/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Search,
  Dna,
  FlaskConical,
  Atom,
  Calculator,
  Cpu,
  Library,
  HardDriveDownload,
  BookOpen,
  BadgeCheck,
  XCircle,
  ChevronDown,
  ExternalLink,
  ArrowLeft,
  MoreVertical,
  Mic,
  Copyright,
  Instagram,
} from "lucide-react";
import { mockArchives } from "./data/mockArchives";
import { externalLinks } from "./data/externalLinks";
import { portfolioLinks } from "./data/portfolioLinks";
import { ImageSlider } from "./components/ImageSlider";
import { University } from "./components/University";
import { ArchiveItem, ArchiveCategory } from "./types";
import { motion, AnimatePresence } from "motion/react";

const TypeIcon = ({
  type,
  className,
  size = 24,
}: {
  type: string;
  className?: string;
  size?: number;
}) => {
  // NOTE: If you decide to use Google Drive image URLs, you must use the `uc?export=view` format.
  // Instead of the share link: https://drive.google.com/file/d/FILE_ID/view
  // Use this formatted URL:     https://drive.google.com/uc?export=view&id=FILE_ID
  const getIconPath = () => {
    switch (type.toLowerCase()) {
      case "posn":
        return "https://drive.google.com/thumbnail?id=1bYZ03JwDRCJODvH9CIPRMazYqItUBrtv&sz=w400";
      case "tcas":
        return "https://drive.google.com/thumbnail?id=1eS1Q7O3FyDwqGsm64DZxN6TBrOaoUMfI";
      default:
        return "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=128&q=80";
    }
  };

  return (
    <img
      src={getIconPath()}
      alt={`${type} icon`}
      className={`${className || ""} rounded-md object-cover`}
      style={{ width: size, height: size }}
      referrerPolicy="no-referrer"
      onError={(e) => {
        // Fallback to default if image fails to load (often due to Google Drive permissions)
        const target = e.target as HTMLImageElement;
        target.onerror = null; // Prevent infinite loop
        target.src =
          "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=128&q=80";
      }}
    />
  );
};

const DifficultyBar = ({ level }: { level: number }) => {
  return (
    <div
      className="flex items-center gap-1.5 shrink-0 border-l border-neutral-200 dark:border-neutral-800 pl-3"
      title={`Difficulty: ${level}/5`}
    >
      <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest hidden sm:inline">
        Difficulty
      </span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-1.5 h-3 rounded-[1px] ${i <= level ? (level > 3 ? "bg-rose-500 dark:bg-rose-600" : level > 2 ? "bg-amber-500 dark:bg-amber-600" : "bg-emerald-500 dark:bg-emerald-600") : "bg-neutral-200 dark:bg-neutral-800"}`}
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
      `DIGITAL ARCHIVE EXPORT\n\nID: ${item.id}\nTitle: ${item.title}\nCategory: ${item.category}\nDate Added: ${item.dateAdded}\n\nDescription: ${item.description}\n\n[End of File - Mock Archive]`,
    ],
    { type: "text/plain" },
  );
  element.href = URL.createObjectURL(file);
  element.download = `${item.id}-${item.title.replace(/\\s+/g, "-").toLowerCase()}.txt`;
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
  document.body.removeChild(element);
};

export default function App() {
  const [currentView, setCurrentView] = useState<
    "home" | "exams" | "about" | "more-exams" | "portfolio" | "university"
  >("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sourceType, setSourceType] = useState<"All" | "Official" | "Unofficial">("All");
  const [selectedExamType, setSelectedExamType] = useState<string>("All");
  const [portfolioSearch, setPortfolioSearch] = useState("");
  const [selectedPortfolioTag, setSelectedPortfolioTag] = useState<string>("All");

  const allPortfolioTags = ["All", ...Array.from(new Set(portfolioLinks.flatMap(link => link.tags)))];

  const additionalPortfolioSources = [
    {
      id: "1",
      title: "TCAS Portfolio",
      url: "https://www.mytcas.com/",
      description: "รวมตัวอย่างพอร์ตโฟลิโอสำหรับยื่น TCAS",
      tags: ["TCAS", "Official"]
    },
    {
      id: "2",
      title: "Dek-D Portfolio",
      url: "https://www.dek-d.com/portfolio/",
      description: "แหล่งรวมพอร์ตโฟลิโอและบทความแนะนำการทำพอร์ตจากเว็บไซต์ Dek-D",
      tags: ["Guide", "Examples"]
    },
    {
      id: "3",
      title: "Pinterest - Portfolio Design",
      url: "https://www.pinterest.com/search/pins/?q=portfolio%20design%20university",
      description: "รวมไอเดียการออกแบบพอร์ตโฟลิโอให้สวยงามและน่าสนใจ",
      tags: ["Design", "Ideas"]
    }
  ];

  const filteredPortfolioLinks = portfolioLinks.filter((link) => {
    const matchesSearch =
      portfolioSearch === "" ||
      (link.ownerName && link.ownerName.toLowerCase().includes(portfolioSearch.toLowerCase())) ||
      (link.title && link.title.toLowerCase().includes(portfolioSearch.toLowerCase())) ||
      (link.targetFacultyAndUni && link.targetFacultyAndUni.toLowerCase().includes(portfolioSearch.toLowerCase())) ||
      (link.description && link.description.toLowerCase().includes(portfolioSearch.toLowerCase())) ||
      link.tags.some(tag => tag.toLowerCase().includes(portfolioSearch.toLowerCase()));

    const matchesTag =
      selectedPortfolioTag === "All" ||
      link.tags.includes(selectedPortfolioTag);

    return matchesSearch && matchesTag;
  });

  const categories = [
    "All",
    "รวมทุกวิชา",
    "คณิตศาสตร์",
    "ฟิสิกส์",
    "เคมี",
    "ชีววิทยา",
  ];

  const examTypes = [
    "All",
    "สอวน. (POSN)",
    "TCAS / A-Level",
    "อื่น ๆ",
  ];

  const filteredExternalLinks = externalLinks.filter((link) => {
    const matchesSearch =
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (link.subjects &&
        link.subjects.some((sub) =>
          sub.toLowerCase().includes(searchTerm.toLowerCase()),
        ));
    const matchesCategory =
      selectedCategory === "All" ||
      (link.subjects && link.subjects.includes(selectedCategory));
    
    let matchesSource = true;
    if (sourceType === "Official") {
      matchesSource = link.isOfficialSource === true;
    } else if (sourceType === "Unofficial") {
      matchesSource = link.isOfficialSource !== true;
    }

    let matchesExamType = true;
    if (selectedExamType !== "All") {
      if (selectedExamType === "อื่น ๆ") {
        matchesExamType = !link.examTypes || link.examTypes.every(et => et !== "สอวน. (POSN)" && et !== "TCAS / A-Level");
      } else {
        matchesExamType = link.examTypes ? link.examTypes.includes(selectedExamType) : false;
      }
    }

    return matchesSearch && matchesCategory && matchesSource && matchesExamType;
  });

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 z-[-1] pointer-events-none select-none flex justify-center">
        {/* Edge Glows */}
        <div className="absolute top-[10%] left-[-15%] w-[40%] h-[600px] bg-red-600/10 dark:bg-red-900/15 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-15%] w-[40%] h-[600px] bg-rose-600/10 dark:bg-rose-900/15 rounded-full blur-[120px]"></div>

        {/* Vertical Watermark Text (Visible on wide screens) */}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#050505]/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <img src="https://cdn.discordapp.com/attachments/1455582752484229140/1506688504866930918/image.png?ex=6a0f2c84&is=6a0ddb04&hm=053e95d76d2f01b0c77bd120a34d5bdd72892d8c364d462e937140bdf446356e&" alt="Profile" className="w-full h-full object-cover" /> 
              </div>
              <div className="flex flex-col">
                <h1 className="font-bold text-2xl leading-none text-neutral-900 dark:text-neutral-100 transition-colors">
                  Oripius
                </h1>
                <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 transition-colors mt-0.5">
                  Hope and Dream
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-4">
              <button
                onClick={() => setCurrentView("home")}
                className={`text-sm font-bold transition-colors ${currentView === "home" ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"}`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentView("exams")}
                className={`text-sm font-bold transition-colors ${currentView === "exams" ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"}`}
              >
                Exams
              </button>
              <button
                onClick={() => setCurrentView("portfolio")}
                className={`text-sm font-bold transition-colors ${currentView === "portfolio" ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"}`}
              >
                Portfolio
              </button>
              <button
                onClick={() => setCurrentView("university")}
                className={`text-sm font-bold transition-colors ${currentView === "university" ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"}`}
              >
                University
              </button>
              <button
                onClick={() => setCurrentView("about")}
                className={`text-sm font-bold transition-colors ${currentView === "about" ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"}`}
              >
                About Me
              </button>
            </div>

            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                aria-label="Toggle mobile menu"
              >
                <MoreVertical size={28} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-4">
                <button
                  onClick={() => {
                    setCurrentView("home");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left text-base font-medium transition-colors ${currentView === "home" ? "text-neutral-900 dark:text-neutral-300" : "text-neutral-500 dark:text-neutral-500"}`}
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setCurrentView("exams");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left text-base font-medium transition-colors ${currentView === "exams" ? "text-neutral-900 dark:text-neutral-300" : "text-neutral-500 dark:text-neutral-500"}`}
                >
                  Exams
                </button>
                <button
                  onClick={() => {
                    setCurrentView("portfolio");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left text-base font-medium transition-colors ${currentView === "portfolio" ? "text-neutral-900 dark:text-neutral-300" : "text-neutral-500 dark:text-neutral-500"}`}
                >
                  Portfolio
                </button>
                <button
                  onClick={() => {
                    setCurrentView("university");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left text-base font-medium transition-colors ${currentView === "university" ? "text-neutral-900 dark:text-neutral-300" : "text-neutral-500 dark:text-neutral-500"}`}
                >
                  University
                </button>
                <button
                  onClick={() => {
                    setCurrentView("about");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left text-base font-medium transition-colors ${currentView === "about" ? "text-neutral-900 dark:text-neutral-300" : "text-neutral-500 dark:text-neutral-500"}`}
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
          {currentView === "home" && (
            <motion.section
              key="home"
              initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col items-center justify-start w-[100vw] relative left-1/2 -translate-x-1/2 -mt-8 min-h-[70vh]"
            >
              {/* Top Section */}
              <div className="w-[100vw] relative left-1/2 -translate-x-1/2 bg-neutral-50 dark:bg-[#050505] text-neutral-900 dark:text-white pt-24 pb-8 flex flex-col items-center z-[40]">
                {/* Ambient Background Glow Container */}
                <div className="absolute inset-0 overflow-visible pointer-events-none z-[25]">
                  <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[350px] bg-red-500/10 dark:bg-red-900/15 rounded-full blur-[100px]"></div>
                  <div className="absolute bottom-[-15%] right-[-15%] w-[45%] h-[350px] bg-rose-500/10 dark:bg-rose-900/15 rounded-full blur-[120px]"></div>
                </div>

                <div className="text-center px-4 max-w-3xl mx-auto flex flex-col items-center gap-6 relative z-[30] w-full">
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight whitespace-nowrap text-neutral-900 dark:text-white">
                    ยินดีต้อนรับสู่{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-red-700 dark:from-red-400 dark:via-red-500 dark:to-red-600 drop-shadow-md">
                      Exam Archive
                    </span>
                  </h2>
                  <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-xl">
                    ค้นหาและดาวน์โหลดข้อสอบเก่า โครงงานวิทยาศาสตร์ และผลงานที่น่าสนใจ เพื่อเตรียมความพร้อมและแรงบันดาลใจในการเรียน
                  </p>
                </div>
              </div>

              {/* Middle Section */}
              <div className="w-[100vw] relative left-1/2 -translate-x-1/2 bg-white dark:bg-white shadow-[0_0_60px_20px_rgba(255,255,255,1)] dark:shadow-[0_0_100px_30px_rgba(255,255,255,0.5)] pt-6 pb-4 z-[35] overflow-visible">
                {/* SVG dripping shape at the top of Middle Section */}
                <div className="absolute top-0 left-0 w-[100vw] overflow-hidden leading-[0] z-20 drop-shadow-[0_20px_30px_rgba(255,255,255,0.3)] pointer-events-none">
                  <svg className="block w-full h-[220px] md:h-[440px] fill-neutral-50 dark:fill-[#050505] drop-shadow-md" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0 V46.29C39.4,46.29 55.6,90.3 113,90.3 170.4,90.3 186.6,18.4 226,18.4 265.4,18.4 286.7,71.2 339,71.2 391.3,71.2 411.5,12 452,12 492.5,12 506.7,55 565,55 623.3,55 640.7,21 678,21 715.3,21 732.1,80 791,80 849.9,80 862.6,35 904,35 945.4,35 965.7,85 1017,85 1068.3,85 1084.7,26 1130,26 1175.3,26 1186,46.29 1200,46.29V0Z"></path>
                  </svg>
                </div>

                <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col relative z-30">
                  <div className="w-full">
                    <ImageSlider />
                  </div>
                </div>

                {/* SVG Curve at the bottom of Middle Section */}
                <div className="absolute top-full left-0 w-[100vw] leading-[0] z-20 pointer-events-none -mt-[1px]">
                  <svg className="block w-full h-[60px] md:h-[100px] fill-white dark:fill-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
                     <path d="M0,0 Q600,120 1200,0 Z"></path>
                  </svg>
                </div>
              </div>

              {/* Bottom transition spacer beneath the curve */}
              <div className="w-[100vw] h-[80px] relative left-1/2 -translate-x-1/2 bg-neutral-50 dark:bg-[#050505] z-[30] pointer-events-none" />

              {/* Bottom Section */}
              <div className="w-[100vw] relative left-1/2 -translate-x-1/2 bg-neutral-50 dark:bg-[#050505] text-neutral-900 dark:text-white pt-10 pb-24 mt-auto z-[30] flex flex-col items-center">
                {/* Ambient Background Glow Container */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                  <div className="absolute top-[10%] left-[-15%] w-[45%] h-[350px] bg-rose-500/10 dark:bg-rose-900/15 rounded-full blur-[110px]"></div>
                  <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[350px] bg-red-500/10 dark:bg-red-900/15 rounded-full blur-[100px]"></div>
                </div>

                <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 flex flex-col gap-12 text-left relative z-10">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-2xl font-bold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-neutral-900 dark:via-white to-neutral-400 drop-shadow-sm">
                      Exams (คลังข้อสอบ)
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed mb-2">
                      รวบรวมข้อสอบเก่าจากหลากหลายสนามสอบ ไม่ว่าจะเป็น สอวน. TCAS A-Level และข้อสอบเข้ามหาวิทยาลัยชั้นนำต่างๆ เพื่อเป็นแหล่งความรู้อันมีค่าและช่วยให้ผู้เรียนได้ฝึกฝน ทบทวนความรู้ เพื่อเตรียมความพร้อมสำหรับการสอบอย่างมีประสิทธิภาพสูงสุด
                    </p>
                    <button
                      onClick={() => setCurrentView("exams")}
                      className="mt-2 w-fit px-8 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-sm active:scale-95 border border-transparent"
                    >
                      เริ่มค้นหาข้อสอบ
                    </button>
                  </div>

                  {/* Infinite Scroll Carousel */}
                  <div className="w-[100vw] relative left-1/2 -translate-x-1/2 bg-transparent py-4 flex items-center justify-center my-8 overflow-hidden">
                    <div className="w-full inline-flex flex-nowrap overflow-hidden">
                      <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 sm:[&_li]:mx-8 [&_li]:text-xs sm:[&_li]:text-base [&_li]:font-black [&_li]:text-transparent [&_li]:bg-clip-text [&_li]:bg-gradient-to-r [&_li]:from-neutral-900 dark:[&_li]:from-white [&_li]:via-red-500 [&_li]:to-neutral-500 [&_li]:whitespace-nowrap [&_li]:tracking-widest animate-infinite-scroll w-max drop-shadow-md">
                        <li>POSN</li>
                        <li>TCAS</li>
                        <li>NETSAT</li>
                        <li>A-LEVEL</li>
                        <li>TGAT</li>
                        <li>TPAT</li>
                        <li>สอวน.</li>
                        <li>IJSO</li>
                        <li>POSN</li>
                        <li>TCAS</li>
                        <li>NETSAT</li>
                        <li>A-LEVEL</li>
                        <li>TGAT</li>
                        <li>TPAT</li>
                        <li>สอวน.</li>
                        <li>IJSO</li>
                        {/* Duplicated for seamless looping */}
                        <li aria-hidden="true">POSN</li>
                        <li aria-hidden="true">TCAS</li>
                        <li aria-hidden="true">NETSAT</li>
                        <li aria-hidden="true">A-LEVEL</li>
                        <li aria-hidden="true">TGAT</li>
                        <li aria-hidden="true">TPAT</li>
                        <li aria-hidden="true">สอวน.</li>
                        <li aria-hidden="true">IJSO</li>
                        <li aria-hidden="true">POSN</li>
                        <li aria-hidden="true">TCAS</li>
                        <li aria-hidden="true">NETSAT</li>
                        <li aria-hidden="true">A-LEVEL</li>
                        <li aria-hidden="true">TGAT</li>
                        <li aria-hidden="true">TPAT</li>
                        <li aria-hidden="true">สอวน.</li>
                        <li aria-hidden="true">IJSO</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <h3 className="text-2xl font-bold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-neutral-900 dark:via-white to-neutral-400 drop-shadow-sm">
                      Portfolio & University (แฟ้มสะสมผลงานและมหาวิทยาลัย)
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed mb-2">
                      พื้นที่จัดเก็บและนำเสนอผลงาน กิจกรรม และโครงงานวิทยาศาสตร์ต่างๆ ของนักเรียน เพื่อแบ่งปันไอเดีย ความสำเร็จ เป็นแนวทางในการจัดทำแฟ้มสะสมผลงาน พร้อมทั้งข้อมูล เเละรายละเอียดของคณะและมหาวิทยาลัยต่างๆ เพื่อสร้างแรงบันดาลใจในการศึกษาต่อ ช่วยประกอบการตัดสินใจ และเตรียมความพร้อมเพื่อก้าวเข้าสู่รั้วมหาวิทยาลัยในฝันอย่างมั่นใจ
                    </p>
                    <button
                      onClick={() => setCurrentView("portfolio")}
                      className="mt-1 w-fit px-8 py-3 bg-neutral-200 dark:bg-white/10 text-neutral-900 dark:text-white border border-neutral-300 dark:border-white/20 hover:bg-neutral-300 dark:hover:bg-white/20 rounded-xl font-medium transition-colors shadow-sm active:scale-95"
                    >
                      ดูผลงาน Portfolio
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {currentView === "about" && (
            <motion.section
              key="about"
              initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="max-w-3xl mx-auto py-12 px-4 sm:px-0 flex flex-col gap-8 w-full"
            >
               <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-300 tracking-tight transition-colors">
                 About Me
               </h2>
               <div className="prose prose-neutral dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-400 transition-colors">
                 <p className="text-lg">ok doraymifasol</p>
                 <div className="my-8 flex gap-4">
                   <img
                     src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=400&q=80"
                     alt="Library"
                     className="rounded-xl w-1/2 object-cover"
                   />
                   <img
                     src="https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80"
                     alt="Books"
                     className="rounded-xl w-1/2 object-cover"
                   />
                 </div>
                 <h3>Mission</h3>
                 <p>skibidi skibidi</p>
                 <h3>Contact</h3>
                 <p>tornado tornado</p>
               </div>
            </motion.section>
          )}

          {currentView === "exams" && (
            <motion.div
              key="exams"
              initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col gap-8 w-full max-w-4xl mx-auto py-8 relative"
            >
              {/* Title Section matching Home View */}
              <div className="text-center px-4 max-w-3xl mx-auto flex flex-col items-center gap-4 mb-4 relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight transition-colors text-neutral-900 dark:text-white">
                  ค้นหา{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-600 drop-shadow-md">
                    แหล่งข้อสอบเก่า
                  </span>
                </h2>
                <p className="text-md text-neutral-600 dark:text-neutral-400 max-w-xl transition-colors">
                  รวบรวมช่องทางดาวน์โหลดและติวข้อสอบจากผู้ออกข้อสอบจริงและแหล่งแนวข้อสอบชั้นนำ เพื่อการเตรียมความพร้อมอย่างไร้ขีดจำกัด
                </p>
              </div>

              {/* Controls & Filters with Custom gradient border highlight */}
              <section className="flex flex-col gap-5 p-2 transition-colors relative z-10 w-full mb-8">
                {/* 1. Category Filter */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider ml-1">
                    วิชา / หมวดหมู่
                  </span>
                  <div className="flex gap-2 p-1 rounded-xl w-full overflow-x-auto transition-colors scrollbar-none">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                          selectedCategory === cat
                            ? "text-white"
                            : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                        }`}
                      >
                        {selectedCategory === cat && (
                          <motion.div
                            layoutId="active-category"
                            className="absolute inset-0 bg-red-600 rounded-lg shadow-sm"
                            transition={{
                              type: "spring",
                              bounce: 0.2,
                              duration: 0.6,
                            }}
                          />
                        )}
                        <span className="relative z-10">{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Exam Type & Source Type Filter Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Exam Type Filter */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider ml-1">
                      สนามสอบ
                    </span>
                    <div className="flex gap-2 p-1 rounded-xl overflow-x-auto transition-colors scrollbar-none">
                      {examTypes.map((et) => (
                        <button
                          key={et}
                          onClick={() => setSelectedExamType(et)}
                          className={`relative flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap text-center ${
                            selectedExamType === et
                              ? "text-white"
                              : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                          }`}
                        >
                          {selectedExamType === et && (
                            <motion.div
                              layoutId="active-exam-type"
                              className="absolute inset-0 bg-red-600 rounded-lg shadow-sm"
                              transition={{
                                type: "spring",
                                bounce: 0.2,
                                duration: 0.6,
                              }}
                            />
                          )}
                          <span className="relative z-10">{et}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Source Type Filter */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider ml-1">
                      ผู้จัดทำ / แหล่งที่มา
                    </span>
                    <div className="flex p-1 rounded-xl transition-colors relative">
                      <button
                        onClick={() => setSourceType("All")}
                        className={`relative flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap text-center ${
                          sourceType === "All"
                            ? "text-white"
                            : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                        }`}
                      >
                        {sourceType === "All" && (
                          <motion.div
                            layoutId="active-source-type"
                            className="absolute inset-0 bg-red-600 rounded-lg shadow-sm"
                            transition={{
                              type: "spring",
                              bounce: 0.2,
                              duration: 0.6,
                            }}
                          />
                        )}
                        <span className="relative z-10">ทั้งหมด</span>
                      </button>
                      <button
                        onClick={() => setSourceType("Official")}
                        className={`relative flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap text-center ${
                          sourceType === "Official"
                            ? "text-white"
                            : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                        }`}
                      >
                        {sourceType === "Official" && (
                          <motion.div
                            layoutId="active-source-type"
                            className="absolute inset-0 bg-red-600 rounded-lg shadow-sm"
                            transition={{
                              type: "spring",
                              bounce: 0.2,
                              duration: 0.6,
                            }}
                          />
                        )}
                        <span className="relative z-10">ผู้ออกข้อสอบ</span>
                      </button>
                      <button
                        onClick={() => setSourceType("Unofficial")}
                        className={`relative flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap text-center ${
                          sourceType === "Unofficial"
                            ? "text-white"
                            : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                        }`}
                      >
                        {sourceType === "Unofficial" && (
                          <motion.div
                            layoutId="active-source-type"
                            className="absolute inset-0 bg-red-600 rounded-lg shadow-sm"
                            transition={{
                              type: "spring",
                              bounce: 0.2,
                              duration: 0.6,
                            }}
                          />
                        )}
                        <span className="relative z-10">รวบรวม</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Search Bar */}
                <div className="flex flex-col gap-2 border-t border-neutral-200/40 dark:border-neutral-800/50 pt-3">
                  <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider ml-1">
                    ค้นหาอย่างละเอียด
                  </span>
                  <div className="relative group w-full">
                    <Search
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-600 group-focus-within:text-red-500 dark:group-focus-within:text-red-400 transition-colors"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="ค้นหาแหล่งข้อสอบโดยพิมพ์ ชื่อรายชื่อ, รายวิชา..."
                      className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 rounded-xl py-3 pl-12 pr-4 text-neutral-900 dark:text-neutral-300 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 dark:focus:ring-red-600/50 focus:border-red-500 transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </section>

              {/* Archive Grid/List */}
              <section className="pb-24 relative z-10">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-4 transition-colors">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-300 transition-colors flex items-center gap-2">
                    แหล่งข้อสอบเก่า ({filteredExternalLinks.length} รายการ)
                  </h3>
                </div>

                {filteredExternalLinks.length === 0 ? (
                  <div className="text-center py-24 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-sm border border-neutral-200 dark:border-neutral-800 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 text-neutral-500 dark:text-neutral-500 transition-colors">
                    <Search
                      size={48}
                      className="text-neutral-300 dark:text-neutral-700"
                    />
                    <p className="text-lg">
                      ไม่พบแหล่งข้อสอบที่ตรงกับคำค้นหา
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("All");
                        setSourceType("All");
                        setSelectedExamType("All");
                      }}
                      className="text-red-500 dark:text-red-400 font-semibold hover:underline focus:outline-none transition-colors"
                    >
                      ล้างตัวกรองทั้งหมด
                    </button>
                  </div>
                ) : (
                  <motion.div layout className="flex flex-col gap-4 w-full">
                    <AnimatePresence initial={false}>
                      {filteredExternalLinks.map((link) => (
                        <motion.div
                          key={link.id}
                          layout="position"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{
                            layout: { type: "spring", bounce: 0, duration: 0.4 },
                            opacity: { duration: 0.2 },
                            y: { type: "spring", bounce: 0, duration: 0.4 },
                            scale: { duration: 0.2 }
                          }}
                          className="w-full bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800/50 rounded-2xl p-5 sm:p-6 shadow-sm hover:border-red-500/40 dark:hover:border-red-600/45 hover:shadow-lg hover:shadow-red-500/5 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-left group"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200 group-hover:text-red-500 dark:group-hover:text-red-400 line-clamp-1 transition-colors">
                                {link.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-1.5">
                                {link.isOfficialSource ? (
                                  <span className="text-[10px] font-semibold bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 dark:border-red-900/30 px-2 py-0.5 rounded-full whitespace-nowrap transition-colors flex items-center gap-1 uppercase tracking-wider">
                                    Official
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-semibold bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 dark:border-red-900/30 px-2 py-0.5 rounded-full whitespace-nowrap transition-colors flex items-center gap-1 uppercase tracking-wider">
                                    รวบรวม
                                  </span>
                                )}
                                {link.examTypes &&
                                  link.examTypes.map((et) => (
                                    <span
                                      key={et}
                                      className="text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 border border-neutral-200/50 dark:border-neutral-700/50 px-2.5 py-0.5 rounded-full whitespace-nowrap transition-colors"
                                    >
                                      {et}
                                    </span>
                                  ))}
                                {link.subjects &&
                                  link.subjects.map((sub) => (
                                    <span
                                      key={sub}
                                      className="text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded-full whitespace-nowrap transition-colors"
                                    >
                                      {sub}
                                    </span>
                                  ))}
                              </div>
                            </div>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 transition-colors leading-relaxed">
                              {link.description}
                            </p>
                          </div>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-100 dark:bg-neutral-800/50 hover:bg-red-600 text-neutral-900 dark:text-neutral-300 hover:text-white dark:hover:text-white rounded-xl text-sm font-medium transition-all sm:shrink-0 hover:-translate-y-0.5 active:scale-95 border border-neutral-200/50 dark:border-neutral-700/50 hover:border-transparent dark:hover:border-transparent group-hover:shadow-md group-hover:shadow-red-600/20"
                          >
                            <span>ไปที่เว็บไซต์</span>
                          </a>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </section>
            </motion.div>
          )}

          {currentView === "portfolio" && (
            <motion.section
              key="portfolio"
              initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="py-12 flex flex-col items-center justify-start min-h-[60vh] w-full gap-10 max-w-4xl mx-auto relative"
            >
              <div className="text-center px-4">
                <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-neutral-100 mb-3 tracking-tight">
                  Student Portfolios
                </h2>
                <div className="h-1 w-12 bg-red-500 mx-auto rounded-full mb-4" />
                <p className="text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto transition-colors">
                  รวบรวมเล่มผลงานสะสม (Portfolio) ที่ผ่านการคัดเลือกเข้าศึกษาจริงในมหาวิทยาลัยต่างๆ เพื่อเป็นประทีปส่องทางและแรงบันดาลใจแด่น้องๆ รุ่นต่อไป
                </p>
              </div>

              {/* ค้นหาและตัวกรอง */}
              <div className="w-full max-w-3xl px-4 sm:px-0 flex flex-col gap-4">
                {/* ช่องค้นหา */}
                <div className="relative group w-full">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-600 group-focus-within:text-red-500 dark:group-focus-within:text-red-400 transition-colors"
                    size={20}
                  />
                  <input
                    type="text"
                    value={portfolioSearch}
                    onChange={(e) => setPortfolioSearch(e.target.value)}
                    placeholder="ค้นหาชื่อผู้จัดทำ คณะ มหาวิทยาลัย หรือแท็ก..."
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl py-3 pl-12 pr-10 text-neutral-900 dark:text-neutral-300 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 dark:focus:ring-red-600/50 focus:border-transparent transition-all shadow-sm"
                  />
                  {portfolioSearch && (
                    <button
                      onClick={() => setPortfolioSearch("")}
                      className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                    >
                      <XCircle size={18} />
                    </button>
                  )}
                </div>
              </div>

              <div className="w-full px-4 sm:px-0">
                {filteredPortfolioLinks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full max-w-[280px] sm:max-w-none mx-auto">
                    {filteredPortfolioLinks.map((link) => (
                      <div
                        key={link.id}
                        className="relative aspect-[1/1.4142] w-full rounded-none overflow-hidden shadow-md dark:shadow-black/40 hover:shadow-2xl dark:hover:shadow-black/70 border border-neutral-200/50 dark:border-neutral-800/80 transition-all duration-300 hover:-translate-y-2 group select-none flex flex-col justify-end bg-neutral-950"
                      >
                        {/* Portfolio Cover Image */}
                        {link.coverImageUrl && (
                          <img
                            src={link.coverImageUrl}
                            alt={`${link.ownerName || link.title} portfolio cover`}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}

                        {/* Top left decorative tag overlay */}
                        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 z-10 opacity-80 group-hover:opacity-100 transition-opacity">
                          {link.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-bold bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-none border border-white/10"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Bottom Dark Gradient Fade */}
                        <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-black via-black/95 via-60% to-transparent pointer-events-none" />

                        {/* Bottom content area */}
                        <div className="relative z-10 p-5 sm:p-6 flex flex-col gap-4 w-full">
                          {/* Text labels (above the button to avoid getting compressed) */}
                          <div className="flex flex-col gap-1 text-left text-white">
                            {/* Line 1: Owner Name */}
                            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white drop-shadow-md line-clamp-1">
                              {link.ownerName || "ชื่อเจ้าของผลงาน"}
                            </h3>
                            {/* Line 2: Faculty and University */}
                            <p className="text-[10px] sm:text-xs font-medium text-neutral-300 drop-shadow-md leading-relaxed line-clamp-2">
                              {link.targetFacultyAndUni || link.description}
                            </p>
                          </div>

                          {/* Red Action Button (bottom right) - Rectangular with square corners containing text */}
                          <div className="flex justify-end">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white rounded-none shadow-lg shadow-red-600/30 dark:shadow-red-950/20 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center group/btn text-xs sm:text-sm font-bold whitespace-nowrap"
                              title="ดูพอร์ต"
                            >
                              <span>ดูพอร์ต</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 px-4 border border-dashed border-neutral-200 dark:border-neutral-800/80 w-full max-w-3xl mx-auto flex flex-col items-center justify-center gap-3">
                    <span className="text-neutral-300 dark:text-neutral-700">
                      <Search size={48} strokeWidth={1} />
                    </span>
                    <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-300">ไม่พบเล่มผลงานที่ต้องการ</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-500">กรุณาลองใช้คำสำคัญอื่นหรือลองกดเลือกแท็กยอดนิยมอื่นๆ</p>
                    <button
                      onClick={() => {
                        setPortfolioSearch("");
                        setSelectedPortfolioTag("All");
                      }}
                      className="mt-2 text-xs font-bold text-red-600 hover:text-red-500 underline uppercase tracking-wider"
                    >
                      ล้างตัวกรองทั้งหมด
                    </button>
                  </div>
                )}
              </div>

              {/* แหล่งเพิ่มเติม */}
              <div className="w-full px-4 sm:px-0 max-w-3xl mx-auto mt-16 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-bold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-600 drop-shadow-sm">
                    <Library className="text-red-500 dark:text-red-400" size={24} />
                    แหล่งเพิ่มเติม
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    แหล่งรวมเว็บไซต์และแหล่งข้อมูลเพิ่มเติมเพื่อเป็นแนวทางและไอเดียในการทำพอร์ตโฟลิโอ
                  </p>
                </div>
                
                <div className="flex flex-col gap-4 w-full">
                  {additionalPortfolioSources.map((link) => (
                    <div
                      key={link.id}
                      className="w-full rounded-2xl py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-left group transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h4 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200 group-hover:text-red-500 dark:group-hover:text-red-400 line-clamp-1 transition-colors">
                            {link.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {link.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded-full whitespace-nowrap transition-colors"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 transition-colors leading-relaxed">
                          {link.description}
                        </p>
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-100 dark:bg-neutral-800/50 hover:bg-red-600 text-neutral-900 dark:text-neutral-300 hover:text-white dark:hover:text-white rounded-xl text-sm font-medium transition-all sm:shrink-0 hover:-translate-y-0.5 active:scale-95 group-hover:shadow-md group-hover:shadow-red-600/20"
                      >
                        เข้าสู่เว็บไซต์
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

            </motion.section>
          )}

          {currentView === "university" && <University />}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200/50 dark:border-neutral-900 bg-transparent py-6 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-neutral-500 dark:text-neutral-400 p-1 flex items-center justify-center transition-colors">
              <Copyright size={18} strokeWidth={2} />
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm transition-colors flex items-center gap-3">
              <span>เว็บไซต์รวมข้อสอบของพรรค uunknown</span>
              <span className="text-neutral-300 dark:text-neutral-700">|</span>
              <a href="#" className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
                Feedback
              </a>
              <span className="text-neutral-300 dark:text-neutral-700">|</span>
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
                <Instagram size={18} />
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
