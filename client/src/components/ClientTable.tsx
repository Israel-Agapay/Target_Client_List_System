import React, { useEffect, useState, useRef } from 'react';
import API from '../services/api';
import { exportToExcel } from '../services/exportExcel';
import ConfirmModal from './ConfirmModal';
import Toast from './Toast';
import ViewClientModal from './ViewClientModal';

interface Client {
  id: number;
  date_of_registration: string;
  family_serial_no: string;
  last_name: string;
  first_name: string;
  middle_initial: string;
  complete_address: string;
  age: number;
  date_of_birth: string;
  se_status: number;
  type_of_client: string;
  source: string;
  previous_method: string;
  year: number;
}

interface Props {
  method: string;
  year: number;
  onYearChange: (year: number) => void;
  onDataChange: () => void;
}

const TYPE_OF_CLIENT_OPTIONS = [
  'NA', 'CU-CC', 'CU-RS'
];

const SOURCE_OPTIONS = ['Public', 'Private'];

const METHOD_OPTIONS = [
  'Pills', 'DMPA', 'IUD', 'PSI', 'CONDOM', 'SDM', 'NONE'
];

const emptyForm = {
  date_of_registration: '',
  family_serial_no: '',
  last_name: '',
  first_name: '',
  middle_initial: '',
  complete_address: '',
  date_of_birth: '',
  se_status: '2',
  type_of_client: 'NA',
  source: 'Public',
  previous_method: 'Pills',
};

const ClientTable = ({ method, year, onYearChange, onDataChange }: Props) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteName, setDeleteName] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isOpen: boolean }>({
      message: '', type: 'success', isOpen: false
    });
  const showToast = (message: string, type: 'success' | 'error') => {
      setToast({ message, type, isOpen: true });
    };
  const [viewClient, setViewClient] = useState<Client | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [editedClientId, setEditedClientId] = useState<number | null>(null);

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('T')[0].split('-');
    const yyyy = parts[0];
    const mm = parts[1];
    const dd = parts[2];
    return `${mm}/${dd}/${yyyy}`;
  };

  const fetchClients = async () => {
    try {
      let res;
      if (year === 0) {
        res = await API.get(`/clients/all-years/${method}`);
      } else {
        res = await API.get(`/clients/${method}?year=${year}`);
      }
      setClients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClients();
    onDataChange();
    setShowForm(false);
    setForm(emptyForm);
    setEditId(null);
  }, [method, year]);

