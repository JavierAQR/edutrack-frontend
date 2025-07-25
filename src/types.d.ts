export type UserType = "STUDENT" | "TEACHER" | "PARENT" | "ADMIN" | "SUPER_ADMIN" | string;

export interface User {
    username: string,
    role: string
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
  