import React, { useState } from 'react';
import { PageHeader, Card, Badge, statusBadge, Button, Table, SearchBar, Select, Modal, Input, Tabs, Toast } from '../../components/ui';
import { MOCK_VEHICLES } from '../../data/mock';
import { Car, Plus, Check, X, Upload } from 'lucide-react';

export default function VehicleManagement() {
  const [tab, setTab] = useState('All Vehicles');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const filtered = MOCK_VEHICLES.filter(v => {
    const q = search.toLowerCase();
    const matchQ = v.plate.toLowerCase().includes(q) || v.owner.toLowerCase().includes(q) || v.make.toLowerCase().includes(q);
    const matchType = !filterType || v.type === filterType;
    const matchStatus = !filterStatus || v.status === filterStatus;
    return matchQ && matchType && matchStatus;
  });

  const pending = MOCK_VEHICLES.filter(v => v.status === 'pending');

  return (
    <div className="animate-fadein">
      {toast && <Toast message={toast} type="success" onClose={() => setToast('')} />}
      <PageHeader title="Vehicle Management" subtitle="Manage campus vehicle registrations and authorizations"
        action={<Button onClick={() => setShowRegister(true)}><Plus size={16} /> Register Vehicle</Button>}
      />

      <Tabs tabs={['All Vehicles', 'Pending Approval', 'Driver Profiles', 'Authorization']} active={tab} onChange={setTab} />

      {tab === 'All Vehicles' && (
        <Card>
          <div className="p-5 border-b border-slate-50">
            <SearchBar value={search} onChange={setSearch} placeholder="Search by plate, owner, or make...">
              <Select value={filterType} onChange={e => setFilterType(e.target.value)}>
                <option value="">All Types</option>
                {['Sedan', 'SUV', 'Hatchback', 'Motorcycle', 'Van'].map(t => <option key={t}>{t}</option>)}
              </Select>
              <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">All Status</option>
                {['active', 'pending', 'suspended', 'rejected'].map(s => <option key={s}>{s}</option>)}
              </Select>
            </SearchBar>
          </div>
          <Table
            columns={[
              { key: 'plate', label: 'Plate No.', render: v => <span className="font-mono font-bold text-[#123B6D]">{v.plate}</span> },
              { key: 'owner', label: 'Owner' },
              { key: 'vehicle', label: 'Vehicle', render: v => `${v.year} ${v.make} ${v.model}` },
              { key: 'type', label: 'Type' },
              { key: 'color', label: 'Color' },
              { key: 'rfid', label: 'RFID', render: v => v.rfid ? <span className="text-xs font-mono text-slate-500">{v.rfid}</span> : <span className="text-xs text-slate-300">Unassigned</span> },
              { key: 'status', label: 'Status', render: v => <Badge variant={statusBadge(v.status)}>{v.status}</Badge> },
              { key: 'actions', label: 'Actions', render: v => <Button size="sm" variant="ghost" onClick={() => setSelected(v)}>View</Button> },
            ]}
            data={filtered}
            onRowClick={setSelected}
          />
        </Card>
      )}

      {tab === 'Pending Approval' && (
        <Card className="p-6">
          <p className="text-sm text-slate-500 mb-5">{pending.length} vehicle(s) awaiting approval</p>
          {pending.map(v => (
            <div key={v.id} className="border border-amber-200 bg-amber-50 rounded-xl p-5 mb-4 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <p className="font-mono font-bold text-[#123B6D] text-lg">{v.plate}</p>
                <p className="text-slate-600 text-sm">{v.year} {v.make} {v.model} — {v.color}</p>
                <p className="text-slate-400 text-xs mt-1">Owner: {v.owner} · Type: {v.type}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="success" onClick={() => showToast(`Approved: ${v.plate}`)}><Check size={14} /> Approve</Button>
                <Button size="sm" variant="danger" onClick={() => showToast(`Rejected: ${v.plate}`)}><X size={14} /> Reject</Button>
              </div>
            </div>
          ))}
        </Card>
      )}

      {tab === 'Driver Profiles' && (
        <Card className="p-6">
          <div className="space-y-4">
            {MOCK_VEHICLES.map(v => (
              <div key={v.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#2563EB] flex items-center justify-center">
                  <Car size={22} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-700">{v.owner}</p>
                  <p className="text-sm text-slate-400">{v.plate} — {v.make} {v.model}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 text-right">License</p>
                  <p className="text-sm font-mono text-slate-600">DL-{Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
                </div>
                <Badge variant="success">Valid</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'Authorization' && (
        <Card>
          <Table
            columns={[
              { key: 'plate', label: 'Plate No.', render: v => <span className="font-mono font-bold text-[#123B6D]">{v.plate}</span> },
              { key: 'owner', label: 'Owner' },
              { key: 'type', label: 'Type' },
              { key: 'status', label: 'Auth Status', render: v => (
                <Badge variant={v.status === 'active' ? 'success' : v.status === 'pending' ? 'warning' : 'danger'}>
                  {v.status === 'active' ? 'Authorized' : v.status === 'pending' ? 'Pending Review' : v.status}
                </Badge>
              )},
              { key: 'validity', label: 'Valid Until', render: () => '2025-08-31' },
              { key: 'actions', label: 'Actions', render: v => (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => showToast(`Authorization updated for ${v.plate}`)}>Update</Button>
                  <Button size="sm" variant="danger" onClick={() => showToast(`Suspended: ${v.plate}`)}>Suspend</Button>
                </div>
              )},
            ]}
            data={MOCK_VEHICLES}
          />
        </Card>
      )}

      {/* Vehicle Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Vehicle Details">
        {selected && (
          <div className="space-y-4">
            <div className="bg-[#F0F6FC] rounded-xl p-5 flex items-center gap-4">
              <div className="w-16 h-16 bg-[#2563EB]/10 rounded-2xl flex items-center justify-center">
                <Car size={32} className="text-[#2563EB]" />
              </div>
              <div>
                <p className="font-mono font-bold text-2xl text-[#123B6D]">{selected.plate}</p>
                <p className="text-slate-500">{selected.year} {selected.make} {selected.model}</p>
                <Badge variant={statusBadge(selected.status)}>{selected.status}</Badge>
              </div>
            </div>
            {[['Owner', selected.owner], ['Vehicle Type', selected.type], ['Color', selected.color], ['RFID Tag', selected.rfid || 'Not assigned'], ['Registration Status', selected.status]].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm border-b border-slate-50 pb-2">
                <span className="text-slate-400">{k}</span>
                <span className="font-medium text-slate-700">{v}</span>
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <Button onClick={() => { showToast('Changes saved'); setSelected(null); }}>Save</Button>
              <Button variant="danger" onClick={() => { showToast(`Suspended: ${selected.plate}`); setSelected(null); }}>Suspend</Button>
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Register Vehicle Modal */}
      <Modal open={showRegister} onClose={() => setShowRegister(false)} title="Register Vehicle" size="md">
        <div className="space-y-4">
          <Input label="Vehicle Owner" placeholder="Select user..." />
          <Input label="Plate Number" placeholder="ABC-1234" />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Vehicle Type"><option>Sedan</option><option>SUV</option><option>Hatchback</option><option>Motorcycle</option><option>Van</option></Select>
            <Input label="Year" placeholder="2024" type="number" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Make" placeholder="Toyota" />
            <Input label="Model" placeholder="Vios" />
          </div>
          <Input label="Color" placeholder="White" />
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
            <Upload size={24} className="text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Click to upload vehicle photos or documents</p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={() => { showToast('Vehicle registered'); setShowRegister(false); }}>Submit Registration</Button>
            <Button variant="outline" onClick={() => setShowRegister(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
