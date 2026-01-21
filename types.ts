
export enum UserRole {
  ROOT = 'ROOT',
  ADMIN = 'ADMIN', // Professors
  STUDENT = 'STUDENT',
  GUEST = 'GUEST'
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  password?: string;
  isLocked?: boolean;
  failedAttempts?: number;
}

export type DepartmentType = 'ELECTRICAL' | 'CHEMICAL' | 'CIVIL' | 'MECHANICAL' | 'BIOMEDICAL';

export enum MaterialCategory {
  LECTURE = 'محاضرة',
  REFERENCE = 'مرجع',
  EXERCISE = 'تمارين',
  EXAM = 'امتحان'
}

export interface MaterialFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  category: MaterialCategory;
  uploadDate: string;
  uploadedBy: string;
}

export interface Course {
  id: string;
  name: string;
  department: DepartmentType;
  semester: number;
  files: MaterialFile[];
  lastUpdate: string;
  updatedBy: string;
}

export interface Message {
  id: string;
  courseId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  timestamp: string;
  imageUrl?: string;
}

export interface AppStats {
  activeUsers: number;
  totalStudents: number;
  totalProfessors: number;
  currentGuests: number;
  mostDownloaded: { name: string; count: number }[];
  recentLogs: string[];
}
