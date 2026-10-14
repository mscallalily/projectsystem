import React, { useState } from 'react';
import { PageHeader, Card, Badge, statusBadge, Button, Table, SearchBar, Select, Modal, StatCard, Tabs, Toast, Input } from '../../components/ui';
import { MOCK_PARKING_SLOTS, MOCK_TRANSACTIONS, ZONE_CAPACITY, OCCUPANCY_DATA } from '../../data/mock';
import { ParkingSquare, Car, CheckCircle, XCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SLOT_COLORS: Record<string, string> = {
  available: 'bg-green-500',
  occupied: 'bg-red-500',
  reserved: 'bg-yellow-400',
  maintenance: 'bg-gray-400',
};

const SLOT_TEXT: Record<string, string> = {
  available: 'text-green-700',
  occupied: 'text-red-700',
  reserved: 'text-yellow-700',
  maintenance: 'text-gray-600',
};

function GateOperations() {
  const [panel, setPanel] = useState<'entry' | 'exit'>('entry');
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'approved' | 'denied' | 'notfound'>('idle');
  const [scanResult, setScanResult] = useState<any>(null);
  const [toast, setToast] = useState('');

  const simulate = () => {
    setScanState('scanning');
    setTimeout(() => {
      const outcomes = ['approved', 'denied', 'notfound'] as const;
      const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
      setScanState(outcome === 'notfound' ? 'notfound' : outcome === 'denied' ? 'denied' : 'approved');
      setScanResult({ plate: 'ABC-1234', driver: 'Maria Santos', vehicle: 'Toyota Vios 2021', rfid: 'RFID-001' });
    }, 1200);
  };

  const reset = () => { setScanState('idle'); setScanResult(null); };

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <Button variant={panel === 'entry' ? 'primary' : 'outline'} onClick={() => { setPanel('entry'); reset(); }}>Entry Gate</Button>
        <Button variant={panel === 'exit' ? 'primary' : 'outline'} onClick={() => { setPanel('exit'); reset(); }}>Exit Gate</Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-8 text-center">
          <h3 className="font-bold text-[#123B6D] text-lg mb-2">{panel === 'entry' ? 'ENTRY' : 'EXIT'} GATE — Gate 1</h3>
          <p className="text-xs text-green-600 font-medium flex items-center justify-center gap-1 mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Gate Operational
          </p>
          <div className={`w-36 h-36 rounded-full mx-auto flex items-center justify-center mb-6 ${
            scanState === 'approved' ? 'bg-green-100' :
            scanState === 'denied' || scanState === 'notfound' ? 'bg-red-100' :
            scanState === 'scanning' ? 'bg-blue-100' : 'bg-slate-100'
          }`}>
            {scanState === 'idle' && <Car size={56} className="text-slate-300" />}
            {scanState === 'scanning' && <Car size={56} className="text-[#2563EB] animate-pulse" />}
            {scanState === 'approved' && <CheckCircle size={56} className="text-green-500" />}
            {(scanState === 'denied' || scanState === 'notfound') && <XCircle size={56} className="text-red-500" />}
          </div>

          {scanState === 'idle' && <p className="text-slate-400 text-sm mb-6">Awaiting vehicle scan</p>}
          {scanState === 'scanning' && <p className="text-[#2563EB] font-semibold animate-pulse mb-6">Processing...</p>}
          {scanState === 'approved' && (
            <div className="mb-6">
              <p className="text-green-600 font-bold text-xl mb-3">✓ {panel === 'entry' ? 'ENTRY APPROVED' : 'EXIT RECORDED'}</p>
              {scanResult && (
                <div className="text-left bg-green-50 rounded-xl p-4 space-y-1 text-sm">
                  <p className="flex justify-between"><span className="text-slate-400">Plate</span><span className="font-mono font-bold">{scanResult.plate}</span></p>
                  <p className="flex justify-between"><span className="text-slate-400">Driver</span><span className="font-medium">{scanResult.driver}</span></p>
                  <p className="flex justify-between"><span className="text-slate-400">Vehicle</span><span>{scanResult.vehicle}</span></p>
                  <p className="flex justify-between"><span className="text-slate-400">Time</span><span>{new Date().toLocaleTimeString()}</span></p>
                </div>
              )}
            </div>
          )}
          {scanState === 'denied' && <p className="text-red-600 font-bold text-xl mb-6">✗ ACCESS DENIED — Unauthorized Vehicle</p>}
          {scanState === 'notfound' && <p className="text-red-600 font-bold text-xl mb-6">✗ VEHICLE NOT FOUND</p>}

          <div className="flex gap-3 justify-center">
            {scanState === 'idle' ? (
              <>
                <Button onClick={simulate}><Car size={16} /> Simulate RFID Scan</Button>
                <Button variant="outline">QR Scan</Button>
              </>
            ) : (
              <Button variant="outline" onClick={reset}>New Scan</Button>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-slate-700 mb-4">Recent Gate Activity</h3>
          <div className="space-y-3">
            {[
              { plate: 'ABC-1234', time: '07:32 AM', type: 'entry', status: 'approved' },
              { plate: 'XYZ-5678', time: '08:05 AM', type: 'entry', status: 'approved' },
              { plate: 'JKL-7890', time: '09:15 AM', type: 'entry', status: 'denied' },
              { plate: 'XYZ-5678', time: '12:30 PM', type: 'exit', status: 'recorded' },
            ].map((e, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${e.type === 'entry' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{e.type}</span>
                <span className="font-mono font-bold text-[#123B6D] text-sm">{e.plate}</span>
                <span className="flex-1 text-xs text-slate-400">{e.time}</span>
                <Badge variant={e.status === 'approved' || e.status === 'recorded' ? 'success' : 'danger'}>{e.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function ParkingLayout() {
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [zone, setZone] = useState('Zone A');

  const zoneSlots = MOCK_PARKING_SLOTS.filter(s => s.zone === zone);

  return (
    <div className="space-y-5">
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Select label="Select Zone" value={zone} onChange={e => setZone(e.target.value)}>
            {['Zone A', 'Zone B', 'Zone C'].map(z => <option key={z}>{z}</option>)}
          </Select>
          <div className="flex items-center gap-4 ml-auto flex-wrap text-xs font-medium">
            {Object.entries(SLOT_COLORS).map(([status, color]) => (
              <div key={status} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded ${color}`} />
                <span className="capitalize text-slate-500">{status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#F0F6FC] rounded-2xl p-6">
          {/* Entry/Exit */}
          <div className="flex justify-between mb-4">
            <div className="bg-[#123B6D] text-white text-xs font-bold px-4 py-2 rounded-lg">⬆ EXIT</div>
            <div className="bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg">⬇ ENTRY</div>
          </div>
          {/* Parking grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {zoneSlots.map(slot => (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(slot)}
                className={`relative p-3 rounded-xl border-2 transition-all hover:scale-105 ${SLOT_COLORS[slot.status]} border-transparent hover:border-[#123B6D]`}
              >
                <p className="text-xs font-bold text-white">{slot.id}</p>
                {slot.vehicle && <p className="text-[9px] text-white/80 mt-0.5 truncate">{slot.vehicle}</p>}
                <p className="text-[9px] text-white/70 capitalize">{slot.type}</p>
              </button>
            ))}
          </div>
          {/* Walkway */}
          <div className="mt-4 h-2 bg-slate-200 rounded-full" />
          <p className="text-xs text-center text-slate-400 mt-2">← Walkway →</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <Button size="sm" variant="outline">+ Add Slot</Button>
          <Button size="sm" variant="outline">Save Layout</Button>
          <Button size="sm" variant="ghost">Reset</Button>
        </div>
      </Card>

      <Modal open={!!selectedSlot} onClose={() => setSelectedSlot(null)} title={`Slot ${selectedSlot?.id}`} size="sm">
        {selectedSlot && (
          <div className="space-y-3">
            <div className={`w-full h-24 ${SLOT_COLORS[selectedSlot.status]} rounded-xl flex items-center justify-center`}>
              <p className="text-white font-bold text-2xl">{selectedSlot.id}</p>
            </div>
            {[['Zone', selectedSlot.zone], ['Type', selectedSlot.type], ['Status', selectedSlot.status], ['Assigned Vehicle', selectedSlot.vehicle || 'None'], ['Floor', selectedSlot.floor]].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm border-b border-slate-50 pb-2">
                <span className="text-slate-400">{k}</span>
                <span className="font-medium capitalize">{v}</span>
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <Button size="sm" onClick={() => setSelectedSlot(null)}>Edit Slot</Button>
              <Button size="sm" variant="outline" onClick={() => setSelectedSlot(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function OccupancyMonitor() {
  const total = MOCK_PARKING_SLOTS.length;
  const occupied = MOCK_PARKING_SLOTS.filter(s => s.status === 'occupied').length;
  const available = MOCK_PARKING_SLOTS.filter(s => s.status === 'available').length;
  const reserved = MOCK_PARKING_SLOTS.filter(s => s.status === 'reserved').length;
  const pct = Math.round((occupied / total) * 100);
  const PIE_DATA = [
    { name: 'Occupied', value: occupied, color: '#EF4444' },
    { name: 'Available', value: available, color: '#10B981' },
    { name: 'Reserved', value: reserved, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Capacity" value={total} icon={<ParkingSquare size={18} />} color="navy" />
        <StatCard label="Occupied" value={occupied} icon={<Car size={18} />} color="red" sub={`${pct}%`} />
        <StatCard label="Available" value={available} icon={<CheckCircle size={18} />} color="green" />
        <StatCard label="Reserved" value={reserved} icon={<ParkingSquare size={18} />} color="amber" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 flex flex-col items-center">
          <h3 className="font-semibold text-slate-700 mb-5 self-start">Current Occupancy</h3>
          <PieChart width={220} height={220}>
            <Pie data={PIE_DATA} cx={110} cy={110} innerRadius={65} outerRadius={100} paddingAngle={2} dataKey="value">
              {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
          </PieChart>
          <div className="flex gap-6 mt-4">
            {PIE_DATA.map(d => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-slate-500">{d.name}: <strong className="text-slate-700">{d.value}</strong></span>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <span className="text-4xl font-bold text-[#123B6D]">{pct}%</span>
            <p className="text-sm text-slate-400">Overall Occupancy</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-slate-700 mb-5">Occupancy by Zone</h3>
          {ZONE_CAPACITY.map((z, i) => {
            const p = Math.round((z.occupied / z.capacity) * 100);
            return (
              <div key={z.zone} className="mb-4">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-600">{z.zone}</span>
                  <span className="text-slate-500">{z.occupied}/{z.capacity}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${p > 80 ? 'bg-red-500' : p > 60 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${p}%` }} />
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-slate-700 mb-5">Peak Occupancy Today</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={OCCUPANCY_DATA}>
            <XAxis dataKey="time" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none' }} />
            <Bar dataKey="entries" name="Entries" fill="#2563EB" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

export default function ParkingOperations() {
  const [tab, setTab] = useState('Gate Operations');

  return (
    <div className="animate-fadein">
      <PageHeader title="Parking Operations" subtitle="Gate operations, slot management, and occupancy monitoring" />
      <Tabs tabs={['Gate Operations', 'Transactions', 'Slot Management', 'Parking Layout', 'Occupancy Monitor', 'Availability', 'Capacity']} active={tab} onChange={setTab} />

      {tab === 'Gate Operations' && <GateOperations />}

      {tab === 'Transactions' && (
        <Card>
          <div className="p-5">
            <SearchBar value="" onChange={() => {}} placeholder="Search by plate, driver, or transaction ID..." />
          </div>
          <Table
            columns={[
              { key: 'id', label: 'Txn ID', render: t => <span className="font-mono text-xs text-slate-500">{t.id}</span> },
              { key: 'plate', label: 'Plate', render: t => <span className="font-mono font-bold text-[#123B6D]">{t.plate}</span> },
              { key: 'driver', label: 'Driver' },
              { key: 'entry', label: 'Entry' },
              { key: 'exit', label: 'Exit', render: t => t.exit || '—' },
              { key: 'duration', label: 'Duration', render: t => <span className={t.status === 'ongoing' ? 'text-amber-600 font-semibold' : ''}>{t.duration}</span> },
              { key: 'method', label: 'Method' },
              { key: 'status', label: 'Status', render: t => <Badge variant={statusBadge(t.status)}>{t.status}</Badge> },
            ]}
            data={MOCK_TRANSACTIONS}
          />
        </Card>
      )}

      {tab === 'Slot Management' && (
        <Card>
          <div className="p-5 border-b border-slate-50 flex justify-between items-center">
            <SearchBar value="" onChange={() => {}} placeholder="Search slots..." />
            <Button size="sm"><ParkingSquare size={14} /> Add Slot</Button>
          </div>
          <Table
            columns={[
              { key: 'id', label: 'Slot', render: s => <span className="font-mono font-bold">{s.id}</span> },
              { key: 'zone', label: 'Zone' },
              { key: 'type', label: 'Type' },
              { key: 'floor', label: 'Floor' },
              { key: 'status', label: 'Status', render: s => (
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${SLOT_TEXT[s.status]} bg-${s.status === 'available' ? 'green' : s.status === 'occupied' ? 'red' : s.status === 'reserved' ? 'yellow' : 'gray'}-100`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${SLOT_COLORS[s.status]}`} />
                  {s.status}
                </span>
              )},
              { key: 'vehicle', label: 'Assigned Vehicle', render: s => s.vehicle || '—' },
              { key: 'actions', label: 'Actions', render: () => <div className="flex gap-2"><Button size="sm" variant="ghost">Edit</Button><Button size="sm" variant="danger">Deactivate</Button></div> },
            ]}
            data={MOCK_PARKING_SLOTS}
          />
        </Card>
      )}

      {tab === 'Parking Layout' && <ParkingLayout />}

      {tab === 'Occupancy Monitor' && <OccupancyMonitor />}

      {tab === 'Availability' && (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-[#123B6D] to-[#2563EB] rounded-2xl p-8 text-white text-center">
            <p className="text-blue-200 font-medium mb-2">Available Parking Spaces Right Now</p>
            <p className="text-7xl font-bold text-[#38BDF8]">77</p>
            <p className="text-blue-200 mt-2">of 180 total slots</p>
            <div className="flex justify-center gap-3 mt-5">
              <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10"><RefreshCw size={14} /> Refresh</Button>
            </div>
            <p className="text-xs text-blue-300 mt-3">Last updated: just now</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ZONE_CAPACITY.map(z => {
              const free = z.capacity - z.occupied;
              const pct = (free / z.capacity) * 100;
              return (
                <Card key={z.zone} className="p-5 text-center">
                  <p className="font-bold text-[#123B6D] text-lg">{z.zone}</p>
                  <p className={`text-3xl font-bold mt-2 ${free < 5 ? 'text-red-500' : free < 15 ? 'text-amber-500' : 'text-green-500'}`}>{free}</p>
                  <p className="text-xs text-slate-400">available of {z.capacity}</p>
                  <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${free < 5 ? 'bg-red-500' : free < 15 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'Capacity' && (
        <Card className="p-6">
          <h3 className="font-semibold text-slate-700 mb-6">Parking Capacity Settings</h3>
          <div className="space-y-5">
            {ZONE_CAPACITY.map(z => (
              <div key={z.zone} className="border border-slate-100 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-slate-700">{z.zone}</h4>
                  <Button size="sm" variant="outline">Edit Capacity</Button>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center"><p className="text-slate-400 text-xs">Maximum</p><p className="font-bold text-slate-700 text-xl">{z.capacity}</p></div>
                  <div className="text-center"><p className="text-slate-400 text-xs">Occupied</p><p className="font-bold text-slate-700 text-xl">{z.occupied}</p></div>
                  <div className="text-center"><p className="text-slate-400 text-xs">Available</p><p className={`font-bold text-xl ${z.capacity - z.occupied < 5 ? 'text-red-500' : 'text-green-500'}`}>{z.capacity - z.occupied}</p></div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Occupancy</span>
                    <span className="font-medium text-amber-600">Warning at 80%</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${(z.occupied / z.capacity) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
