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
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div
        className="w-full max-w-lg shadow-2xl max-h-[95vh] flex flex-col rounded-xl"
        style={{
          background: 'rgba(31,41,55,0.85)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <h3 className="text-white font-semibold text-lg flex items-center gap-2">
              <span style={{
                width: '4px', height: '18px', borderRadius: '2px',
                background: 'linear-gradient(to bottom, #6366f1, #10b981)',
                display: 'inline-block', flexShrink: 0,
              }} />
              Client Details
            </h3>
            <p className="text-gray-400 text-base mt-0.5">Full information of the selected client</p>
          </div>
          <button
            onClick={onClose}
            className="transition"
            style={{ color: '#a5b4fc' }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Avatar + Name */}
        <div className="px-6 py-4 flex items-center gap-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
            style={{
              background: 'rgba(99,102,241,0.25)',
              border: '1px solid rgba(99,102,241,0.45)',
              color: '#c7d2fe',
            }}
          >
            {client.first_name?.charAt(0)}{client.last_name?.charAt(0)}
          </div>
          <div>
            <p className="text-white font-semibold text-lg">{fullName}</p>
            <p className="text-gray-400 text-base">{client.complete_address}</p>
          </div>
        </div>

        {/* Fields */}
        <div className="px-6 py-4 grid grid-cols-2 gap-4 overflow-y-auto flex-1">
          {fields.map((field) => (
            <div
              key={field.label}
              className="rounded-lg px-3 py-2"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <p className="text-gray-500 text-sm uppercase tracking-wide mb-0.5">{field.label}</p>
              {field.label === 'SE Status' ? (
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-sm font-semibold mt-0.5"
                  style={
                    client.se_status === 1
                      ? { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)', color: '#6ee7b7' }
                      : { background: 'rgba(99,102,241,0.13)', border: '1px solid rgba(99,102,241,0.22)', color: '#a5b4fc' }
                  }
                >
                  {field.value}
                </span>
              ) : field.label === 'Source' ? (
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-sm font-semibold mt-0.5"
                  style={
                    client.source === 'Public'
                      ? { background: 'rgba(59,130,246,0.13)', border: '1px solid rgba(59,130,246,0.22)', color: '#93c5fd' }
                      : { background: 'rgba(245,158,11,0.13)', border: '1px solid rgba(245,158,11,0.22)', color: '#fcd34d' }
                  }
                >
                  {field.value}
                </span>
              ) : (
                <p className="text-white text-base font-medium">{field.value}</p>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-between items-center" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>

        {/* Mobile Only Actions */}
        <div className="flex gap-2 md:hidden">
            <button
            onClick={() => onEdit?.(client)}
            className="text-white px-4 py-2 rounded-lg text-base transition"
            style={{
              background: 'rgba(234,179,8,0.15)',
              border: '1px solid rgba(234,179,8,0.3)',
              color: '#fde68a',
            }}
            >
            Edit
            </button>

            <button
            onClick={() => onDelete?.(client)}
            className="text-white px-4 py-2 rounded-lg text-base transition"
            style={{
              background: 'rgba(239,68,68,0.13)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: '#fca5a5',
            }}
            >
            Delete
            </button>
        </div>

        <button
            onClick={onClose}
            className="text-white px-5 py-2 rounded-lg text-base transition ml-auto"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.85)',
            }}
        >
            Close
        </button>
        </div>
      </div>
    </div>
  );
};

export default ViewClientModal;