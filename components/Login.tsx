
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { sanitizeInput, isPotentiallyMalicious } from '../utils/security';

interface LoginProps {
  onLogin: (user: User) => void;
  users: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, users }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [guestName, setGuestName] = useState('');
  const [error, setError] = useState('');
  const [loginMode, setLoginMode] = useState<'AUTH' | 'GUEST'>('AUTH');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isPotentiallyMalicious(username) || isPotentiallyMalicious(password)) {
      setError('تم اكتشاف مدخلات غير آمنة!');
      return;
    }

    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      if (user.isLocked) {
        setError('هذا الحساب مجمد لمدة 24 ساعة بسبب محاولات خاطئة. تواصل مع المشرف.');
        return;
      }
      onLogin(user);
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة.');
      // Logic for locking after 5 attempts would go here in a real app
    }
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    
    onLogin({
      id: `guest-${Date.now()}`,
      username: `guest-${guestName}`,
      name: `زائر: ${guestName}`,
      role: UserRole.GUEST
    });
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white rounded-2xl shadow-xl overflow-hidden border border-sky-100">
      <div className="bg-sky-600 p-8 text-center text-white">
        <h2 className="text-2xl font-bold">بوابة مكتبة الهندسة</h2>
        <p className="mt-2 opacity-90">جامعة البحر الأحمر</p>
      </div>

      <div className="p-8">
        <div className="flex mb-6 bg-sky-50 rounded-lg p-1">
          <button 
            onClick={() => setLoginMode('AUTH')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${loginMode === 'AUTH' ? 'bg-white text-sky-700 shadow' : 'text-sky-600'}`}
          >تسجيل دخول</button>
          <button 
            onClick={() => setLoginMode('GUEST')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition ${loginMode === 'GUEST' ? 'bg-white text-sky-700 shadow' : 'text-sky-600'}`}
          >دخول كزائر</button>
        </div>

        {loginMode === 'AUTH' ? (
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الرقم الجامعي / اسم الدكتور</label>
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                placeholder="أدخل المعرف الخاص بك"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                placeholder="12 خانة كحد أقصى"
                maxLength={12}
                required
              />
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            
            <button 
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-lg transition shadow-lg mt-4"
            >
              تسجيل الدخول
            </button>
          </form>
        ) : (
          <form onSubmit={handleGuestSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
              <input 
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                placeholder="أدخل اسمك للمتابعة"
                required
              />
            </div>
            <p className="text-xs text-sky-600 bg-sky-50 p-3 rounded leading-relaxed">
              * الدخول كزائر يمنحك صلاحية عرض وتنزيل المواد فقط. تنتهي الجلسة تلقائياً بعد 30 دقيقة.
            </p>
            <button 
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-lg transition shadow-lg mt-4"
            >
              دخول مباشر
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            فقدت كلمة المرور؟ <br/>
            الطلاب: يرجى التواصل مع دكتور المادة.<br/>
            الأساتذة: يرجى التواصل مع المشرف (zero).
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
