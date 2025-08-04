import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LoginForm } from "./components/auth/LoginForm";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { Dashboard } from "./components/dashboard/Dashboard";
import { ComponentsList } from "./components/components/ComponentsList";
import { InventoryMovementComponent } from "./components/inventory/InventoryMovement";
import { UserManagement } from "./components/users/UserManagement";
import { Reports } from "./components/reports/Reports";

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "components":
        return <ComponentsList />;
      case "inward":
        return <InventoryMovementComponent type="inward" />;
      case "outward":
        return <InventoryMovementComponent type="outward" />;
      case "reports":
        return <Reports />;
      case "users":
        return user.role === "admin" ? <UserManagement /> : <Dashboard />;
      case "settings":
        return user.role === "admin" ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Settings page coming soon...</p>
          </div>
        ) : (
          <Dashboard />
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        <Sidebar
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isOpen={isMobileMenuOpen}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            onMenuToggle={handleMenuToggle}
            isMobileMenuOpen={isMobileMenuOpen}
          />

          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8">{renderCurrentPage()}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
