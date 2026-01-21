
import React, { useState } from 'react';
import { Course, User, UserRole, MaterialCategory, MaterialFile, DepartmentType } from '../types';
import { formatBytes } from '../utils/security';
import { MAX_FILE_SIZE, ALLOWED_EXTENSIONS } from '../constants';

interface CourseListProps {
  courses: Course[];
  user: User;
  currentDept: DepartmentType;
  currentSemester: number;
  onSelect: (course: Course) => void;
  onDiscussion: (course: Course) => void;
  onUpdateCourses: (updater: (prev: Course[]) => Course[]) => void;
}

const CourseList: React.FC<CourseListProps> = ({ 
  courses, 
  user, 
  currentDept, 
  currentSemester, 
  onDiscussion, 
  onUpdateCourses 
}) => {
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');

  // صلاحية الإدارة للروت (zero) والأساتذة فقط
  const canManage = user.role === UserRole.ROOT || user.role === UserRole.ADMIN;

  const toggleExpand = (id: string) => {
    setExpandedCourseId(expandedCourseId === id ? null : id);
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;
    
    const newCourse: Course = {
      id: `course-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: newCourseName.trim(),
      department: currentDept,
      semester: currentSemester,
      files: [],
      lastUpdate: new Date().toLocaleString('ar-EG'),
      updatedBy: user.name
    };

    onUpdateCourses(prev => [...prev, newCourse]);
    setNewCourseName('');
    setShowAddCourse(false);
  };

  // دالة حذف المادة بالكامل
  const handleDeleteCourse = (e: React.MouseEvent, courseId: string) => {
    // إيقاف انتشار الحدث ضروري جداً لمنع فتح المادة عند الضغط على زر الحذف
    e.stopPropagation();
    e.preventDefault(); 
    
    if (!canManage) {
      alert('عذراً، هذه الصلاحية للمدير والأساتذة فقط.');
      return;
    }

    if (window.confirm('هل أنت متأكد من حذف هذه المادة بالكامل؟ سيتم حذف جميع الملفات بداخلها.')) {
      onUpdateCourses(prev => prev.filter(c => c.id !== courseId));
      if (expandedCourseId === courseId) {
        setExpandedCourseId(null);
      }
    }
  };

  // دالة حذف ملف واحد فقط
  const handleDeleteFile = (e: React.MouseEvent, courseId: string, fileId: string) => {
    // إيقاف انتشار الحدث
    e.stopPropagation();
    e.preventDefault();
    
    if (!canManage) {
      alert('عذراً، هذه الصلاحية للمدير والأساتذة فقط.');
      return;
    }

    if (window.confirm('هل تريد حذف هذا الملف فقط؟')) {
      onUpdateCourses(prevCourses => prevCourses.map(course => {
        // نجد المادة المطلوبة
        if (course.id === courseId) {
          // نقوم بفلترة الملفات وحذف الملف المطلوب فقط
          const updatedFiles = course.files.filter(f => f.id !== fileId);
          return {
            ...course,
            files: updatedFiles,
            lastUpdate: new Date().toLocaleString('ar-EG'),
            updatedBy: user.name // تحديث اسم من قام بالتعديل
          };
        }
        return course;
      }));
    }
  };

  const handleDownloadFile = (e: React.MouseEvent, file: MaterialFile) => {
    e.stopPropagation();
    try {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert('حدث خطأ أثناء محاولة تحميل الملف.');
      console.error(err);
    }
  };

  const handleFileUpload = (courseId: string, e: React.ChangeEvent<HTMLInputElement>, category: MaterialCategory) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (file.size > MAX_FILE_SIZE) {
      alert('حجم الملف كبير جداً! الحد الأقصى هو 150 ميجابايت.');
      return;
    }
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      alert(`صيغة الملف غير مدعومة. الصيغ المسموحة: ${ALLOWED_EXTENSIONS.join(', ')}`);
      return;
    }

    const mockUrl = URL.createObjectURL(file);

    const newFile: MaterialFile = {
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: file.name,
      url: mockUrl,
      type: ext,
      size: file.size,
      category: category,
      uploadDate: new Date().toLocaleString('ar-EG'),
      uploadedBy: user.name
    };

    onUpdateCourses(prev => prev.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          files: [...c.files, newFile],
          lastUpdate: new Date().toLocaleString('ar-EG'),
          updatedBy: user.name
        };
      }
      return c;
    }));
    e.target.value = ''; // Reset input
  };

  return (
    <div className="max-w-4xl mx-auto px-2 md:px-0 mb-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-sky-900 border-r-4 border-sky-600 pr-3">المواد الدراسية المتوفرة</h2>
        {canManage && (
          <button 
            type="button"
            onClick={() => setShowAddCourse(true)}
            className="w-full sm:w-auto bg-sky-600 text-white px-6 py-3 rounded-xl hover:bg-sky-700 shadow-md transition active:scale-95 font-bold"
          >
            + إضافة مادة جديدة
          </button>
        )}
      </div>

      {showAddCourse && (
        <form onSubmit={handleAddCourse} className="bg-white p-5 rounded-2xl shadow-xl mb-8 border border-sky-200 animate-in zoom-in-95 duration-200">
          <label className="block text-sky-800 font-bold mb-2 mr-1">اسم المادة الجديدة:</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              className="flex-grow px-4 py-3 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none w-full font-medium"
              placeholder="مثال: هندسة البرمجيات..."
              required
              autoFocus
            />
            <div className="flex gap-2 w-full sm:w-auto">
              <button type="submit" className="flex-1 sm:flex-none bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-sm active:scale-95">حفظ</button>
              <button type="button" onClick={() => setShowAddCourse(false)} className="flex-1 sm:flex-none bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition">إلغاء</button>
            </div>
          </div>
        </form>
      )}

      {courses.length === 0 ? (
        <div className="bg-white p-16 text-center rounded-3xl shadow-sm border border-sky-100 flex flex-col items-center">
           <span className="text-6xl mb-6">📚</span>
           <p className="text-gray-500 font-bold text-lg mb-2">لا توجد مواد دراسية مضافة هنا بعد.</p>
           {canManage && <p className="text-sky-600 text-sm">ابدأ بإضافة أول مادة دراسية لهذا الفصل الدراسي.</p>}
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-sky-100 overflow-hidden transition-all hover:shadow-md">
              <div 
                onClick={() => toggleExpand(course.id)}
                className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer hover:bg-sky-50/50 transition gap-4"
              >
                <div className="flex-grow">
                  <h3 className="text-lg md:text-xl font-bold text-sky-900 group-hover:text-sky-700 transition">{course.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                    <div className="flex items-center gap-1 text-[10px] md:text-xs text-sky-600 font-bold bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                      <span>🕒</span>
                      <span>آخر تحديث: {course.lastUpdate}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] md:text-xs text-gray-400 font-medium">
                      <span>👤</span>
                      <span>بواسطة {course.updatedBy}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                   {canManage && (
                     <button 
                       type="button"
                       onClick={(e) => handleDeleteCourse(e, course.id)}
                       className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition shadow-sm active:scale-90 border border-red-100 z-10"
                       title="حذف المادة نهائياً"
                     >
                       🗑️
                     </button>
                   )}
                   <button 
                     type="button"
                     onClick={(e) => { e.stopPropagation(); onDiscussion(course); }}
                     className="bg-sky-50 text-sky-600 p-3 rounded-xl hover:bg-sky-600 hover:text-white transition shadow-sm active:scale-90 border border-sky-100 z-10"
                     title="منتدى النقاش"
                   >
                     💬
                   </button>
                   <div className={`p-2 transition-transform duration-300 text-sky-400 ${expandedCourseId === course.id ? 'rotate-180' : ''}`}>
                     ▼
                   </div>
                </div>
              </div>

              {expandedCourseId === course.id && (
                <div className="p-4 md:p-6 bg-sky-50/30 border-t border-sky-50 animate-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {Object.values(MaterialCategory).map((cat) => (
                      <div key={cat} className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm flex flex-col h-full">
                        <div className="flex justify-between items-center mb-5 pb-2 border-b border-sky-50">
                          <h4 className="font-bold text-sky-800 border-r-4 border-sky-500 pr-3">{cat}</h4>
                          {canManage && (
                            <label className="cursor-pointer bg-sky-100 text-sky-600 text-[11px] px-4 py-2 rounded-xl hover:bg-sky-600 hover:text-white transition font-bold shadow-sm active:scale-95">
                              رفع ملف
                              <input 
                                type="file" 
                                className="hidden" 
                                onChange={(e) => handleFileUpload(course.id, e, cat)} 
                              />
                            </label>
                          )}
                        </div>
                        
                        <div className="space-y-3 flex-grow">
                          {course.files.filter(f => f.category === cat).map(file => (
                            <div key={file.id} className="flex justify-between items-center p-4 bg-sky-50/50 rounded-xl text-sm group border border-transparent hover:border-sky-200 transition hover:bg-white">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <span className="shrink-0 text-sky-600 font-bold text-[9px] bg-white border border-sky-100 px-2 py-1 rounded-lg uppercase shadow-xs">{file.type}</span>
                                <span className="truncate font-bold text-sky-900" title={file.name}>{file.name}</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="hidden sm:inline text-[10px] text-gray-400 font-mono mr-2">{formatBytes(file.size)}</span>
                                <button 
                                  type="button"
                                  onClick={(e) => handleDownloadFile(e, file)}
                                  className="text-white p-2.5 bg-sky-600 rounded-xl shadow-md hover:bg-sky-700 active:scale-90 transition"
                                  title="تحميل الملف"
                                >
                                  ⬇️
                                </button>
                                {canManage && (
                                  <button 
                                    type="button"
                                    onClick={(e) => handleDeleteFile(e, course.id, file.id)} 
                                    className="text-red-500 p-2.5 bg-white border border-red-100 rounded-xl shadow-sm hover:bg-red-50 active:scale-90 transition z-10"
                                    title="حذف الملف"
                                  >
                                    🗑️
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                          {course.files.filter(f => f.category === cat).length === 0 && (
                            <div className="text-center py-8 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                              <p className="text-[11px] text-gray-400 font-medium">لا توجد ملفات في هذا القسم</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
