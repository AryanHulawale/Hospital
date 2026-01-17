import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { fetchPatients, fetchDoctors } from '../axios/api';
import { useNavigate } from 'react-router-dom';

const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ patients: [], doctors: [] });
  const [allData, setAllData] = useState({ patients: [], doctors: [] });
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  // Load all patients and doctors once
  useEffect(() => {
    const loadData = async () => {
      try {
        const [patientsRes, doctorsRes] = await Promise.all([
          fetchPatients(),
          fetchDoctors()
        ]);
        setAllData({
          patients: patientsRes.data,
          doctors: doctorsRes.data
        });
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    loadData();
  }, []);

  // Filter results on query change
  useEffect(() => {
    if (!query) {
      setResults({ patients: [], doctors: [] });
      return;
    }

    const q = query.toLowerCase();

    setResults({
      patients: allData.patients.filter(p =>
        (p.name?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q))
      ),
      doctors: allData.doctors.filter(d =>
        (d.name?.toLowerCase().includes(q) || d.specialization?.toLowerCase().includes(q))
      )
    });
  }, [query, allData]);

  // Navigate when clicking result
  const handleClick = (type, id) => {
    if (type === 'patient') navigate(`/patients/${id}`);
    if (type === 'doctor') navigate(`/doctors/${id}`);
    setQuery('');
    setShowDropdown(false);
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (!query) return;
      // Navigate to a search results page, passing the query as state or query param
      navigate(`/search-results?query=${encodeURIComponent(query)}`);
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative w-full max-w-sm">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search by name..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#dae2e7] dark:border-gray-700 dark:bg-[#1a2630] dark:text-white text-sm focus:ring-2 focus:ring-[#0284c5]/20 outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)} // allow click
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Dropdown */}
      {showDropdown && (results.patients.length || results.doctors.length) > 0 && (
        <div className="absolute z-50 w-full bg-white dark:bg-[#1a2633] shadow-lg rounded-md mt-1 max-h-64 overflow-y-auto">
          {/* Patients */}
          {results.patients.length > 0 && (
            <div className="p-2 border-b border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Patients</h4>
              {results.patients.map(p => (
                <div
                  key={p._id}
                  className="p-2 hover:bg-blue-50 dark:hover:bg-slate-700 rounded cursor-pointer"
                  onClick={() => handleClick('patient', p._id)}
                >
                  {p.name ?? 'Unknown'} - {p.email ?? 'No Email'}
                </div>
              ))}
            </div>
          )}

          {/* Doctors */}
          {results.doctors.length > 0 && (
            <div className="p-2">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Doctors</h4>
              {results.doctors.map(d => (
                <div
                  key={d._id}
                  className="p-2 hover:bg-blue-50 dark:hover:bg-slate-700 rounded cursor-pointer"
                  onClick={() => handleClick('doctor', d._id)}
                >
                  {d.name ?? 'Unknown'} - {d.specialization ?? 'No Specialization'}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
