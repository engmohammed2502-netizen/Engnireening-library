
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface AdminPanelProps {
  users: User[];
  onUpdateUsers: (updater: (prev: User[]) => User[]) => void;
  currentUser: User;
  onUpdateUniLogo: (url: string) => void;
  onUpdateCollegeLogo: (url: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ users, onUpdateUsers, currentUser, onUpdateUniLogo, onUpdateCollegeLogo }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>(UserRole.STUDENT);
  const [newPassword, setNewPassword] = useState('');

  const isRoot = currentUser.role === UserRole.ROOT;

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newName || !newPassword) return;

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: newUsername,
      name: newName,
      role: newRole,
      password: newPassword,
      failedAttempts: 0,
      isLocked: false
    };

    onUpdateUsers(prev => [...prev, newUser]);
    setShowAdd(false);
    setNewUsername('');
    setNewName('');
    setNewPassword('');
  };

  const handleLogoUpload = (type: 'UNI' | 'COLLEGE', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      if (type === 'UNI') onUpdateUniLogo(url);
      else onUpdateCollegeLogo(url);
    };
    reader.readAsDataURL(file);
  };

  const toggleLock = (userToToggle: User) => {
    if (userToToggle.username === 'zero') {
      alert('لا يمكن تجميد حساب المدير العام الرئيسي (zero).');
      return;
    }
    if (userToToggle.role === UserRole.ROOT && !isRoot) {
      alert('لا تملك الصلاحية لتجميد حساب مدير عام.');
      return;
    }

    onUpdateUsers(prev => prev.map(u => 
      u.id === userToToggle.id ? { ...u, isLocked: !u.isLocked } : u
    ));
  };

  // دالة حذف المستخدمين المحسنة
  const deleteUser = (e: React.MouseEvent, userToDelete: User) => {
    e.preventDefault();

    // 1. حماية حساب الروت الأصلي
    if (userToDelete.username === 'zero') {
      alert('⚠️ تنبيه أمني: لا يمكن حذف حساب المدير العام الرئيسي (zero) نهائياً.');
      return;
    }

    // 2. حماية حذف المستخدم لنفسه
    if (userToDelete.id === currentUser.id) {
      alert('لا يمكنك حذف حسابك الحالي وأنت تستخدمه.');
      return;
    }

    // 3. التحقق من الصلاحيات الهرمية
    // الأستاذ (ADMIN) يمكنه حذف الطلاب (STUDENT) فقط
    if (currentUser.role === UserRole.ADMIN && userToDelete.role !== UserRole.STUDENT) {
      alert('عذراً، بصفتك أستاذاً يمكنك حذف حسابات الطلاب فقط. لا يمكنك حذف الأساتذة أو المدراء.');
      return;
    }

    // الروت (ROOT) يمكنه حذف أي شخص ما عدا zero (تم التحقق منه أعلاه)
    // لكن زيادة في التأكيد، إذا كان هناك روت آخر
    if (currentUser.role !== UserRole.ROOT && userToDelete.role === UserRole.ROOT) {
      alert('لا تملك الصلاحية لحذف حساب مدير عام.');
      return;
    }

    if (window.confirm(`هل أنت متأكد تماماً من حذف المستخدم "${userToDelete.name}"؟ لا يمكن التراجع عن هذا الإجراء.`)) {
      onUpdateUsers(prev => prev.filter(u => u.id !== userToDelete.id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Logo Management - ROOT ONLY */}
      {isRoot && (
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-purple-100">
          <h2 className="text-xl font-extrabold text-purple-900 mb-6 flex items-center gap-2">
            <span className="bg-purple-100 p-2 rounded-xl">🖼️</span>
            إدارة شعارات المؤسسة (خاص بالمدير zero)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 flex flex-col items-center">
               <p className="font-bold text-sky-800 mb-3">شعار الجامعة (يمين)</p>
               <input 
                 type="file" 
                 accept="image/*" 
                 onChange={(e) => handleLogoUpload('UNI', e)}
                 className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-sky-600 file:text-white hover:file:bg-sky-700"
               />
            </div>
            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 flex flex-col items-center">
               <p className="font-bold text-sky-800 mb-3">شعار الكلية (يسار)</p>
               <input 
                 type="file" 
                 accept="image/*" 
                 onChange={(e) => handleLogoUpload('COLLEGE', e)}
                 className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-sky-800 file:text-white hover:file:bg-sky-900"
               />
            </div>
          </div>
        </div>
      )}

      {/* User Management Section */}
      <div className="bg-white p-6 rounded-3xl shadow-lg border border-sky-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-sky-900">إدارة المستخدمين</h2>
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="bg-sky-600 text-white px-5 py-2 rounded-xl hover:bg-sky-700 transition font-bold shadow-md active:scale-95"
          >
            {showAdd ? 'إغلاق' : '+ مستخدم جديد'}
          </button>
        </div>

        {showAdd && (
          <form onSubmit={handleAddUser} className="bg-sky-50 p-6 rounded-2xl mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 border border-sky-200">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-sky-800 mr-2">الاسم الكامل</label>
              <input 
                type="text" value={newName} onChange={e => setNewName(e.target.value)}
                placeholder="مثال: د. محمد علي" className="p-3 rounded-xl border border-sky-200 outline-none focus:ring-2 focus:ring-sky-500" required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-sky-800 mr-2">المعرف (رقم جامعي/اسم دخول)</label>
              <input 
                type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)}
                placeholder="اسم الدخول" className="p-3 rounded-xl border border-sky-200 outline-none focus:ring-2 focus:ring-sky-500" required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-sky-800 mr-2">كلمة المرور (بحد أقصى 12)</label>
              <input 
                type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                placeholder="كلمة المرور" maxLength={12} className="p-3 rounded-xl border border-sky-200 outline-none focus:ring-2 focus:ring-sky-500" required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-sky-800 mr-2">نوع الحساب</label>
              <select 
                value={newRole} onChange={e => setNewRole(e.target.value as UserRole)}
                className="p-3 rounded-xl border border-sky-200 outline-none focus:ring-2 focus:ring-sky-500 font-bold"
              >
                <option value={UserRole.STUDENT}>طالب (Student)</option>
                <option value={UserRole.ADMIN}>دكتور / أستاذ (Admin)</option>
                {isRoot && <option value={UserRole.ROOT}>مشرف عام (Root)</option>}
              </select>
            </div>
            <button type="submit" className="bg-sky-600 text-white p-3 rounded-xl col-span-full font-bold shadow-lg hover:bg-sky-700 transition active:scale-95">إضافة المستخدم الجديد</button>
          </form>
        )}

        <div className="overflow-x-auto rounded-xl border border-sky-100">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-sky-50 text-sky-800 font-naskh">
                <th className="p-4 border-b font-extrabold">الاسم والمعرف</th>
                <th className="p-4 border-b font-extrabold text-center">الدور</th>
                <th className="p-4 border-b font-extrabold text-center">الحالة</th>
                <th className="p-4 border-b font-extrabold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 border-b transition">
                  <td className="p-4">
                    <div className="font-bold text-sky-900">{u.name}</div>
                    <div className="text-[10px] text-gray-500 font-mono tracking-tight">{u.username}</div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border inline-block ${
                      u.role === UserRole.ROOT ? 'bg-purple-100 text-purple-700 border-purple-200' :
                      u.role === UserRole.ADMIN ? 'bg-sky-100 text-sky-700 border-sky-200' : 
                      'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>
                      {u.role === UserRole.ROOT ? 'مدير عام' : u.role === UserRole.ADMIN ? 'أستاذ' : 'طالب'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {u.isLocked ? (
                      <span className="inline-flex items-center gap-1 text-red-500 text-[10px] font-extrabold">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        مجمد
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-green-500 text-[10px] font-extrabold">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        نشط
                      </span>
                    )}
                  </td>
                  <td className="p-4 flex gap-2 justify-center">
                    {u.username !== 'zero' ? (
                      <>
                        <button 
                          onClick={() => toggleLock(u)}
                          className={`text-[10px] px-3 py-1.5 rounded-lg border font-bold transition shadow-xs active:scale-95 ${u.isLocked ? 'border-green-500 text-green-600 hover:bg-green-50' : 'border-amber-500 text-amber-600 hover:bg-amber-50'}`}
                        >
                          {u.isLocked ? 'فك تجميد' : 'تجميد'}
                        </button>
                        <button 
                          onClick={(e) => deleteUser(e, u)}
                          className="text-[10px] px-3 py-1.5 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 font-bold transition shadow-xs active:scale-95"
                        >حذف</button>
                      </>
                    ) : (
                      <span className="text-[10px] text-gray-300 italic">حساب محمي</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
