import React, { useEffect, useState } from 'react';
import { X, UserRoundPen } from 'lucide-react';
import { updatePatient } from '../axios/api';

const UpdatePatientModel = ({ onClose, refresh, patient }) => {
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    age: '',
    gender: 'Male',
    address: '',
    contactNumber: '',
    medicalHistory: ''
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        _id: patient._id,
        name: patient.name || '',
        age: patient.age || '',
        gender: patient.gender || 'Male',
        address: patient.address || '',
        contactNumber: patient.contactNumber || '',
        medicalHistory: patient.medicalHistory || ''
      });
    }
  }, [patient]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePatient(formData);
      refresh();
      onClose();
    } catch (err) {
      alert("Error updating patient profile.");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0f1c23]/40 backdrop-blur-[2px] flex items-center justify-center z-[9999] p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header - Compact & Consistent */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#0284c5]/10 text-[#0284c5] rounded-lg">
              <UserRoundPen size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#101618]">Update Patient</h2>
              <p className="text-[10px] text-slate-500 font-medium tracking-tight">Modify existing patient records</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Row 1: Name and Age */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <input 
                type="text" required placeholder="Name"
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-[#0284c5]/20 focus:border-[#0284c5] outline-none"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Age</label>
              <input 
                type="number" required placeholder="Age"
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-[#0284c5]/20 focus:border-[#0284c5] outline-none"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: e.target.value })} 
              />
            </div>
          </div>

          {/* Row 2: Gender and Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Gender</label>
              <select 
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-[#0284c5]/20 focus:border-[#0284c5] outline-none"
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Contact Number</label>
              <input 
                type="text" required placeholder="Phone Number"
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-[#0284c5]/20 focus:border-[#0284c5] outline-none"
                value={formData.contactNumber}
                onChange={e => setFormData({ ...formData, contactNumber: e.target.value })} 
              />
            </div>
          </div>

          {/* Row 3: Address */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Residential Address</label>
            <input 
              required placeholder="Full address"
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-[#0284c5]/20 focus:border-[#0284c5] outline-none"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })} 
            />
          </div>

          {/* Row 4: Medical History */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Medical History</label>
            <textarea 
              placeholder="Known allergies, previous surgeries, etc."
              className="w-full h-20 p-3 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-[#0284c5]/20 focus:border-[#0284c5] outline-none resize-none"
              value={formData.medicalHistory}
              onChange={e => setFormData({ ...formData, medicalHistory: e.target.value })} 
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-[#0284c5] hover:bg-[#026aa0] text-white rounded-lg font-bold text-sm shadow-md shadow-[#0284c5]/20 transition-all active:scale-95"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePatientModel;