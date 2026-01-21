
import React from 'react';
import { DepartmentType } from './types';

export const DEPARTMENTS: { id: DepartmentType; name: string; gradient: string }[] = [
  { id: 'ELECTRICAL', name: 'الهندسة الكهربائية', gradient: 'bg-gradient-to-bl from-sky-400 to-sky-600' },
  { id: 'CHEMICAL', name: 'الهندسة الكيميائية', gradient: 'bg-gradient-to-bl from-sky-400 to-sky-600' },
  { id: 'CIVIL', name: 'الهندسة المدنية', gradient: 'bg-gradient-to-bl from-sky-400 to-sky-600' },
  { id: 'MECHANICAL', name: 'الهندسة الميكانيكية', gradient: 'bg-gradient-to-bl from-sky-400 to-sky-600' },
  { id: 'BIOMEDICAL', name: 'الهندسة الطبية', gradient: 'bg-gradient-to-bl from-sky-400 to-sky-600' },
];

export const SEMESTERS = Array.from({ length: 10 }, (_, i) => i + 1);

export const ALLOWED_EXTENSIONS = ['pdf', 'exe', 'zip', 'ppt', 'pptx', 'docx', 'jpg', 'jpeg', 'png'];
export const MAX_FILE_SIZE = 150 * 1024 * 1024; // 150MB
export const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB
