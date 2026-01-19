import React, { useState } from 'react';
import { X, UserPlus, Lock } from 'lucide-react';
import { addDoctor } from '../axios/api';

const AddDoctorModal = ({ onClose, refresh }) => {
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    contactNumber: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoctor(formData);
      refresh();
      onClose();
    } catch (err) {
      alert("Error adding doctor. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0f1c23]/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#0284c5]/10 text-[#0284c5] rounded-lg">
              <UserPlus size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#101618]">Register Doctor</h2>
              <p className="text-[10px] text-slate-500 font-medium">Add a new specialist to the directory</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <input 
                type="text" 
                required
                placeholder="Dr. John Doe"
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Specialization</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Cardiology"
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm"
                value={formData.specialization}
                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Contact Number</label>
              <input 
                type="text" 
                required
                placeholder="+1 234 567 890"
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm"
                value={formData.contactNumber}
                onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                required
                placeholder="doctor@hospital.com"
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              required
              placeholder="Enter secure password"
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg">
              Cancel
            </button>
            <button type="submit"
              className="px-6 py-2 bg-[#0284c5] hover:bg-[#026aa0] text-white rounded-lg font-bold text-sm">
              Save Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctorModal;
