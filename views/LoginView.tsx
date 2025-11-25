import React from 'react';
import { useClinic } from '../context/ClinicContext';
import { UserRole } from '../types';
import { Shield, Stethoscope, Pill, Calendar, Activity } from 'lucide-react';

export const LoginView = () => {
  const { login } = useClinic();

  const RoleButton = ({ 
    role, 
    icon: Icon, 
    label, 
    desc,
    colorClasses 
  }: { 
    role: UserRole; 
    icon: any; 
    label: string; 
    desc: string;
    colorClasses: { bg: string, text: string, hover: string, iconBg: string }
  }) => (
    <button
      onClick={() => login(role)}
      className={`relative overflow-hidden flex flex-col items-center justify-center p-8 bg-white/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 group text-left w-full h-full`}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 ${colorClasses.bg} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:opacity-20`} />
      
      <div className={`w-16 h-16 rounded-2xl ${colorClasses.iconBg} ${colorClasses.text} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={32} strokeWidth={1.5} />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">{label}</h3>
      <p className="text-sm text-gray-500 text-center leading-relaxed">{desc}</p>
    </button>
  );

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80&w=2560")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Medical Blue Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-cyan-900/85 to-teal-900/80 z-0 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full max-w-6xl flex flex-col items-center gap-12">
        
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in-down">
          <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl mb-4 ring-1 ring-white/30">
            <Activity className="text-white w-12 h-12" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg">
            VisionCare <span className="text-cyan-300">System</span>
          </h1>
          <p className="text-xl text-cyan-100 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
            Advanced unified portal for clinical management, patient care, and pharmaceutical dispensing.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          <RoleButton 
            role="receptionist" 
            icon={Calendar} 
            label="Reception" 
            desc="Patient registry, appointments, and scheduling management."
            colorClasses={{
              bg: 'bg-blue-500', 
              text: 'text-blue-600', 
              hover: 'group-hover:bg-blue-100',
              iconBg: 'bg-blue-50'
            }}
          />
          <RoleButton 
            role="doctor" 
            icon={Stethoscope} 
            label="Doctor" 
            desc="Medical consultations, digital prescriptions, and history."
            colorClasses={{
              bg: 'bg-indigo-500', 
              text: 'text-indigo-600', 
              hover: 'group-hover:bg-indigo-100',
              iconBg: 'bg-indigo-50'
            }}
          />
          <RoleButton 
            role="pharmacist" 
            icon={Pill} 
            label="Pharmacy" 
            desc="Prescription fulfillment, medication billing, and dispensing."
            colorClasses={{
              bg: 'bg-emerald-500', 
              text: 'text-emerald-600', 
              hover: 'group-hover:bg-emerald-100',
              iconBg: 'bg-emerald-50'
            }}
          />
          <RoleButton 
            role="admin" 
            icon={Shield} 
            label="Admin" 
            desc="Full system overview, user controls, and data management."
            colorClasses={{
              bg: 'bg-purple-500', 
              text: 'text-purple-600', 
              hover: 'group-hover:bg-purple-100',
              iconBg: 'bg-purple-50'
            }}
          />
        </div>

        <div className="mt-8 flex items-center gap-2 text-cyan-200/60 text-sm font-medium">
          <Shield size={14} />
          <span>Secure Clinical Environment • Authorized Access Only</span>
        </div>
      </div>
    </div>
  );
};