export type UserType = "STUDENT" | "TEACHER" | "PARENT" | "ADMIN" | "SUPER_ADMIN" | string;

export interface User {
    username: string,
    role: string
    institutionId: number,
}

export interface Usuario {
    id: number;
    username: string;
    email: string;
    userType: string;
  }

  interface AuthContextType {
    token: string | null;
    login: (token: string, userData: User) => void;
    logout: () => void;
    isloading: boolean;
    user: User | null;
}

export interface Course {
    id: number;
    name: string;
    teacherName: string;
    period: string;
}

export interface Activity {
    id: number;
    title: string;
    completed: boolean;
    courseName: string;
    dueDate: string;
}

// Tipado para los ítems del menú
export type MenuItem = {
    icons: JSX.Element;
    label: string;
    href: string;
  };


  interface Institution {
    id: number;
    name: string;
  }
  
  interface AcademicLevel {
    id: number;
    name: string;
  }
  
  interface Grade {
    id: number;
    name: string;
    academicLevelId: number;
  }

  export interface Section {
    id?: number;
    name: string;
    courseId: number;
    teacherId: number;
    studentIds: number[];
    academicLevelId?: number;
    academicLevelName?:string;
    gradeId?: number;
    gradeName?:string;
    courseName?:string;
    teacherFullName?:string;
    institutionName?:string
  }
  
  export interface Student {
    id: number;
    name: string;
    lastName: string;
  }

  export interface StudentInSectionResponse {
    id: number;
    name: string;
    lastname: string;
    email: string;
    grade: string;
    academicLevel: string;
  }

  export interface StudentWithAverageResponse {
    studentId: number;
    studentName: string;
    averageGrade: number;
  }