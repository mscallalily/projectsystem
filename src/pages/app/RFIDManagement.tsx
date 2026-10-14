import React, { useState, useEffect } from 'react';
import { PageHeader, Card, Badge, statusBadge, Button, Table, SearchBar, Modal, Tabs, StatCard, Toast } from '../../components/ui';
import { MOCK_RFID, MOCK_RFID_EVENTS } from '../../data/mock';
import { CreditCard, Wifi, WifiOff, CheckCircle, XCircle, Clock, Activity, Plus } from 'lucide-react';

const READERS = [
  { id: 'RDR-01', name: 'Gate 1 Entry', gate: 'Main Gate - Entry', ip: '10.0.0.10', status: 'online', heartbeat: '2s ago' },
  { id: 'RDR-02', name: 'Gate 1 Exit', gate: 'Main Gate - Exit', ip: '10.0.0.11', status: 'online', heartbeat: '2s ago' },
  { id: 'RDR-03', name: 'Gate 2 Entry', gate: 'Side Gate - Entry', ip: '10.0.0.12', status: 'offline', heartbeat: '5m ago' },
  { id: 'RDR-04', name: 'Gate 2 Exit', gate: 'Side Gate - Exit', ip: '10.0.0.13', status: 'online', heartbeat: '3s ago' },
];

