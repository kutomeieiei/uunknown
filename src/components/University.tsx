import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, BookOpen, GraduationCap, Building2, X, Info, MapPin, Search, ArrowLeft } from "lucide-react";

interface UniversityItem {
  id: string;
  name: string;
  nameThai: string;
  url: string;
  icon: React.ReactNode;
  logoUrl?: string;
  color: string;
  description: string;
  location: string;
  admissionMethods: { name: string; description: string; }[];
  faculties: {
    facultyName: string;
    scoreCriteria: string[];
  }[];
}

export function University() {
  const [selectedUni, setSelectedUni] = useState<UniversityItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const unis: UniversityItem[] = [
    {
      id: "1",
      name: "Chulalongkorn University",
      nameThai: "จุฬาลงกรณ์มหาวิทยาลัย",
      url: "https://www.chula.ac.th/",
      icon: <Building2 size={32} />,
      logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaWqIvP5VYyuI0lA4-plkGBElrboCHhCDQoQ&s", // ปล่อยว่างไว้เพื่อใช้ icon หรือใส่ URL ของตราสัญลักษณ์
      color:
        "text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-900/50 bg-pink-100 dark:bg-pink-950/40",
      description: "จุฬาลงกรณ์มหาวิทยาลัย เป็นมหาวิทยาลัยแห่งแรกของประเทศไทย มีชื่อเสียงด้านวิชาการและการวิจัยที่โดดเด่นในหลากหลายสาขาวิชา มุ่งเน้นการสร้างผู้นำและนวัตกรรมเพื่อสังคม",
      location: "กรุงเทพมหานคร",
      admissionMethods: [
        { name: "TCAS รอบ 1 Portfolio", description: "พิจารณาจากผลงาน (Portfolio) ความสามารถพิเศษ และการสัมภาษณ์" },
        { name: "TCAS รอบ 2 Quota", description: "โควตาพื้นที่ โควตาโรงเรียนสาธิต และโครงการความสามารถพิเศษต่างๆ" },
        { name: "TCAS รอบ 3 Admission", description: "พิจารณาจากคะแนนส่วนกลาง (TGAT, TPAT, A-Level) เป็นหลัก" }
      ],
      faculties: [
        { facultyName: "วิศวกรรมศาสตร์", scoreCriteria: ["TGAT", "TPAT3", "A-Level คณิตศาสตร์ประยุกต์ 1", "A-Level ฟิสิกส์", "A-Level เคมี"] },
        { facultyName: "อักษรศาสตร์", scoreCriteria: ["TGAT", "A-Level ภาษาไทย", "A-Level สังคมศึกษา", "A-Level ภาษาต่างประเทศ"] }
      ]
    }
  ];

  const filteredUnis = unis.filter(uni => 
    uni.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    uni.nameThai.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedUni) {
    return (
      <motion.section
        key="university-detail"
        initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -15, filter: "blur(5px)" }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="py-12 flex flex-col justify-start min-h-[50vh] w-full gap-8 max-w-5xl mx-auto px-4 sm:px-6 relative z-10"
      >
        {/* Back Button */}
        <div>
          <button
            onClick={() => setSelectedUni(null)}
            className="group inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 bg-neutral-100 hover:bg-neutral-200/60 dark:bg-neutral-900/40 dark:hover:bg-neutral-800/80 rounded-xl transition-all"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
            <span>ย้อนกลับไปหน่วยงานมหาวิทยาลัย</span>
          </button>
        </div>

        {/* Hero Banner section */}
        <div className="py-6 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative overflow-hidden">

          {selectedUni.logoUrl ? (
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white dark:bg-neutral-950 rounded-2xl p-3 shadow-sm border border-neutral-200/40 dark:border-neutral-800/40 flex items-center justify-center shrink-0">
              <img src={selectedUni.logoUrl} alt={`${selectedUni.name} logo`} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-2xl flex items-center justify-center shadow-sm shrink-0 border ${selectedUni.color}`}>
              <div className="scale-150 text-current">{selectedUni.icon}</div>
            </div>
          )}

          <div className="flex-1 text-center md:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white leading-tight">
                {selectedUni.nameThai}
              </h2>
              <img src="https://flagcdn.com/th.svg" alt="Thailand" className="w-6 h-auto rounded-[2px] shadow-sm shrink-0" />
            </div>
            <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 mb-4 font-medium transition-colors">
              {selectedUni.name}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              <span className="flex items-center gap-1.5 font-semibold transition-colors">
                <MapPin size={16} className="text-red-500" />
                {selectedUni.location}
              </span>
              <span className="flex items-center gap-1.5 font-semibold transition-colors">
                <GraduationCap size={16} className="text-orange-500" />
                สถาบันอุดมศึกษาไทย
              </span>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto flex justify-center mt-2 md:mt-0">
            <a
              href={selectedUni.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl text-sm font-semibold shadow-md hover:scale-[1.02] active:scale-95 transition-all"
            >
              <span>ไปที่เว็บไซต์มหาวิทยาลัย</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 mt-4">
          <div className="lg:col-span-2 flex flex-col gap-10">
            {/* Description Card */}
            <div className="transition-colors">
              <h3 className="text-2xl font-bold flex items-center gap-2 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-neutral-900 dark:via-white to-neutral-500 drop-shadow-sm">
                รายละเอียดเกี่ยวกับมหาวิทยาลัย
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed transition-colors">
                {selectedUni.description}
              </p>
            </div>

            {/* Admissions */}
            <div className="transition-colors">
              <h3 className="text-2xl font-bold flex items-center gap-2 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-neutral-900 dark:via-white to-neutral-500 drop-shadow-sm">
                รอบวิธียื่นรับเข้าศึกษาที่มีเปิดรับสมัคร
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-6">
                {selectedUni.admissionMethods.map((method, index) => (
                  <div key={index} className="flex flex-col gap-2 transition-colors">
                    <span className="text-xs font-semibold text-red-500 dark:text-red-400 uppercase tracking-widest">
                      {method.name.split(" ")[1] || "Admission"}
                    </span>
                    <h4 className="font-semibold text-lg text-neutral-900 dark:text-white leading-snug">
                      {method.name}
                    </h4>
                    <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {method.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            {/* Criteria Column */}
            <div className="transition-colors flex flex-col">
              <h3 className="text-2xl font-bold flex items-center gap-2 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-neutral-900 dark:via-white to-neutral-500 drop-shadow-sm">
                เกณฑ์การยื่นสมัครคัดเลือก (ตัวอย่าง)
              </h3>
              
              <div className="flex flex-col gap-6 mt-6">
                {selectedUni.faculties.map((faculty, fIndex) => (
                  <div key={fIndex} className="flex flex-col gap-3 transition-colors">
                    <h4 className="font-semibold text-lg text-neutral-900 dark:text-white flex items-center gap-1.5">
                      คณะ{faculty.facultyName}
                    </h4>
                    
                    <div className="flex flex-wrap gap-1.5">
                      {faculty.scoreCriteria.map((score, sIndex) => (
                        <span key={sIndex} className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-neutral-100/50 dark:bg-neutral-900/30 px-3 py-1 rounded-full transition-colors border border-neutral-200/40 dark:border-neutral-800/40">
                          {score}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <>
      <motion.section
        key="university"
        initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="py-12 flex flex-col items-center justify-start min-h-[50vh] w-full gap-8 max-w-5xl mx-auto px-4 sm:px-6 relative"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-300 mb-2 transition-colors">
            Universities
          </h2>
          <p className="text-neutral-600 dark:text-neutral-500 max-w-xl mx-auto transition-colors">
            ข้อมูลเกี่ยวกับมหาวิทยาลัยที่น่าสนใจ สำหรับศึกษาต่อในระดับอุดมศึกษา
          </p>
        </div>

        <div className="w-full max-w-2xl mx-auto relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-700 transition-all shadow-sm"
            placeholder="ค้นหามหาวิทยาลัย..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-full flex flex-col gap-3">
          {filteredUnis.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
              ไม่พบมหาวิทยาลัยที่ค้นหา
            </div>
          ) : (
            filteredUnis.map((uni) => (
            <div
              key={uni.id}
              className="bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800/50 rounded-xl overflow-hidden hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                <div
                  className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-xl sm:rounded-2xl border ${uni.color}`}
                >
                  {uni.logoUrl ? (
                    <div className="w-full h-full bg-white dark:bg-neutral-900 p-1.5 rounded-xl sm:rounded-2xl flex items-center justify-center">
                      <img src={uni.logoUrl} alt={`${uni.name} logo`} className="w-full h-full object-contain rounded-lg" />
                    </div>
                  ) : (
                    <div className="text-current opacity-80 scale-90 sm:scale-100">
                      {uni.icon}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className={`font-semibold text-neutral-900 dark:text-neutral-200 leading-snug line-clamp-2 inline-flex items-center gap-2 ${uni.nameThai.length > 35 ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}`}>
                    {uni.nameThai} <img src="https://flagcdn.com/th.svg" alt="Thailand" className="inline-block w-5 h-auto rounded-[2px]" />
                  </h3>
                  <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 truncate pr-2">
                    {uni.name}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                    <MapPin size={14} className="shrink-0" />
                    <span className="truncate">{uni.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end shrink-0 sm:pl-4 mt-2 sm:mt-0">
                <button
                  onClick={() => setSelectedUni(uni)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-2.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-300 rounded-lg text-sm font-medium transition-colors"
                >
                  <span>ข้อมูลเพิ่มเติม</span>
                  <Info size={16} />
                </button>
              </div>
            </div>
          )))}
        </div>
      </motion.section>
    </>
  );
}

