import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { 
  LogOut, 
  Calendar, 
  Users, 
  Stethoscope, 
  Pill, 
  LayoutDashboard,
  Activity,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onNavigate: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate }) => {
  const { currentUser, logout } = useClinic();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!currentUser) return <>{children}</>;

  const getMenuItems = () => {
    switch (currentUser.role) {
      case 'receptionist':
        return [
          { id: 'reception_dashboard', label: 'Appointments', icon: Calendar },
          { id: 'reception_patients', label: 'Patient Registry', icon: Users },
        ];
      case 'doctor':
        return [
          { id: 'doctor_dashboard', label: 'My Queue', icon: Stethoscope },
          { id: 'doctor_history', label: 'Patient History', icon: Users },
        ];
      case 'pharmacist':
        return [
          { id: 'pharmacy_dashboard', label: 'Dispensing', icon: Pill },
          { id: 'pharmacy_history', label: 'Order History', icon: LayoutDashboard },
        ];
      case 'admin':
        return [
          { id: 'admin_overview', label: 'System Overview', icon: LayoutDashboard },
          { id: 'reception_dashboard', label: 'Reception View', icon: Calendar },
          { id: 'doctor_dashboard', label: 'Doctor View', icon: Stethoscope },
          { id: 'pharmacy_dashboard', label: 'Pharmacy View', icon: Pill },
        ];
      default:
        return [];
    }
  };

  const handleNavigate = (id: string) => {
    onNavigate(id);
    setIsSidebarOpen(false); // Close menu on mobile/tablet after selection
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans relative overflow-hidden">
      {/* Subtle Medical Background Pattern for internal pages */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&q=80&w=2000")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Mobile/Tablet Overlay Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-xl lg:shadow-sm
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center text-white shadow-md">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">VisionCare</h1>
              <p className="text-xs text-brand-600 font-semibold uppercase tracking-wider">{currentUser.role}</p>
            </div>
          </div>
          {/* Mobile/Tablet Close Button */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600 p-1"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {getMenuItems().map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeView === item.id
                  ? 'bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={20} className={activeView === item.id ? 'text-brand-600' : 'text-gray-400'} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="mb-4 px-4">
            <p className="text-sm font-bold text-gray-900">{currentUser.name}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Online • ID: {currentUser.id}
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-full relative z-10 lg:ml-64 transition-all duration-300">
        
        {/* Mobile/Tablet Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
           <div className="flex items-center gap-3">
             <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md"
             >
                <Menu size={24} />
             </button>
             <span className="font-bold text-gray-900 text-lg">VisionCare</span>
           </div>
           <div className="w-8 h-8 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center font-bold text-sm">
              {currentUser.name.charAt(0)}
           </div>
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};