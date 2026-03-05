'use client';
import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminFooter from '@/components/admin/AdminFooter';

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>

        <AdminFooter />
      </div>
    </div>
  );
}

export default function AdminRootLayout({ children }) {
  return (
    <ProtectedRoute adminOnly>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}