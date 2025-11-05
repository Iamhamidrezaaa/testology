import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">سلام، به داشبورد روان‌شناختی‌ات خوش اومدی!</h1>
      {children}
    </div>
  );
} 