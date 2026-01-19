import React, { useEffect, useState } from 'react';
import { X, FileEdit } from 'lucide-react';
import { updateDoctor } from '../axios/api';

const UpdateDoctorModal = ({ doctor, onClose, refresh }) => {
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    specialization: '',
    contactNumber: '',
    email: ''
  });

  // Load existing doctor data into form
  useEffect(() => {
    if (doctor) {
      setFormData({
        _id: doctor._id,
        name: doctor.name || '',
        specialization: doctor.specialization || '',
        contactNumber: doctor.contactNumber || '',
        email: doctor.email || ''
      });
    }
  }, [doctor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoctor(formData);
      refresh();
      onClose();
    } catch (err) {
      alert("Error updating doctor. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0f1c23]/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header - Compact */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#0284c5]/10 text-[#0284c5] rounded-lg">
              <FileEdit size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#101618]">Update Doctor</h2>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">Modify professional details</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Grid Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-[#0284c5]/20 focus:border-[#0284c5] outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Specialization</label>
              <input
                type="text"
                required
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-[#0284c5]/20 focus:border-[#0284c5] outline-none transition-all"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              />
            </div>
          </div>

          {/* Grid Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-[#0284c5]/20 focus:border-[#0284c5] outline-none transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Contact Number</label>
              <input
                type="text"
                required
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-[#0284c5]/20 focus:border-[#0284c5] outline-none transition-all"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              />
            </div>
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
              Update Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UpdateDoctorModal;