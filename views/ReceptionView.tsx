import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { Plus, Search, Calendar, User, Clock, MapPin, Phone } from 'lucide-react';
import { Patient, Appointment } from '../types';

export const ReceptionView = () => {
  const { patients, appointments, addPatient, bookAppointment, updateAppointmentStatus } = useClinic();
  const [activeTab, setActiveTab] = useState<'appointments' | 'patients'>('appointments');
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form States
  const [newPatient, setNewPatient] = useState({ name: '', age: '', phone: '', address: '' });
  const [bookingData, setBookingData] = useState({ patientId: '', doctorId: 'd1', date: '', time: '', description: '' });

  // Filtered Lists
  const filteredAppointments = appointments.filter(a => 
    a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.date.includes(searchTerm)
  );

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.phone.includes(searchTerm)
  );

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    addPatient({
      name: newPatient.name,
      age: parseInt(newPatient.age),
      phone: newPatient.phone,
      address: newPatient.address,
    });
    setShowNewPatientModal(false);
    setNewPatient({ name: '', age: '', phone: '', address: '' });
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === bookingData.patientId);
    if (!patient) return;

    bookAppointment({
      patientId: patient.id,
      patientName: patient.name,
      doctorId: bookingData.doctorId,
      date: bookingData.date,
      time: bookingData.time,
      description: bookingData.description,
    });
    setShowBookingModal(false);
    setBookingData({ patientId: '', doctorId: 'd1', date: '', time: '', description: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reception Dashboard</h2>
          <p className="text-gray-500">Manage patients and appointments</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowNewPatientModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <User size={18} /> New Patient
          </button>
          <button
            onClick={() => setShowBookingModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
          >
            <Plus size={18} /> Book Appointment
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'appointments' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Appointments
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'patients' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Patient Registry
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'appointments' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date & Time</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAppointments.length === 0 ? (
                <tr>
                   <td colSpan={6} className="px-6 py-10 text-center text-gray-500">No appointments found.</td>
                </tr>
              ) : (
                filteredAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{appt.patientName}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {appt.date}</span>
                        <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={14} /> {appt.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 truncate max-w-xs">{appt.description}</td>
                    <td className="px-6 py-4 text-gray-600">Dr. House</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${appt.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                          appt.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {appt.status === 'scheduled' && (
                        <button 
                          onClick={() => updateAppointmentStatus(appt.id, 'cancelled')}
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{patient.name}</h3>
                  <p className="text-gray-500 text-sm">Age: {patient.age}</p>
                </div>
                <div className="w-8 h-8 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center">
                  <User size={16} />
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400" />
                  {patient.phone}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  {patient.address}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showNewPatientModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Register New Patient</h3>
            <form onSubmit={handleAddPatient} className="space-y-4">
              <input 
                required placeholder="Full Name" 
                className="w-full p-2 border rounded" 
                value={newPatient.name} 
                onChange={e => setNewPatient({...newPatient, name: e.target.value})} 
              />
              <div className="flex gap-4">
                 <input 
                  required type="number" placeholder="Age" 
                  className="w-1/3 p-2 border rounded" 
                  value={newPatient.age} 
                  onChange={e => setNewPatient({...newPatient, age: e.target.value})} 
                />
                 <input 
                  required placeholder="Phone" 
                  className="w-2/3 p-2 border rounded" 
                  value={newPatient.phone} 
                  onChange={e => setNewPatient({...newPatient, phone: e.target.value})} 
                />
              </div>
              <input 
                required placeholder="Address" 
                className="w-full p-2 border rounded" 
                value={newPatient.address} 
                onChange={e => setNewPatient({...newPatient, address: e.target.value})} 
              />
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowNewPatientModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Book Appointment</h3>
            <form onSubmit={handleBookAppointment} className="space-y-4">
              <select 
                required 
                className="w-full p-2 border rounded bg-white"
                value={bookingData.patientId}
                onChange={e => setBookingData({...bookingData, patientId: e.target.value})}
              >
                <option value="">Select Patient</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              
              <div className="flex gap-4">
                <input 
                  required type="date" 
                  className="w-1/2 p-2 border rounded"
                  value={bookingData.date}
                  onChange={e => setBookingData({...bookingData, date: e.target.value})}
                />
                <input 
                  required type="time" 
                  className="w-1/2 p-2 border rounded"
                  value={bookingData.time}
                  onChange={e => setBookingData({...bookingData, time: e.target.value})}
                />
              </div>

              <textarea 
                required placeholder="Reason for visit / Symptoms" 
                className="w-full p-2 border rounded h-24"
                value={bookingData.description}
                onChange={e => setBookingData({...bookingData, description: e.target.value})}
              />

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowBookingModal(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
