'use client';

import React from 'react';
import { OFFICIAL_COURSE_CATALOG, type Course } from '@/services/recommendationService';
import { BookOpen, Award, ArrowUpRight, CheckCircle2, Play } from 'lucide-react';

interface LearnerCoursesTableProps {
  isHindi?: boolean;
}

export function LearnerCoursesTable({ isHindi = false }: LearnerCoursesTableProps) {
  // Sample course progress data
  const progressMap: Record<string, { completedLessons: number; totalLessons: number; status: 'in-progress' | 'recommended' | 'completed' }> = {
    'course-capi-101': { completedLessons: 14, totalLessons: 20, status: 'in-progress' },
    'course-nsso-plfs': { completedLessons: 6, totalLessons: 18, status: 'in-progress' },
    'course-sampling-design': { completedLessons: 0, totalLessons: 15, status: 'recommended' },
    'course-data-scrutiny': { completedLessons: 16, totalLessons: 16, status: 'completed' },
    'course-field-teamwork': { completedLessons: 0, totalLessons: 8, status: 'recommended' },
  };

  return (
    <div className="rounded-3xl bg-white border border-[#BF9B7A]/30 p-6 shadow-xs overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#BF9B7A]/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#555934]" />
            <h2 className="text-lg font-bold text-[#2d1f17]">
              {isHindi ? 'नामांकित एवं अनुशंसित मॉड्यूल' : 'Enrolled & Recommended Modules'}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isHindi
              ? 'iGOT कर्मयोगी और एनएसएसटीए आधिकारिक पाठ्यक्रम'
              : 'Direct integration with iGOT Karmayogi & NSSTA Faculty Modules'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <span className="px-3 py-1 rounded-full bg-[#555934]/10 text-[#555934]">
            {isHindi ? 'सभी (5)' : 'All (5)'}
          </span>
          <span className="px-3 py-1 rounded-full bg-[#FAF6F0] text-muted-foreground border border-[#BF9B7A]/30">
            {isHindi ? 'सक्रिय (2)' : 'In Progress (2)'}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#BF9B7A]/20 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              <th className="pb-3 pl-2">{isHindi ? 'पाठ्यक्रम' : 'Course Module'}</th>
              <th className="pb-3 hidden md:table-cell">{isHindi ? 'चरण' : 'Stage'}</th>
              <th className="pb-3">{isHindi ? 'प्रगति' : 'Progress'}</th>
              <th className="pb-3 hidden sm:table-cell">{isHindi ? 'कर्मा अंक' : 'Karma Points'}</th>
              <th className="pb-3 pr-2 text-right">{isHindi ? 'कार्रवाई' : 'Action'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#BF9B7A]/15 text-xs">
            {OFFICIAL_COURSE_CATALOG.map((course: Course) => {
              const progress = progressMap[course.id] || { completedLessons: 0, totalLessons: 10, status: 'recommended' };
              const percent = Math.round((progress.completedLessons / progress.totalLessons) * 100);
              const courseTitle = isHindi && course.title_hi ? course.title_hi : course.title;

              return (
                <tr key={course.id} className="hover:bg-[#FAF6F0]/50 transition-colors">
                  {/* Course Title & Provider */}
                  <td className="py-4 pl-2 pr-4">
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-xl bg-[#555934]/10 text-[#555934] flex items-center justify-center shrink-0 mt-0.5">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[#2d1f17] line-clamp-1">{courseTitle}</p>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">{course.provider}</p>
                      </div>
                    </div>
                  </td>

                  {/* Stage */}
                  <td className="py-4 pr-4 hidden md:table-cell">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      course.stage === 'FOUNDATIONAL'
                        ? 'bg-blue-500/15 text-blue-700'
                        : course.stage === 'APPLIED'
                          ? 'bg-[#8C5B3E]/15 text-[#8C5B3E]'
                          : 'bg-purple-500/15 text-purple-700'
                    }`}>
                      {course.stage}
                    </span>
                  </td>

                  {/* Progress bar */}
                  <td className="py-4 pr-4 min-w-32.5">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-muted-foreground">
                          {progress.completedLessons}/{progress.totalLessons}
                        </span>
                        <span className="font-bold text-[#2d1f17]">{percent}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[#BF9B7A]/20 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            percent === 100 ? 'bg-emerald-600' : 'bg-[#555934]'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Karma Points */}
                  <td className="py-4 pr-4 hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8C5B3E] bg-[#F8C858]/20 px-2 py-0.5 rounded-full">
                      <Award className="h-3 w-3 text-[#8C5B3E]" />
                      +50 KP
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-4 pr-2 text-right">
                    {progress.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-xs px-2 py-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {isHindi ? 'पूर्ण' : 'Passed'}
                      </span>
                    ) : progress.status === 'in-progress' ? (
                      <a
                        href={course.iGotLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#555934] text-white font-bold hover:bg-[#434728] transition-colors shadow-2xs"
                      >
                        <Play className="h-3 w-3 fill-current" />
                        <span>{isHindi ? 'जारी रखें' : 'Resume'}</span>
                      </a>
                    ) : (
                      <a
                        href={course.iGotLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FAF6F0] text-[#555934] border border-[#BF9B7A]/40 font-bold hover:bg-[#FAF6F0]/80 transition-colors"
                      >
                        <span>{isHindi ? 'प्रारंभ' : 'Start'}</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
