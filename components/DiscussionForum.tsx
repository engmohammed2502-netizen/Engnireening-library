
import React, { useState, useRef } from 'react';
import { Course, User, Message, UserRole } from '../types';
import { MAX_IMAGE_SIZE } from '../constants';

interface DiscussionForumProps {
  course: Course;
  user: User;
  messages: Message[];
  onSendMessage: (msg: Message) => void;
  onDeleteMessage: (id: string) => void;
  onClose: () => void;
}

const DiscussionForum: React.FC<DiscussionForumProps> = ({ course, user, messages, onSendMessage, onDeleteMessage, onClose }) => {
  const [inputText, setInputText] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !previewImage) return;

    if (user.role === UserRole.GUEST) {
      alert('الزوار لا يمكنهم المشاركة في النقاش.');
      return;
    }

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      courseId: course.id,
      senderName: user.name,
      senderRole: user.role,
      content: inputText,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      imageUrl: previewImage || undefined
    };

    onSendMessage(newMessage);
    setInputText('');
    setPreviewImage(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      alert('حجم الصورة كبير جداً (الأقصى 3 ميجابايت)');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[75vh] md:h-[70vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-sky-100 mb-8 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-gradient-to-r from-sky-600 to-sky-800 p-5 text-white flex justify-between items-center shadow-md">
        <div>
          <h2 className="font-extrabold text-lg md:text-xl">منتدى النقاش: {course.name}</h2>
          <p className="text-[10px] md:text-xs opacity-90 mt-0.5">تبادل الخبرات والأسئلة مع مجتمع الكلية</p>
        </div>
        <button 
          onClick={onClose}
          className="bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center transition shadow-inner font-bold active:scale-90"
          title="إغلاق المنتدى"
        >
          ✕
        </button>
      </div>

      <div className="flex-grow p-4 md:p-6 overflow-y-auto space-y-4 bg-sky-50/20">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-sky-300 text-center px-8">
             <span className="text-5xl mb-3">💬</span>
             <p className="italic font-medium text-sky-400">لا توجد رسائل بعد. كن أول من يطرح سؤالاً أو يشارك فائدة!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.senderName === user.name ? 'items-start' : 'items-end'}`}>
               <div className={`max-w-[90%] md:max-w-[80%] rounded-2xl p-4 shadow-sm border ${
                 msg.senderRole === UserRole.ADMIN || msg.senderRole === UserRole.ROOT 
                   ? 'bg-sky-800 text-white border-sky-900' 
                   : msg.senderName === user.name 
                     ? 'bg-sky-100 text-sky-900 border-sky-200' 
                     : 'bg-white text-gray-800 border-gray-100'
               }`}>
                  <div className="flex justify-between items-center gap-6 mb-2 border-b border-sky-500/20 pb-1.5">
                    <span className="text-[10px] font-extrabold tracking-tight">{msg.senderName}</span>
                    <span className="text-[9px] opacity-60 font-mono">{msg.timestamp}</span>
                  </div>
                  {msg.content && <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap">{msg.content}</p>}
                  {msg.imageUrl && (
                    <div className="mt-3 overflow-hidden rounded-xl border border-black/10 bg-black/5">
                      <img 
                        src={msg.imageUrl} 
                        alt="attached" 
                        className="w-full h-auto object-contain max-h-[300px] block mx-auto" 
                        onError={(e) => {
                          console.error("Image failed to load", msg.imageUrl);
                          // Optional: e.currentTarget.src = 'fallback-image-url';
                        }}
                      />
                    </div>
                  )}
                  {(user.role === UserRole.ROOT || user.role === UserRole.ADMIN) && (
                    <button 
                      onClick={() => onDeleteMessage(msg.id)}
                      className="mt-3 text-[10px] text-red-400 hover:text-red-500 font-bold underline decoration-dotted"
                    >حذف هذه الرسالة</button>
                  )}
               </div>
            </div>
          ))
        )}
      </div>

      {user.role !== UserRole.GUEST && (
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-sky-100 space-y-3">
          {previewImage && (
            <div className="relative inline-block">
              <img src={previewImage} className="h-24 w-24 object-cover rounded-xl border-2 border-sky-400 shadow-md" alt="preview" />
              <button 
                type="button" 
                onClick={() => setPreviewImage(null)}
                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-7 h-7 text-sm flex items-center justify-center shadow-lg active:scale-90 border-2 border-white"
              >×</button>
            </div>
          )}
          <div className="flex items-center gap-2 w-full">
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-sky-50 text-sky-600 p-3 rounded-xl hover:bg-sky-100 transition shadow-sm border border-sky-200 active:scale-95 flex items-center justify-center"
              title="إرفاق صورة"
            >
              <span className="text-xl">🖼️</span>
            </button>
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب رسالتك أو استفسارك هنا..."
              className="flex-grow px-4 py-3 border border-sky-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none w-0 min-w-0 font-medium"
            />
            <button 
              type="submit"
              className="bg-sky-600 text-white px-5 md:px-8 py-3 rounded-xl hover:bg-sky-700 transition font-extrabold shadow-lg active:scale-95 whitespace-nowrap"
            >إرسال</button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageSelect}
          />
        </form>
      )}
    </div>
  );
};

export default DiscussionForum;
