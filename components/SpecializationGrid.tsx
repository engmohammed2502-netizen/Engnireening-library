
import React from 'react';
import { DEPARTMENTS } from '../constants';
import { DepartmentType } from '../types';

interface SpecializationGridProps {
  onSelect: (dept: DepartmentType) => void;
}

const SpecializationGrid: React.FC<SpecializationGridProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl md:text-2xl font-bold text-sky-900 mb-8 border-b-2 border-sky-400 pb-2">اختر التخصص الهندسي</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl px-4 md:px-0">
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept.id}
            onClick={() => onSelect(dept.id)}
            className={`${dept.gradient} hover:scale-[1.03] active:scale-95 transform transition-all duration-300 rounded-3xl p-8 text-white shadow-lg flex flex-col items-center justify-center h-52 group border border-sky-300/30`}
          >
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-white/30 transition">
              <span className="text-4xl group-hover:rotate-12 transition duration-500">⚙️</span>
            </div>
            <span className="text-lg md:text-xl font-extrabold tracking-wide">{dept.name}</span>
            <span className="text-xs mt-3 opacity-90 bg-black/10 px-3 py-1 rounded-full">استكشف المراجع والمحاضرات</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SpecializationGrid;