const handleSubmit = async () => {
  setLoading(true);
  try {
    if (editId) {

      await API.put(`/clients/${editId}`, { ...form, method });

      showToast('Client updated successfully!', 'success');
      setShowForm(false);
      setForm(emptyForm);
      await fetchClients();
      await onDataChange();

      const res = await API.get(`/clients/client/${editId}`);
      setViewClient(res.data);
      setViewOpen(true);
      setEditId(null);
      setEditedClientId(null);

    } else {
      const clientYear = form.date_of_registration 
        ? new Date(form.date_of_registration).getFullYear()
        : (year === 0 ? new Date().getFullYear() : year);

      await API.post('/clients', { ...form, method, year: clientYear });

      showToast('Client added successfully!', 'success');
      setShowForm(false);
      setForm(emptyForm);
      setEditId(null);
      await fetchClients();
      await onDataChange();
    }
  } catch (err) {
    showToast('Something went wrong!', 'error');
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const handleEdit = (client: Client) => {
    setEditedClientId(client.id);
    showToast('Editing client record...', 'success');
    setForm({
      date_of_registration: client.date_of_registration?.split('T')[0] || '',
      family_serial_no: client.family_serial_no || '',
      last_name: client.last_name || '',
      first_name: client.first_name || '',
      middle_initial: client.middle_initial || '',
      complete_address: client.complete_address || '',
      date_of_birth: client.date_of_birth?.split('T')[0] || '',
      se_status: String(client.se_status) || '2',
      type_of_client: client.type_of_client || 'CU',
      source: client.source || 'Public',
      previous_method: client.previous_method || '',
    });
    setEditId(client.id);
    setShowForm(true);
    setTimeout(() => {
    formRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, 100);
  };
    

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await API.delete(`/clients/${deleteId}`);
      setConfirmOpen(false);
      setDeleteId(null);
      setDeleteName('');
      showToast('Client deleted successfully!', 'success');
      await fetchClients();
      await onDataChange();
    } catch (err) {
      showToast('Failed to delete client!', 'error');
      console.error(err);
    }
  };

  const confirmDelete = (id: number, name: string) => {
    setDeleteId(id);
    setDeleteName(name);
    setConfirmOpen(true);
  };

  const inputClass = "w-full bg-gray-700 text-white px-3 py-1.5 rounded border border-gray-600 focus:outline-none focus:border-blue-500 text-sm";
  const selectClass = "w-full bg-gray-700 text-white px-3 py-1.5 rounded border border-gray-600 focus:outline-none focus:border-blue-500 text-sm";

  const filteredClients = clients.filter((client) => {
  const fullName = `${client.first_name} ${client.middle_initial} ${client.last_name}`.toLowerCase();
  const address = (client.complete_address || '').toLowerCase();
  const s = search.toLowerCase();
    return fullName.includes(s) || address.includes(s);
  });

  return (
    <div>
      {/* Add Button */}
     <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
  {/* Left: Export + Records count */}
  <div className="flex items-center gap-2">
    <button
      onClick={async () => {
        try {
          await exportToExcel(clients, method, year);
          showToast('Excel file download successfully!', 'success');
        } catch (error) {
          showToast('Failed to download Excel file!', 'error');
        }
      }}
      disabled={clients.length === 0}
      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-base transition disabled:opacity-50 whitespace-nowrap"
    >
      Export Excel
    </button>
    <p className="text-gray-400 text-base whitespace-nowrap">{filteredClients.length} record(s) found</p>
  </div>

  {/* Right: Search + Year + Add Client */}
  <div className="flex flex-wrap items-center gap-2">
    <div className="relative">
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">🔍︎</span>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search name or address..."
        className="bg-gray-700 text-white pr-10 pl-3 py-1.5 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 text-base w-48"
      />
    </div>
    <label className="text-gray-400 text-base whitespace-nowrap">Year:</label>
    <select
      value={year}
      onChange={(e) => {
        const selectedYear = Number(e.target.value);
        onYearChange(selectedYear);
        showToast(
          selectedYear === 0 ? 'Year changed to All' : `Year changed to ${selectedYear}`,
          'success'
        );
      }}
      className="bg-gray-700 text-white px-2 py-1.5 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 text-base">
      <option value={0}>All</option>
      {[ 
        new Date().getFullYear() - 10,
        new Date().getFullYear() - 9,
        new Date().getFullYear() - 8,
        new Date().getFullYear() - 7,
        new Date().getFullYear() - 6,
        new Date().getFullYear() - 5,
        new Date().getFullYear() - 4,
        new Date().getFullYear() - 3,
        new Date().getFullYear() - 2,
        new Date().getFullYear() - 1, 
        
        new Date().getFullYear(), 
        
        new Date().getFullYear() + 1, 
        new Date().getFullYear() + 2]
        .map(y => (
        <option key={y} value={y}>{y}</option>
      ))}
    </select>
    <button
      onClick={() => { setShowForm(!showForm); setForm(emptyForm); setEditId(null); }}
      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-base transition whitespace-nowrap"
    >
      {showForm ? 'Cancel' : '+ Add Client'}
    </button>
  </div>
</div>
    

      {/* Form */}
        {showForm && (
          <div  ref={formRef}
            className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
          <h3 className="text-white font-semibold mb-4">{editId ? 'Edit Client' : 'Add New Client'}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-gray-400 text-base mb-1 block">Date of Registration</label>
              <input type="date" value={form.date_of_registration}
                onChange={e => setForm({ ...form, date_of_registration: e.target.value })}
                className={inputClass} />
            </div>
            <div>
              <label className="text-gray-400 text-base mb-1 block">Family Serial No.</label>
              <input type="text" value={form.family_serial_no}
                onChange={e => setForm({ ...form, family_serial_no: e.target.value })}
                className={inputClass} placeholder="Serial No." />
            </div>
            <div>
              <label className="text-gray-400 text-base mb-1 block">Last Name</label>
              <input type="text" value={form.last_name}
                onChange={e => setForm({ ...form, last_name: e.target.value })}
                className={inputClass} placeholder="Last Name" />
            </div>
            <div>
              <label className="text-gray-400 text-base mb-1 block">First Name</label>
              <input type="text" value={form.first_name}
                onChange={e => setForm({ ...form, first_name: e.target.value })}
                className={inputClass} placeholder="First Name" />
            </div>
            <div>
              <label className="text-gray-400 text-base mb-1 block">Middle Initial</label>
              <input type="text" value={form.middle_initial}
                onChange={e => setForm({ ...form, middle_initial: e.target.value })}
                className={inputClass} placeholder="M.I." maxLength={2} />
            </div>
            <div>
              <label className="text-gray-400 text-base mb-1 block">Complete Address</label>
              <input type="text" value={form.complete_address}
                onChange={e => setForm({ ...form, complete_address: e.target.value })}
                className={inputClass} placeholder="Address" />
            </div>
            <div>
              <label className="text-gray-400 text-base mb-1 block">Date of Birth</label>
              <input type="date" value={form.date_of_birth}
                onChange={e => setForm({ ...form, date_of_birth: e.target.value })}
                className={inputClass} />
            </div>
            <div>
              <label className="text-gray-400 text-base mb-1 block">SE Status</label>
              <select value={form.se_status}
                onChange={e => setForm({ ...form, se_status: e.target.value })}
                className={selectClass}>
                <option value="1">1 - NHTS</option>
                <option value="2">2 - Non-NHTS</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-base mb-1 block">Type of Client</label>
              <select value={form.type_of_client}
                onChange={e => setForm({ ...form, type_of_client: e.target.value })}
                className={selectClass}>
                {TYPE_OF_CLIENT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-base mb-1 block">Source</label>
              <select value={form.source}
                onChange={e => setForm({ ...form, source: e.target.value })}
                className={selectClass}>
                {SOURCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-base mb-1 block">Previous Method</label>
              <select value={form.previous_method}
                onChange={e => setForm({ ...form, previous_method: e.target.value })}
                className={selectClass}>
                {METHOD_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleSubmit} disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-base transition disabled:opacity-50">
              {loading ? 'Saving...' : editId ? 'Update Client' : 'Save Client'}
            </button>
            <button onClick={() => { setShowForm(false); setForm(emptyForm); setEditId(null); }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg text-base transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-700">
        <table className="w-full text-base">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="px-3 py-3 text-left">No.</th>
              <th className="px-3 py-3 text-left">Date Registered</th>
              <th className="px-3 py-3 text-left">Serial No.</th>
              <th className="px-3 py-3 text-left">Full Name</th>
              <th className="px-3 py-3 text-left">Address</th>
              <th className="px-3 py-3 text-left">Age</th>
              <th className="px-3 py-3 text-left">Birthday</th>
              <th className="px-3 py-3 text-left">SE Status</th>
              <th className="px-3 py-3 text-left">Type</th>
              <th className="px-3 py-3 text-left">Source</th>
              <th className="px-3 py-3 text-left">Prev. Method</th>
              <th className="px-3 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={12} className="text-center text-gray-500 py-8">No clients found</td>
              </tr>
            ) : (
              filteredClients.map((client, index) => (
                <tr key={client.id} 
                    className="border-t border-gray-700 hover:bg-gray-750 transition cursor-pointer"
                    onClick={() => { setViewClient(client); setViewOpen(true); }}>
                  <td className="px-3 py-3 text-gray-300">{index + 1}</td>
                  <td className="px-3 py-3 text-gray-300">{formatDisplayDate(client.date_of_registration)}</td>
                  <td className="px-3 py-3 text-gray-300">{client.family_serial_no}</td>
                  <td className="px-3 py-3 text-white font-medium">{client.last_name}, {client.first_name} {client.middle_initial}.</td>
                  <td className="px-3 py-3 text-gray-300">{client.complete_address}</td>
                  <td className="px-3 py-3 text-gray-300">{client.age}</td>
                  <td className="px-3 py-3 text-gray-300">{formatDisplayDate(client.date_of_birth)}</td>
                  <td className="px-3 py-3 text-gray-300">{client.se_status === 1 ? 'NHTS' : 'Non-NHTS'}</td>
                  <td className="px-3 py-3 text-gray-300">{client.type_of_client}</td>
                  <td className="px-3 py-3 text-gray-300">{client.source}</td>
                  <td className="px-3 py-3 text-gray-300">{client.previous_method}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); handleEdit(client); }}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-2 py-1 rounded text-base transition">
                        Edit
                      </button>
                      
                      <button onClick={(e) => { e.stopPropagation(); confirmDelete(client.id, `${client.first_name} ${client.last_name}`); }}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-base transition">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
        <ConfirmModal
          isOpen={confirmOpen}
          message={`Are you sure you want to delete ${deleteName}? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => { setConfirmOpen(false); setDeleteId(null); setDeleteName(''); }}
        />

        <Toast
          message={toast.message}
          type={toast.type}
          isOpen={toast.isOpen}
          onClose={() => setToast({ ...toast, isOpen: false })}
        />

        <ViewClientModal
          isOpen={viewOpen}
          client={viewClient}
          onClose={() => {
            setViewOpen(false);
            setViewClient(null);
          }}
          onEdit={(client) => {
            setViewOpen(false);
            handleEdit(client);
          }}
          onDelete={(client) => {
            setViewOpen(false);
            confirmDelete(
              client.id,
              `${client.first_name} ${client.last_name}`
            );
          }}
        />
        
      </div>
      
  );
};

export default ClientTable;