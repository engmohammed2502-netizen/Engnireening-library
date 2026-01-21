
import React from 'react';
import { SEMESTERS } from '../constants';

interface SemesterGridProps {
  onSelect: (sem: number) => void;
}

const SemesterGrid: React.FC<SemesterGridProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold text-sky-900 mb-8 border-b-2 border-sky-500 pb-2">اختر الفصل الدراسي</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full max-w-4xl">
        {SEMESTERS.map((sem) => (
          <button
            key={sem}
            onClick={() => onSelect(sem)}
            className="bg-white border-2 border-sky-200 hover:border-sky-500 hover:bg-sky-50 rounded-xl p-6 transition shadow-sm flex flex-col items-center justify-center group"
          >
            <span className="text-sm text-sky-600 mb-1">فصل</span>
            <span className="text-3xl font-bold text-sky-900">{sem}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SemesterGrid;
