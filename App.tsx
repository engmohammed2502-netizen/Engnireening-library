
import React, { useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  DepartmentType, 
  Course, 
  AppStats, 
  Message 
} from './types';
import { DEPARTMENTS, SEMESTERS } from './constants';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SpecializationGrid from './components/SpecializationGrid';
import SemesterGrid from './components/SemesterGrid';
import CourseList from './components/CourseList';
import DiscussionForum from './components/DiscussionForum';
import AdminPanel from './components/AdminPanel';

type ViewState = 
  | 'LOGIN' 
  | 'HOME' 
  | 'SEMESTER_SELECT' 
  | 'COURSE_LIST' 
  | 'COURSE_DETAILS' 
  | 'DISCUSSION' 
  | 'ROOT_DASHBOARD'
  | 'ADMIN_PANEL';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('LOGIN');
  const [selectedDept, setSelectedDept] = useState<DepartmentType | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  const [uniLogo, setUniLogo] = useState<string | null>(null);
  const [collegeLogo, setCollegeLogo] = useState<string | null>(null);

  const [courses, setCourses] = useState<Course[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([
    { id: '1', username: 'zero', name: 'المدير العام (zero)', role: UserRole.ROOT, password: '975312468qq' }
  ]);
  
  const [stats, setStats] = useState<AppStats>({
    activeUsers: 1,
    totalStudents: 0,
    totalProfessors: 1,
    currentGuests: 0,
    mostDownloaded: [],
    recentLogs: ['نظام المكتبة جاهز للعمل']
  });

  useEffect(() => {
    let timer: number;
    if (currentUser?.role === UserRole.GUEST) {
      timer = window.setTimeout(() => {
        handleLogout();
        alert('انتهت جلسة الضيف (30 دقيقة). يرجى تسجيل الدخول مرة أخرى.');
      }, 30 * 60 * 1000);
    }
    return () => clearTimeout(timer);
  }, [currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('HOME');
    setStats(prev => ({
      ...prev,
      activeUsers: prev.activeUsers + 1,
      currentGuests: user.role === UserRole.GUEST ? prev.currentGuests + 1 : prev.currentGuests,
      recentLogs: [`دخول المستخدم: ${user.name}`, ...prev.recentLogs]
    }));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('LOGIN');
    setSelectedDept(null);
    setSelectedSemester(null);
    setSelectedCourse(null);
  };

  const navigateBack = () => {
    if (currentView === 'SEMESTER_SELECT') setCurrentView('HOME');
    else if (currentView === 'COURSE_LIST') setCurrentView('SEMESTER_SELECT');
    else if (currentView === 'DISCUSSION' || currentView === 'COURSE_DETAILS') setCurrentView('COURSE_LIST');
    else if (currentView === 'ROOT_DASHBOARD' || currentView === 'ADMIN_PANEL') setCurrentView('HOME');
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col font-sans">
      <header className="bg-white shadow-sm p-4 md:p-6 border-b border-sky-100">
        <div className="container mx-auto">
          <div className="flex justify-between items-center gap-2">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-sky-100 rounded-xl flex items-center justify-center overflow-hidden border-2 border-sky-200 shadow-sm shrink-0">
              {uniLogo ? <img src={uniLogo} className="w-full h-full object-cover" alt="Uni Logo" /> : <span className="text-[10px] font-bold text-sky-600 text-center px-1">شعار الجامعة</span>}
            </div>

            <div className="text-center flex flex-col justify-center">
              <h1 className="text-lg md:text-3xl font-extrabold text-sky-900 leading-tight">كلية الهندسة</h1>
              <h1 className="text-lg md:text-2xl font-bold text-sky-800 leading-tight">جامعة البحر الأحمر</h1>
              <h2 className="text-sky-500 font-bold text-base md:text-xl mt-1">المكتبة الإلكترونية</h2>
            </div>

            <div className="w-16 h-16 md:w-24 md:h-24 bg-sky-100 rounded-xl flex items-center justify-center overflow-hidden border-2 border-sky-200 shadow-sm shrink-0">
              {collegeLogo ? <img src={collegeLogo} className="w-full h-full object-cover" alt="College Logo" /> : <span className="text-[10px] font-bold text-sky-600 text-center px-1">شعار الكلية</span>}
            </div>
          </div>

          {currentUser && (
            <div className="flex flex-col sm:flex-row justify-center sm:justify-end items-center gap-3 mt-6 pt-4 border-t border-sky-50">
               <span className="text-xs md:text-sm text-sky-700 font-bold bg-sky-50 border border-sky-200 px-4 py-2 rounded-full">مرحباً، {currentUser.name}</span>
               <button 
                onClick={handleLogout}
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-bold transition shadow-sm active:scale-95"
               >
                 تسجيل الخروج
               </button>
            </div>
          )}
        </div>
      </header>

      {currentUser && (
        <nav className="bg-white border-b border-sky-100 py-2 sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto flex flex-wrap items-center justify-between px-4 gap-2">
             <div className="flex gap-2">
               {currentView !== 'HOME' && (
                 <button 
                   onClick={navigateBack}
                   className="flex items-center gap-1 text-sky-700 hover:text-sky-900 font-bold bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-lg text-sm transition"
                 >
                   <span>السابق</span>
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                 </button>
               )}
               {currentView !== 'HOME' && (
                 <button 
                   onClick={() => setCurrentView('HOME')}
                   className="flex items-center gap-1 text-sky-700 hover:text-sky-900 font-bold bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-lg text-sm transition"
                 >
                   <span>الرئيسية</span>
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                 </button>
               )}
             </div>

             <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {currentUser.role === UserRole.ROOT && (
                  <button 
                    onClick={() => setCurrentView('ROOT_DASHBOARD')}
                    className="whitespace-nowrap bg-purple-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-md hover:bg-purple-700 transition"
                  >لوحة التحكم</button>
                )}
                {(currentUser.role === UserRole.ROOT || currentUser.role === UserRole.ADMIN) && (
                  <button 
                    onClick={() => setCurrentView('ADMIN_PANEL')}
                    className="whitespace-nowrap bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-md hover:bg-indigo-700 transition"
                  >إدارة المستخدمين</button>
                )}
             </div>
          </div>
        </nav>
      )}

      <main className="flex-grow container mx-auto p-4 md:p-8">
        {currentView === 'LOGIN' && (
          <Login onLogin={handleLogin} users={allUsers} />
        )}

        {currentView === 'HOME' && (
          <SpecializationGrid onSelect={(dept) => {
            setSelectedDept(dept);
            setCurrentView('SEMESTER_SELECT');
          }} />
        )}

        {currentView === 'SEMESTER_SELECT' && (
          <SemesterGrid onSelect={(sem) => {
            setSelectedSemester(sem);
            setCurrentView('COURSE_LIST');
          }} />
        )}

        {currentView === 'COURSE_LIST' && (
          <CourseList 
            courses={courses.filter(c => c.department === selectedDept && c.semester === selectedSemester)}
            user={currentUser!}
            currentDept={selectedDept!}
            currentSemester={selectedSemester!}
            onSelect={(course) => {
              setSelectedCourse(course);
              setCurrentView('COURSE_DETAILS');
            }}
            onDiscussion={(course) => {
              setSelectedCourse(course);
              setCurrentView('DISCUSSION');
            }}
            onUpdateCourses={setCourses}
          />
        )}

        {currentView === 'DISCUSSION' && selectedCourse && (
          <DiscussionForum 
            course={selectedCourse} 
            user={currentUser!} 
            messages={messages.filter(m => m.courseId === selectedCourse.id)}
            onSendMessage={(msg) => setMessages(prev => [...prev, msg])}
            onDeleteMessage={(id) => setMessages(prev => prev.filter(m => m.id !== id))}
            onClose={() => setCurrentView('COURSE_LIST')}
          />
        )}

        {currentView === 'ROOT_DASHBOARD' && (stats && <Dashboard stats={stats} />)}

        {currentView === 'ADMIN_PANEL' && (
          <AdminPanel 
            users={allUsers} 
            onUpdateUsers={setAllUsers} 
            currentUser={currentUser!}
            onUpdateUniLogo={setUniLogo}
            onUpdateCollegeLogo={setCollegeLogo}
          />
        )}
      </main>

      <footer className="bg-sky-900 text-white p-6 text-center text-sm">
        <p className="font-bold">جميع الحقوق محفوظة &copy; {new Date().getFullYear()} كلية الهندسة - جامعة البحر الأحمر</p>
        <p className="mt-1 opacity-70 text-[10px]">نظام إدارة المكتبة الهندسية المتكامل - تم التصميم بواسطة الباش مهندس Zero</p>
      </footer>
    </div>
  );
};

export default App;
