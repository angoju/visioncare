import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  ClinicContextType, 
  User, 
  UserRole, 
  Patient, 
  Appointment, 
  AppointmentStatus, 
  Prescription, 
  PharmacyOrder, 
  OrderStatus 
} from '../types';

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

// Mock Data
const MOCK_PATIENTS: Patient[] = [
  { id: 'p1', name: 'John Doe', age: 45, phone: '555-0101', address: '123 Main St', createdAt: new Date().toISOString() },
  { id: 'p2', name: 'Jane Smith', age: 32, phone: '555-0102', address: '456 Oak Ave', createdAt: new Date().toISOString() },
];

const MOCK_APPOINTMENTS: Appointment[] = [
  { 
    id: 'a1', 
    patientId: 'p1', 
    patientName: 'John Doe',
    doctorId: 'd1', 
    date: new Date().toISOString().split('T')[0], 
    time: '09:00', 
    description: 'Blurry vision in right eye', 
    status: 'scheduled' 
  },
];

export const ClinicProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [pharmacyOrders, setPharmacyOrders] = useState<PharmacyOrder[]>([]);

  const login = (role: UserRole) => {
    setCurrentUser({
      id: 'u1',
      name: role === 'doctor' ? 'Gregory House' : role === 'pharmacist' ? 'Alice Pharmacist' : 'Pam Receptionist',
      role: role
    });
  };

  const logout = () => setCurrentUser(null);

  const addPatient = (patientData: Omit<Patient, 'id' | 'createdAt'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setPatients(prev => [...prev, newPatient]);
  };

  const bookAppointment = (apptData: Omit<Appointment, 'id' | 'status'>) => {
    const newAppt: Appointment = {
      ...apptData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'scheduled',
    };
    setAppointments(prev => [...prev, newAppt]);
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const createPrescription = (data: Omit<Prescription, 'id' | 'date'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newPrescription: Prescription = {
      ...data,
      id,
      date: new Date().toISOString(),
    };

    // 1. Save Prescription
    setPrescriptions(prev => [...prev, newPrescription]);

    // 2. Mark Appointment as Completed
    updateAppointmentStatus(data.appointmentId, 'completed');

    // 3. Automatically Create Pharmacy Order
    const newOrder: PharmacyOrder = {
      id: `ord_${Math.random().toString(36).substr(2, 9)}`,
      prescriptionId: id,
      patientName: data.patientName,
      doctorName: data.doctorName,
      status: 'pending',
      totalCost: 0,
    };
    setPharmacyOrders(prev => [...prev, newOrder]);
  };

  const updateOrderStatus = (id: string, status: OrderStatus, cost?: number) => {
    setPharmacyOrders(prev => prev.map(o => {
      if (o.id === id) {
        return {
          ...o,
          status,
          totalCost: cost !== undefined ? cost : o.totalCost,
          fulfilledAt: status === 'fulfilled' ? new Date().toISOString() : undefined
        };
      }
      return o;
    }));
  };

  return (
    <ClinicContext.Provider value={{
      currentUser,
      patients,
      appointments,
      prescriptions,
      pharmacyOrders,
      login,
      logout,
      addPatient,
      bookAppointment,
      updateAppointmentStatus,
      createPrescription,
      updateOrderStatus
    }}>
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (context === undefined) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
