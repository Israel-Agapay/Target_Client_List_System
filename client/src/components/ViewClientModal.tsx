import React from 'react';

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
  isOpen: boolean;
  client: Client | null;
  onClose: () => void;
  onEdit?: (client: Client) => void;
  onDelete?: (client: Client) => void;
}

const formatDisplayDate = (dateStr: string) => {
  if (!dateStr) return '';
  const parts = dateStr.split('T')[0].split('-');
  const yyyy = parts[0];
  const mm = parts[1];
  const dd = parts[2];
  return `${mm}/${dd}/${yyyy}`;
};

const ViewClientModal = ({isOpen,client,onClose,onEdit,onDelete}: Props) => {
  if (!isOpen || !client) return null;

  const fullName = `${client.first_name} ${client.middle_initial ? client.middle_initial + '.' : ''} ${client.last_name}`.trim();

  const fields = [
    { label: 'Full Name', value: fullName },
    { label: 'Date of Registration', value: formatDisplayDate(client.date_of_registration) },
    { label: 'Family Serial No.', value: client.family_serial_no || '—' },
    { label: 'Complete Address', value: client.complete_address || '—' },
    { label: 'Age', value: client.age || '—' },
    { label: 'Date of Birth', value: formatDisplayDate(client.date_of_birth) },
    { label: 'SE Status', value: client.se_status === 1 ? '1 - NHTS' : '2 - Non-NHTS' },
    { label: 'Type of Client', value: client.type_of_client || '—' },
    { label: 'Source', value: client.source || '—' },
    { label: 'Previous Method', value: client.previous_method || '—' },
    { label: 'Year', value: client.year || '—' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-lg shadow-2xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
          <div>
            <h3 className="text-white font-semibold text-lg">Client Details</h3>
            <p className="text-gray-400 text-base mt-0.5">Full information of the selected client</p>
          </div>
          <button
            onClick={onClose}
            className="text-blue-500 hover:text-white transition"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Avatar + Name */}
        <div className="px-6 py-4 flex items-center gap-4 border-b border-gray-700">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            {client.first_name?.charAt(0)}{client.last_name?.charAt(0)}
          </div>
          <div>
            <p className="text-white font-semibold text-base">{fullName}</p>
            <p className="text-gray-400 text-base">{client.complete_address}</p>
          </div>
        </div>

        {/* Fields */}
        <div className="px-6 py-4 grid grid-cols-2 gap-4 overflow-y-auto flex-1">
          {fields.map((field) => (
            <div key={field.label}>
              <p className="text-gray-500 text-sm uppercase tracking-wide mb-0.5">{field.label}</p>
              <p className="text-white text-base font-medium">{field.value}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700 flex justify-between items-center">
  
        {/* Mobile Only Actions */}
        <div className="flex gap-2 md:hidden">
            <button
            onClick={() => onEdit?.(client)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-base transition"
            >
            Edit
            </button>

            <button
            onClick={() => onDelete?.(client)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-base transition"
            >
            Delete
            </button>
        </div>

        <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-lg text-base transition ml-auto"
        >
            Close
        </button>
        </div>
      </div>
    </div>
  );
};

export default ViewClientModal;