function RFIDAuthScreen() {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'granted' | 'denied' | 'disconnected'>('idle');
  const [result, setResult] = useState<any>(null);

  const simulate = () => {
    setScanState('scanning');
    setTimeout(() => {
      const rand = Math.random();
      if (rand > 0.25) {
        setScanState('granted');
        setResult({ rfid: 'RFID-001', user: 'Maria Santos', vehicle: 'ABC-1234', plate: 'ABC-1234', reason: null });
      } else {
        setScanState('denied');
        setResult({ rfid: 'RFID-005', user: 'Ramon Villanueva', vehicle: 'JKL-7890', plate: 'JKL-7890', reason: 'RFID card is suspended. Vehicle authorization revoked.' });
      }
    }, 1800);
  };

  const reset = () => { setScanState('idle'); setResult(null); };

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${scanState === 'disconnected' ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
          Reader Status: {scanState === 'disconnected' ? 'Disconnected' : 'Ready'}
        </p>
        <p className="text-xs text-slate-400">{new Date().toLocaleTimeString()}</p>
      </div>

      <Card className={`p-10 text-center mb-6 transition-all ${
        scanState === 'granted' ? 'border-green-300 bg-green-50' :
        scanState === 'denied' ? 'border-red-300 bg-red-50' :
        scanState === 'scanning' ? 'border-blue-300' : ''
      }`}>
        <div className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center mb-5 relative ${
          scanState === 'granted' ? 'bg-green-100 pulse-ring' :
          scanState === 'denied' ? 'bg-red-100' :
          scanState === 'scanning' ? 'bg-blue-100' : 'bg-blue-50'
        }`}>
          {scanState === 'idle' && <CreditCard size={52} className="text-blue-200" />}
          {scanState === 'scanning' && <CreditCard size={52} className="text-[#2563EB] animate-pulse" />}
          {scanState === 'granted' && <CheckCircle size={52} className="text-green-500" />}
          {scanState === 'denied' && <XCircle size={52} className="text-red-500" />}
        </div>

        {scanState === 'idle' && (
          <div>
            <h3 className="font-bold text-xl text-slate-700 mb-2">Ready to Scan</h3>
            <p className="text-slate-400 text-sm">Place RFID card or tag near the reader</p>
          </div>
        )}
        {scanState === 'scanning' && (
          <div>
            <h3 className="font-bold text-xl text-[#2563EB] mb-2">Scanning...</h3>
            <p className="text-slate-400 text-sm animate-pulse">Reading RFID card</p>
            <div className="mt-4 relative h-1 bg-blue-100 rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-[#2563EB] rounded-full w-1/2 animate-bounce" />
            </div>
          </div>
        )}
        {scanState === 'granted' && result && (
          <div>
            <h3 className="font-bold text-2xl text-green-600 mb-3">✓ ACCESS GRANTED</h3>
            <div className="text-left bg-white rounded-xl p-4 space-y-2 text-sm">
              <p className="flex justify-between"><span className="text-slate-400">RFID ID</span><span className="font-mono font-bold">{result.rfid}</span></p>
              <p className="flex justify-between"><span className="text-slate-400">User</span><span className="font-semibold">{result.user}</span></p>
              <p className="flex justify-between"><span className="text-slate-400">Vehicle</span><span className="font-mono">{result.plate}</span></p>
              <p className="flex justify-between"><span className="text-slate-400">Time</span><span>{new Date().toLocaleTimeString()}</span></p>
            </div>
          </div>
        )}
        {scanState === 'denied' && result && (
          <div>
            <h3 className="font-bold text-2xl text-red-600 mb-3">✗ ACCESS DENIED</h3>
            <p className="text-sm text-red-600 bg-red-100 rounded-xl px-4 py-3 mb-3">{result.reason}</p>
            <div className="text-left bg-white rounded-xl p-4 space-y-2 text-sm">
              <p className="flex justify-between"><span className="text-slate-400">RFID ID</span><span className="font-mono font-bold">{result.rfid}</span></p>
              <p className="flex justify-between"><span className="text-slate-400">User</span><span className="font-semibold">{result.user}</span></p>
              <p className="flex justify-between"><span className="text-slate-400">Vehicle</span><span className="font-mono">{result.plate}</span></p>
            </div>
          </div>
        )}
      </Card>

      <div className="flex gap-3">
        {scanState === 'idle' ? (
          <Button className="flex-1 justify-center py-4 text-base" onClick={simulate}>
            <CreditCard size={20} /> Simulate RFID Scan
          </Button>
        ) : (
          <Button className="flex-1 justify-center" variant="outline" onClick={reset}>Reset / New Scan</Button>
        )}
      </div>
    </div>
  );
}

function EntryExitMonitor() {
  const [events, setEvents] = useState(MOCK_RFID_EVENTS);
  const [search, setSearch] = useState('');
  const [live, setLive] = useState(true);

  useEffect(() => {
    if (!live) return;
    const interval = setInterval(() => {
      const vehicles = ['ABC-1234', 'XYZ-5678', 'MNO-2345'];
      const drivers = ['Maria Santos', 'Juan dela Cruz', 'Liza Gonzales'];
      const i = Math.floor(Math.random() * 3);
      const newEvent = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        rfidId: `RFID-00${i + 1}`,
        plate: vehicles[i],
        driver: drivers[i],
        gate: Math.random() > 0.5 ? 'Gate 1' : 'Gate 2',
        type: Math.random() > 0.5 ? 'entry' : 'exit',
        result: Math.random() > 0.15 ? 'granted' : 'denied',
      };
      setEvents(prev => [newEvent, ...prev.slice(0, 19)]);
    }, 5000);
    return () => clearInterval(interval);
  }, [live]);

  const filtered = events.filter(e => {
    const q = search.toLowerCase();
    return e.plate.toLowerCase().includes(q) || e.driver.toLowerCase().includes(q) || e.rfidId.toLowerCase().includes(q);
  });

  const todayEntries = events.filter(e => e.type === 'entry').length;
  const todayExits = events.filter(e => e.type === 'exit').length;
  const denied = events.filter(e => e.result === 'denied').length;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Today's Entries" value={todayEntries} icon={<Activity size={18} />} color="green" />
        <StatCard label="Today's Exits" value={todayExits} icon={<Activity size={18} />} color="blue" />
        <StatCard label="Denied" value={denied} icon={<XCircle size={18} />} color="red" />
      </div>
      <Card>
        <div className="px-5 pt-5 flex items-center justify-between">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by plate, driver, or RFID..." />
          <Button size="sm" variant={live ? 'primary' : 'outline'} onClick={() => setLive(l => !l)} className="ml-3 shrink-0">
            {live ? '● Live' : 'Paused'}
          </Button>
        </div>
        <Table
          columns={[
            { key: 'timestamp', label: 'Timestamp', render: e => <span className="font-mono text-xs">{e.timestamp}</span> },
            { key: 'rfidId', label: 'RFID', render: e => <span className="font-mono text-xs">{e.rfidId}</span> },
            { key: 'plate', label: 'Plate', render: e => <span className="font-mono font-bold text-[#123B6D]">{e.plate}</span> },
            { key: 'driver', label: 'Driver' },
            { key: 'gate', label: 'Gate' },
            { key: 'type', label: 'Type', render: e => <Badge variant={e.type === 'entry' ? 'success' : 'info'}>{e.type}</Badge> },
            { key: 'result', label: 'Result', render: e => <Badge variant={e.result === 'granted' ? 'success' : 'danger'}>{e.result}</Badge> },
          ]}
          data={filtered}
        />
      </Card>
    </div>
  );
}

function HardwareStatus() {
  const [testing, setTesting] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const test = (id: string) => {
    setTesting(id);
    setTimeout(() => {
      setTesting(null);
      setToast(`Connection test for ${id} complete`);
      setTimeout(() => setToast(''), 2500);
    }, 1500);
  };

  return (
    <div className="space-y-5">
      {toast && <Toast message={toast} type="success" onClose={() => setToast('')} />}
      <div className="bg-[#F0F6FC] border border-blue-200 rounded-2xl p-6">
        <h3 className="font-semibold text-[#123B6D] mb-4">System Integration Diagram</h3>
        <div className="flex items-center justify-center gap-4 flex-wrap text-sm">
          {['RFID Reader', '→', 'API Gateway', '→', 'PASS System', '→', 'Access Decision'].map((s, i) => (
            <div key={i} className={`${s === '→' ? 'text-slate-400 font-bold' : 'bg-white border border-blue-200 rounded-xl px-4 py-2.5 font-medium text-[#123B6D] shadow-sm'}`}>{s}</div>
          ))}
        </div>
        <p className="text-xs text-slate-400 text-center mt-4">* This is a simulated hardware integration. No real hardware is connected in this prototype.</p>
      </div>
      <Card className="p-6">
        <h3 className="font-semibold text-slate-700 mb-5">RFID Reader Devices</h3>
        <div className="space-y-4">
          {READERS.map(r => (
            <div key={r.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${r.status === 'online' ? 'bg-green-100' : 'bg-red-100'}`}>
                {r.status === 'online' ? <Wifi size={22} className="text-green-600" /> : <WifiOff size={22} className="text-red-500" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-slate-700">{r.name}</p>
                  <Badge variant={r.status === 'online' ? 'success' : 'danger'}>{r.status}</Badge>
                </div>
                <p className="text-sm text-slate-400 mt-0.5">{r.gate}</p>
                <p className="text-xs text-slate-400 font-mono mt-1">{r.ip} · Last heartbeat: {r.heartbeat}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => test(r.id)} disabled={testing === r.id}>
                {testing === r.id ? 'Testing...' : 'Test Connection'}
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function RFIDManagement() {
  const [tab, setTab] = useState('RFID Management');
  const [toast, setToast] = useState('');
  const [showAssign, setShowAssign] = useState(false);

  return (
    <div className="animate-fadein">
      {toast && <Toast message={toast} type="success" onClose={() => setToast('')} />}
      <PageHeader title="RFID & Access Control" subtitle="Manage RFID cards, authentication, and hardware"
        action={tab === 'RFID Management' ? <Button onClick={() => setShowAssign(true)}><Plus size={16} /> Register RFID</Button> : undefined}
      />

      <Tabs tabs={['RFID Management', 'RFID Authentication', 'Entry/Exit Monitor', 'Hardware Status']} active={tab} onChange={setTab} />

      {tab === 'RFID Management' && (
        <Card>
          <Table
            columns={[
              { key: 'id', label: 'RFID ID', render: r => <span className="font-mono font-bold text-[#123B6D]">{r.id}</span> },
              { key: 'user', label: 'Assigned User', render: r => r.user || <span className="text-slate-300 italic">Unassigned</span> },
              { key: 'vehicle', label: 'Vehicle', render: r => r.vehicle ? <span className="font-mono">{r.vehicle}</span> : '—' },
              { key: 'type', label: 'Type' },
              { key: 'assigned', label: 'Assigned Date', render: r => r.assigned || '—' },
              { key: 'expires', label: 'Expires', render: r => r.expires || '—' },
              { key: 'status', label: 'Status', render: r => <Badge variant={statusBadge(r.status)}>{r.status}</Badge> },
              { key: 'actions', label: 'Actions', render: r => (
                <div className="flex gap-2">
                  {r.status === 'active' && <Button size="sm" variant="danger" onClick={() => setToast(`Deactivated: ${r.id}`)}>Deactivate</Button>}
                  {!r.user && <Button size="sm" variant="ghost" onClick={() => setShowAssign(true)}>Assign</Button>}
                </div>
              )},
            ]}
            data={MOCK_RFID}
          />
        </Card>
      )}

      {tab === 'RFID Authentication' && (
        <Card className="p-8"><RFIDAuthScreen /></Card>
      )}

      {tab === 'Entry/Exit Monitor' && <EntryExitMonitor />}

      {tab === 'Hardware Status' && <HardwareStatus />}

      <Modal open={showAssign} onClose={() => setShowAssign(false)} title="Register / Assign RFID">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-blue-200 rounded-xl p-8 text-center">
            <CreditCard size={40} className="text-blue-200 mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium">RFID Tag ID</p>
            <input placeholder="Scan or enter RFID ID..." className="mt-3 w-full border border-slate-200 rounded-xl px-4 py-3 text-center font-mono text-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
            <p className="text-xs text-slate-400 mt-2">or <button className="text-[#2563EB]">simulate a scan</button></p>
          </div>
          <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white">
            <option value="">Select User to Assign</option>
            <option>Maria Santos — 2021-00123</option>
            <option>Juan dela Cruz — 2019-00456</option>
            <option>Ana Reyes — EMP-0021</option>
          </select>
          <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white">
            <option value="">Select Vehicle</option>
            <option>ABC-1234 — Toyota Vios</option>
            <option>XYZ-5678 — Honda CR-V</option>
            <option>DEF-9012 — Mitsubishi Mirage</option>
          </select>
          <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white">
            <option>Card</option><option>Tag</option><option>Sticker</option>
          </select>
          <div className="flex gap-3 pt-2">
            <Button onClick={() => { setToast('RFID registered and assigned'); setShowAssign(false); }}>Register RFID</Button>
            <Button variant="outline" onClick={() => setShowAssign(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
