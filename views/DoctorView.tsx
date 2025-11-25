import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { generatePrescriptionPDF } from '../services/pdfService';
import { Appointment, Medicine } from '../types';
import { Clock, CheckCircle, FileText, Plus, Trash2, Printer, History } from 'lucide-react';

export const DoctorView = () => {
  const { appointments, prescriptions, createPrescription, currentUser } = useClinic();
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue');
  
  // Prescription Form State
  const [diagnosis, setDiagnosis] = useState('');
  const [instructions, setInstructions] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [currentMed, setCurrentMed] = useState<Medicine>({ name: '', dosage: '', frequency: '', duration: '' });

  const scheduledAppointments = appointments.filter(a => a.status === 'scheduled');

  const handleAddMedicine = () => {
    if (currentMed.name && currentMed.dosage) {
      setMedicines([...medicines, currentMed]);
      setCurrentMed({ name: '', dosage: '', frequency: '', duration: '' });
    }
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleSavePrescription = () => {
    if (!selectedAppt || !currentUser) return;

    createPrescription({
      appointmentId: selectedAppt.id,
      patientId: selectedAppt.patientId,
      patientName: selectedAppt.patientName,
      doctorId: currentUser.id,
      doctorName: currentUser.name,
      diagnosis,
      medicines,
      instructions,
    });

    // Reset and close
    setSelectedAppt(null);
    setDiagnosis('');
    setInstructions('');
    setMedicines([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medical Dashboard</h2>
          <p className="text-gray-500">Welcome back, Dr. {currentUser?.name}</p>
        </div>
        <div className="flex gap-2">
            <button
                onClick={() => setActiveTab('queue')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'queue' ? 'bg-brand-600 text-white' : 'bg-white text-gray-600'}`}
            >
                Current Queue
            </button>
            <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'history' ? 'bg-brand-600 text-white' : 'bg-white text-gray-600'}`}
            >
                Patient History
            </button>
        </div>
      </div>

      {activeTab === 'queue' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Queue List */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-semibold text-gray-700 mb-2">Appointments Today</h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {scheduledAppointments.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No patients in waiting.</div>
              ) : (
                scheduledAppointments.map(appt => (
                  <div 
                    key={appt.id}
                    onClick={() => setSelectedAppt(appt)}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${selectedAppt?.id === appt.id ? 'bg-brand-50 border-l-4 border-l-brand-600' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-gray-900">{appt.patientName}</span>
                      <span className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        <Clock size={12} className="mr-1" /> {appt.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{appt.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Prescription Area */}
          <div className="lg:col-span-2">
            {selectedAppt ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col">
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <h3 className="text-xl font-bold text-gray-900">New Prescription</h3>
                  <p className="text-sm text-gray-500">Patient: {selectedAppt.patientName} | Date: {selectedAppt.date}</p>
                  <div className="mt-2 p-3 bg-yellow-50 text-yellow-800 text-sm rounded border border-yellow-100">
                    <strong>Complaint:</strong> {selectedAppt.description}
                  </div>
                </div>

                <div className="space-y-6 flex-1">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis / Impression</label>
                    <textarea 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                      rows={2}
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="e.g. Myopia, Conjunctivitis..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rx: Medicines</label>
                    <div className="grid grid-cols-12 gap-2 mb-3">
                      <input 
                        placeholder="Medicine Name" className="col-span-4 p-2 border rounded text-sm"
                        value={currentMed.name} onChange={e => setCurrentMed({...currentMed, name: e.target.value})}
                      />
                      <input 
                        placeholder="Dosage" className="col-span-3 p-2 border rounded text-sm"
                        value={currentMed.dosage} onChange={e => setCurrentMed({...currentMed, dosage: e.target.value})}
                      />
                      <input 
                        placeholder="Freq" className="col-span-2 p-2 border rounded text-sm"
                        value={currentMed.frequency} onChange={e => setCurrentMed({...currentMed, frequency: e.target.value})}
                      />
                      <input 
                        placeholder="Dur" className="col-span-2 p-2 border rounded text-sm"
                        value={currentMed.duration} onChange={e => setCurrentMed({...currentMed, duration: e.target.value})}
                      />
                      <button 
                        onClick={handleAddMedicine}
                        className="col-span-1 bg-brand-600 text-white rounded flex items-center justify-center hover:bg-brand-700"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    {/* Medicine List */}
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-2 space-y-2 min-h-[100px]">
                      {medicines.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No medicines added yet</p>}
                      {medicines.map((med, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-2 rounded shadow-sm text-sm">
                          <div className="grid grid-cols-4 gap-2 flex-1">
                            <span className="font-medium">{med.name}</span>
                            <span className="text-gray-600">{med.dosage}</span>
                            <span className="text-gray-600">{med.frequency}</span>
                            <span className="text-gray-600">{med.duration}</span>
                          </div>
                          <button onClick={() => handleRemoveMedicine(idx)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Instructions</label>
                    <textarea 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                      rows={2}
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="e.g. Return for checkup in 2 weeks..."
                    />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 mt-6 flex justify-end gap-3">
                  <button onClick={() => setSelectedAppt(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">Cancel</button>
                  <button 
                    onClick={handleSavePrescription}
                    disabled={!diagnosis || medicines.length === 0}
                    className={`px-6 py-2 rounded-lg text-white font-medium flex items-center gap-2
                      ${(!diagnosis || medicines.length === 0) ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700'}`}
                  >
                    <CheckCircle size={18} /> Complete & Send to Pharmacy
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400">
                <Stethoscope size={48} className="mb-4 opacity-50" />
                <p>Select a patient from the queue to start consultation</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Diagnosis</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Medicines</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {prescriptions.map((pres) => (
                <tr key={pres.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-600 text-sm">{new Date(pres.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{pres.patientName}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{pres.diagnosis}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{pres.medicines.length} items</td>
                    <td className="px-6 py-4">
                        <button 
                            onClick={() => generatePrescriptionPDF(pres)}
                            className="text-brand-600 hover:text-brand-800 text-sm font-medium flex items-center gap-1"
                        >
                            <Printer size={14} /> PDF
                        </button>
                    </td>
                </tr>
              ))}
              {prescriptions.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-500">No history available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Simple Icon for empty state
const Stethoscope = ({size, className}: {size: number, className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
        <path d="M8 15v6a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2v-6" />
        <circle cx="12" cy="12" r="2" />
    </svg>
)
