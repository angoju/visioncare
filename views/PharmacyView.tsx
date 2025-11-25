import React, { useState } from 'react';
import { useClinic } from '../context/ClinicContext';
import { generateBillPDF } from '../services/pdfService';
import { PharmacyOrder } from '../types';
import { Package, Check, Printer, DollarSign, Clock } from 'lucide-react';

export const PharmacyView = () => {
  const { pharmacyOrders, prescriptions, updateOrderStatus } = useClinic();
  const [selectedOrder, setSelectedOrder] = useState<PharmacyOrder | null>(null);
  const [billingCost, setBillingCost] = useState<string>('');

  const pendingOrders = pharmacyOrders.filter(o => o.status !== 'fulfilled');
  const historyOrders = pharmacyOrders.filter(o => o.status === 'fulfilled');

  const getPrescriptionDetails = (presId: string) => {
    return prescriptions.find(p => p.id === presId);
  };

  const handleFulfillOrder = () => {
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, 'fulfilled', parseFloat(billingCost) || 0);
    
    // Auto generate bill upon fulfillment
    const pres = getPrescriptionDetails(selectedOrder.prescriptionId);
    if (pres) {
        generateBillPDF({...selectedOrder, totalCost: parseFloat(billingCost) || 0}, pres.medicines);
    }

    setSelectedOrder(null);
    setBillingCost('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pharmacy & Dispensing</h2>
          <p className="text-gray-500">Process orders and billing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-orange-50 flex justify-between items-center">
              <h3 className="font-bold text-orange-800 flex items-center gap-2">
                <Clock size={18} /> Pending Orders
              </h3>
              <span className="bg-orange-200 text-orange-800 text-xs px-2 py-1 rounded-full">{pendingOrders.length}</span>
            </div>
            <div className="divide-y divide-gray-100">
              {pendingOrders.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No pending orders.</div>
              ) : (
                pendingOrders.map(order => (
                  <div 
                    key={order.id} 
                    className={`p-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center transition-colors ${selectedOrder?.id === order.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div>
                      <h4 className="font-bold text-gray-900">{order.patientName}</h4>
                      <p className="text-sm text-gray-500">Dr. {order.doctorName}</p>
                    </div>
                    <div className="text-right">
                       <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-800 capitalize">
                         {order.status}
                       </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* History Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
               <h3 className="font-bold text-gray-700">Fulfilled History</h3>
            </div>
            <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
              {historyOrders.map(order => (
                <div key={order.id} className="p-4 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-900">{order.patientName}</span>
                    <span className="ml-2 text-xs text-gray-400">
                      {order.fulfilledAt ? new Date(order.fulfilledAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-900">${order.totalCost.toFixed(2)}</span>
                    <button 
                        onClick={() => {
                            const pres = getPrescriptionDetails(order.prescriptionId);
                            if(pres) generateBillPDF(order, pres.medicines);
                        }}
                        className="text-gray-400 hover:text-brand-600"
                    >
                        <Printer size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {historyOrders.length === 0 && <div className="p-6 text-center text-gray-500">No history available.</div>}
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Order Details</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <span className="text-xs text-gray-500 uppercase">Patient</span>
                  <p className="font-medium">{selectedOrder.patientName}</p>
                </div>
                
                {getPrescriptionDetails(selectedOrder.prescriptionId)?.medicines.map((med, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg text-sm border border-gray-100">
                    <div className="font-bold text-gray-800">{med.name}</div>
                    <div className="text-gray-600 mt-1 flex justify-between">
                        <span>{med.dosage}</span>
                        <span>{med.duration}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Total Bill Amount ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="number" 
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                    placeholder="0.00"
                    value={billingCost}
                    onChange={(e) => setBillingCost(e.target.value)}
                  />
                </div>

                <button 
                  onClick={handleFulfillOrder}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Check size={20} /> Mark Fulfilled & Print
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center text-gray-400 h-64">
              <Package size={48} className="mb-4 opacity-50" />
              <p>Select a pending order to view details and process billing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
