import React, { useState, useEffect } from 'react';
import { X, CalendarCheck, Clock } from 'lucide-react';
import { fetchPatients, fetchDoctors, addAppointment } from '../axios/api';

const AddAppointmentModal = ({ onClose, refresh, selectedDate }) => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Initialize form with the date from the calendar
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
    time: '',
    reason: ''
  });

  // Generate 30-minute time slots (9 AM to 5 PM)
  const generateTimeSlots = () => {
    const slots = [];
    // 0 * 60 = 0 (12:00 AM / 00:00)
    let start = 0;
    // 24 * 60 = 1440 (The total minutes in a day)
    const end = 24 * 60;
    // 15-minute intervals
    const step = 15;

    for (let i = start; i < end; i += step) {
      let h = Math.floor(i / 60);
      let m = i % 60;

      // Format to 24-hour style (HH:mm)
      let time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

      // Optional: Add AM/PM labels for better readability
      const period = h >= 12 ? 'PM' : 'AM';
      const displayHour = h % 12 || 12; // Converts 0 to 12 and 13 to 1
      const displayTime = `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;

      // We push an object so the value is 24hr format but the label is easy to read
      slots.push({ value: time, label: displayTime });
    }
    return slots;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pRes, dRes] = await Promise.all([fetchPatients(), fetchDoctors()]);
        setPatients(pRes.data);
        setDoctors(dRes.data);
      } catch (err) {
        console.error("Load error", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Combine Date and Time Slot into one ISO string for the backend
      const combinedDateTime = new Date(`${formData.date}T${formData.time}:00`);

      const submissionData = {
        patient: formData.patient,
        doctor: formData.doctor,
        appointmentDate: combinedDateTime.toISOString(),
        reason: formData.reason
      };

      await addAppointment(submissionData);
      refresh();
      onClose();
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.msg);
      } else {
        setError("Slot unavailable or server error.");
      }
    }
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 bg-[#0f1c23]/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 font-['Manrope']">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#0284c5]/10 text-[#0284c5] rounded-lg">
              <CalendarCheck size={18} />
            </div>
            <h2 className="text-base font-bold text-[#101618]">Schedule Slot</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500"><X size={20} /></button>
        </div>

        {error && (
          <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-lg flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Patient</label>
              <select required className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm outline-none"
                value={formData.patient} onChange={(e) => setFormData({ ...formData, patient: e.target.value })}>
                <option value="">Select Patient</option>
                {patients.map(p => <option key={p._id} value={p._id}>{p.fullname || p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Doctor</label>
              <select required className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm outline-none"
                value={formData.doctor} onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}>
                <option value="">Select Doctor</option>
                {doctors.map(d => <option key={d._id} value={d._id}>Dr. {d.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Date</label>
              <input type="date" required className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm"
                value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Available Slot</label>
              <div className="relative">
                <select
                  required
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm outline-none appearance-none"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                >
                  <option value="">Choose Time</option>
                  {generateTimeSlots().map(slot => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label} 
                    </option>
                  ))}
                </select>
                <Clock size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Reason</label>
            <textarea placeholder="Reason for appointment..." className="w-full h-20 p-3 rounded-lg border border-slate-200 bg-slate-50 text-sm outline-none resize-none"
              value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-500">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-[#0284c5] text-white rounded-lg font-bold text-sm">Book Slot</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppointmentModal;