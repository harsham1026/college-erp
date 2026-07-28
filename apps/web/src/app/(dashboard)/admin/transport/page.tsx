'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Toast } from '@/components/shared/Toast';
import api from '@/lib/api';
import {
  getMockCollection, saveMockItem, deleteMockItem,
  DEFAULT_VEHICLES, DEFAULT_DRIVERS, DEFAULT_ROUTES, DEFAULT_TRANSPORT_ALLOCATIONS, DEFAULT_MAINTENANCE, DEFAULT_FUEL_LOGS,
} from '@/lib/mockDb';
import { Bus, Users, MapPin, Wrench, Fuel, X } from 'lucide-react';

export default function TransportPage() {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'drivers' | 'routes' | 'allocations' | 'maintenance' | 'fuel'>('vehicles');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // --- VEHICLES ---
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehTotal, setVehTotal] = useState(0);
  const [vehPage, setVehPage] = useState(1);
  const [vehLimit, setVehLimit] = useState(10);
  const [vehSearch, setVehSearch] = useState('');
  const [vehLoading, setVehLoading] = useState(true);
  const [showVehModal, setShowVehModal] = useState(false);
  const [editVeh, setEditVeh] = useState<any>(null);
  const [vehForm, setVehForm] = useState({ busNo: '', vehicleNo: '', capacity: 50, driverName: '', driverPhone: '', routeName: '', fitnessValidTill: '' });

  // --- DRIVERS ---
  const [drivers, setDrivers] = useState<any[]>([]);
  const [drvTotal, setDrvTotal] = useState(0);
  const [drvPage, setDrvPage] = useState(1);
  const [drvLimit, setDrvLimit] = useState(10);
  const [drvSearch, setDrvSearch] = useState('');
  const [drvLoading, setDrvLoading] = useState(true);
  const [showDrvModal, setShowDrvModal] = useState(false);
  const [editDrv, setEditDrv] = useState<any>(null);
  const [drvForm, setDrvForm] = useState({ name: '', licenseNo: '', phone: '', experience: '5 Years', busAssigned: 'BUS-01' });

  // --- ROUTES ---
  const [routes, setRoutes] = useState<any[]>([]);
  const [rteTotal, setRteTotal] = useState(0);
  const [rtePage, setRtePage] = useState(1);
  const [rteLimit, setRteLimit] = useState(10);
  const [rteSearch, setRteSearch] = useState('');
  const [rteLoading, setRteLoading] = useState(true);
  const [showRteModal, setShowRteModal] = useState(false);
  const [editRte, setEditRte] = useState<any>(null);
  const [rteForm, setRteForm] = useState({ name: '', startPoint: '', endPoint: '', totalStops: 5, farePerTerm: 10000, distanceKm: 20 });

  // --- ALLOCATIONS ---
  const [allocations, setAllocations] = useState<any[]>([]);
  const [allocTotal, setAllocTotal] = useState(0);
  const [allocPage, setAllocPage] = useState(1);
  const [allocLimit, setAllocLimit] = useState(10);
  const [allocSearch, setAllocSearch] = useState('');
  const [allocLoading, setAllocLoading] = useState(true);
  const [showAllocModal, setShowAllocModal] = useState(false);
  const [allocForm, setAllocForm] = useState({ userName: '', userRole: 'Student', identifier: '', routeName: 'Route 1', pickupStop: '', busNo: 'BUS-01' });

  // --- MAINTENANCE & FUEL ---
  const [maint, setMaint] = useState<any[]>([]);
  const [fuel, setFuel] = useState<any[]>([]);

  // Fetchers
  const fetchVehicles = useCallback(async () => {
    setVehLoading(true);
    try {
      const res: any = await api.get('/transport/vehicles', { page: vehPage, limit: vehLimit, search: vehSearch });
      setVehicles(res.data || []);
      setVehTotal(res.pagination?.total || 0);
    } catch {
      const res = getMockCollection('mock_vehicles', DEFAULT_VEHICLES, {
        page: vehPage, limit: vehLimit, search: vehSearch, searchFields: ['busNo', 'vehicleNo', 'driverName', 'routeName'],
      });
      setVehicles(res.data);
      setVehTotal(res.pagination.total);
    } finally { setVehLoading(false); }
  }, [vehPage, vehLimit, vehSearch]);

  const fetchDrivers = useCallback(async () => {
    setDrvLoading(true);
    try {
      const res: any = await api.get('/transport/drivers', { page: drvPage, limit: drvLimit, search: drvSearch });
      setDrivers(res.data || []);
      setDrvTotal(res.pagination?.total || 0);
    } catch {
      const res = getMockCollection('mock_drivers', DEFAULT_DRIVERS, {
        page: drvPage, limit: drvLimit, search: drvSearch, searchFields: ['name', 'licenseNo', 'busAssigned'],
      });
      setDrivers(res.data);
      setDrvTotal(res.pagination.total);
    } finally { setDrvLoading(false); }
  }, [drvPage, drvLimit, drvSearch]);

  const fetchRoutes = useCallback(async () => {
    setRteLoading(true);
    try {
      const res: any = await api.get('/transport/routes', { page: rtePage, limit: rteLimit, search: rteSearch });
      setRoutes(res.data || []);
      setRteTotal(res.pagination?.total || 0);
    } catch {
      const res = getMockCollection('mock_routes', DEFAULT_ROUTES, {
        page: rtePage, limit: rteLimit, search: rteSearch, searchFields: ['name', 'startPoint', 'endPoint'],
      });
      setRoutes(res.data);
      setRteTotal(res.pagination.total);
    } finally { setRteLoading(false); }
  }, [rtePage, rteLimit, rteSearch]);

  const fetchAllocations = useCallback(async () => {
    setAllocLoading(true);
    try {
      const res: any = await api.get('/transport/allocations', { page: allocPage, limit: allocLimit, search: allocSearch });
      setAllocations(res.data || []);
      setAllocTotal(res.pagination?.total || 0);
    } catch {
      const res = getMockCollection('mock_transport_allocations', DEFAULT_TRANSPORT_ALLOCATIONS, {
        page: allocPage, limit: allocLimit, search: allocSearch, searchFields: ['userName', 'identifier', 'routeName', 'busNo'],
      });
      setAllocations(res.data);
      setAllocTotal(res.pagination.total);
    } finally { setAllocLoading(false); }
  }, [allocPage, allocLimit, allocSearch]);

  useEffect(() => {
    if (activeTab === 'vehicles') fetchVehicles();
    else if (activeTab === 'drivers') fetchDrivers();
    else if (activeTab === 'routes') fetchRoutes();
    else if (activeTab === 'allocations') fetchAllocations();
    else if (activeTab === 'maintenance') setMaint(DEFAULT_MAINTENANCE);
    else if (activeTab === 'fuel') setFuel(DEFAULT_FUEL_LOGS);
  }, [activeTab, fetchVehicles, fetchDrivers, fetchRoutes, fetchAllocations]);

  // Handlers
  const handleVehSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMockItem('mock_vehicles', DEFAULT_VEHICLES, { ...(editVeh ? { id: editVeh.id } : {}), ...vehForm, status: 'Active' });
    setToast({ message: editVeh ? 'Vehicle updated!' : 'Vehicle added to fleet!', type: 'success' });
    setShowVehModal(false);
    fetchVehicles();
  };

  const handleDrvSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMockItem('mock_drivers', DEFAULT_DRIVERS, { ...(editDrv ? { id: editDrv.id } : {}), ...drvForm, status: 'Active' });
    setToast({ message: editDrv ? 'Driver details updated!' : 'Driver onboarded successfully!', type: 'success' });
    setShowDrvModal(false);
    fetchDrivers();
  };

  const handleRteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMockItem('mock_routes', DEFAULT_ROUTES, { ...(editRte ? { id: editRte.id } : {}), ...rteForm, status: 'Active' });
    setToast({ message: editRte ? 'Route updated!' : 'Route created successfully!', type: 'success' });
    setShowRteModal(false);
    fetchRoutes();
  };

  const handleAllocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMockItem('mock_transport_allocations', DEFAULT_TRANSPORT_ALLOCATIONS, { ...allocForm, passStatus: 'Active', validTill: '2027-05-31' });
    setToast({ message: 'Transport pass issued!', type: 'success' });
    setShowAllocModal(false);
    fetchAllocations();
  };

  const vehColumns = [
    { key: 'busNo', title: 'Bus Identification', sortable: true, render: (v: string, r: any) => (
      <div>
        <p className="font-bold text-indigo-600 dark:text-indigo-400">{v}</p>
        <p className="text-xs text-slate-500 font-mono">Reg: {r.vehicleNo}</p>
      </div>
    )},
    { key: 'capacity', title: 'Seating Capacity', render: (v: number) => `${v} Seats` },
    { key: 'driverName', title: 'Assigned Driver', render: (v: string, r: any) => (
      <div>
        <p className="font-medium text-slate-800 dark:text-slate-200">{v}</p>
        <p className="text-xs text-slate-500">{r.driverPhone}</p>
      </div>
    )},
    { key: 'routeName', title: 'Assigned Route' },
    { key: 'fitnessValidTill', title: 'Fitness Expiry' },
    { key: 'status', title: 'Status', render: (v: string) => (
      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">{v}</span>
    )},
  ];

  const drvColumns = [
    { key: 'name', title: 'Driver Name', sortable: true, render: (v: string, r: any) => (
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">{v}</p>
        <p className="text-xs text-slate-500">Exp: {r.experience}</p>
      </div>
    )},
    { key: 'licenseNo', title: 'License Number', render: (v: string) => <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">{v}</span> },
    { key: 'phone', title: 'Phone Number' },
    { key: 'busAssigned', title: 'Bus Assigned', render: (v: string) => <strong className="text-indigo-600 dark:text-indigo-400">{v}</strong> },
    { key: 'status', title: 'Status', render: (v: string) => <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950">{v}</span> },
  ];

  const rteColumns = [
    { key: 'name', title: 'Route Name', sortable: true },
    { key: 'startPoint', title: 'Start & Destination', render: (_: any, r: any) => `${r.startPoint} ➔ ${r.endPoint}` },
    { key: 'totalStops', title: 'Pickups', render: (v: number) => `${v} Stops` },
    { key: 'distanceKm', title: 'Distance', render: (v: number) => `${v} km` },
    { key: 'farePerTerm', title: 'Term Fee', render: (v: number) => `₹${v.toLocaleString()}` },
  ];

  const allocColumns = [
    { key: 'userName', title: 'Commuter Name', sortable: true, render: (v: string, r: any) => (
      <div>
        <p className="font-semibold text-slate-900 dark:text-white">{v}</p>
        <p className="text-xs text-slate-500">{r.identifier} ({r.userRole})</p>
      </div>
    )},
    { key: 'routeName', title: 'Route' },
    { key: 'pickupStop', title: 'Pickup Stop' },
    { key: 'busNo', title: 'Bus', render: (v: string) => <span className="font-bold text-indigo-600 dark:text-indigo-400">{v}</span> },
    { key: 'passStatus', title: 'Bus Pass', render: (v: string) => <span className="px-2.5 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-950">{v}</span> },
  ];

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <Breadcrumbs items={[{ label: 'Transport Management' }]} />
        <div className="flex items-center gap-3 mt-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md flex-shrink-0">
            <Bus className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Transport & Fleet Module</h1>
            <p className="text-sm text-slate-500">Manage bus fleet, drivers, routes, stops, student & faculty bus passes, maintenance & fuel logs</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button onClick={() => setActiveTab('vehicles')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'vehicles' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Bus className="w-4 h-4" /> Vehicles Fleet
        </button>
        <button onClick={() => setActiveTab('drivers')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'drivers' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Users className="w-4 h-4" /> Drivers
        </button>
        <button onClick={() => setActiveTab('routes')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'routes' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <MapPin className="w-4 h-4" /> Routes & Stops
        </button>
        <button onClick={() => setActiveTab('allocations')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'allocations' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Users className="w-4 h-4" /> Bus Passes
        </button>
        <button onClick={() => setActiveTab('maintenance')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'maintenance' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Wrench className="w-4 h-4" /> Servicing Logs
        </button>
        <button onClick={() => setActiveTab('fuel')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'fuel' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Fuel className="w-4 h-4" /> Fuel Expenses
        </button>
      </div>

      {activeTab === 'vehicles' && (
        <DataTable
          title="Vehicle Fleet Registry"
          columns={vehColumns}
          data={vehicles}
          totalItems={vehTotal}
          page={vehPage}
          limit={vehLimit}
          isLoading={vehLoading}
          onPageChange={setVehPage}
          onLimitChange={(l) => { setVehPage(1); setVehLimit(l); }}
          onSearch={(s) => { setVehSearch(s); setVehPage(1); }}
          onSort={() => {}}
          onAdd={() => { setEditVeh(null); setVehForm({ busNo: '', vehicleNo: '', capacity: 50, driverName: '', driverPhone: '', routeName: '', fitnessValidTill: '' }); setShowVehModal(true); }}
          onEdit={(r) => { setEditVeh(r); setVehForm({ busNo: r.busNo, vehicleNo: r.vehicleNo, capacity: r.capacity, driverName: r.driverName, driverPhone: r.driverPhone, routeName: r.routeName, fitnessValidTill: r.fitnessValidTill }); setShowVehModal(true); }}
          onDelete={(r) => { deleteMockItem('mock_vehicles', DEFAULT_VEHICLES, r.id); setToast({ message: 'Vehicle deleted from fleet!', type: 'success' }); fetchVehicles(); }}
          addLabel="Add Vehicle"
          searchPlaceholder="Search vehicle no, driver or route..."
        />
      )}

      {activeTab === 'drivers' && (
        <DataTable
          title="Transport Drivers Directory"
          columns={drvColumns}
          data={drivers}
          totalItems={drvTotal}
          page={drvPage}
          limit={drvLimit}
          isLoading={drvLoading}
          onPageChange={setDrvPage}
          onLimitChange={(l) => { setDrvPage(1); setDrvLimit(l); }}
          onSearch={(s) => { setDrvSearch(s); setDrvPage(1); }}
          onSort={() => {}}
          onAdd={() => { setEditDrv(null); setDrvForm({ name: '', licenseNo: '', phone: '', experience: '5 Years', busAssigned: 'BUS-01' }); setShowDrvModal(true); }}
          onEdit={(r) => { setEditDrv(r); setDrvForm({ name: r.name, licenseNo: r.licenseNo, phone: r.phone, experience: r.experience, busAssigned: r.busAssigned }); setShowDrvModal(true); }}
          onDelete={(r) => { deleteMockItem('mock_drivers', DEFAULT_DRIVERS, r.id); setToast({ message: 'Driver deleted!', type: 'success' }); fetchDrivers(); }}
          addLabel="Add Driver"
          searchPlaceholder="Search driver name or license..."
        />
      )}

      {activeTab === 'routes' && (
        <DataTable
          title="Transport Routes & Fares"
          columns={rteColumns}
          data={routes}
          totalItems={rteTotal}
          page={rtePage}
          limit={rteLimit}
          isLoading={rteLoading}
          onPageChange={setRtePage}
          onLimitChange={(l) => { setRtePage(1); setRteLimit(l); }}
          onSearch={(s) => { setRteSearch(s); setRtePage(1); }}
          onSort={() => {}}
          onAdd={() => { setEditRte(null); setRteForm({ name: '', startPoint: '', endPoint: '', totalStops: 5, farePerTerm: 10000, distanceKm: 20 }); setShowRteModal(true); }}
          onEdit={(r) => { setEditRte(r); setRteForm({ name: r.name, startPoint: r.startPoint, endPoint: r.endPoint, totalStops: r.totalStops, farePerTerm: r.farePerTerm, distanceKm: r.distanceKm }); setShowRteModal(true); }}
          onDelete={(r) => { deleteMockItem('mock_routes', DEFAULT_ROUTES, r.id); setToast({ message: 'Route deleted!', type: 'success' }); fetchRoutes(); }}
          addLabel="Add Route"
          searchPlaceholder="Search routes or stops..."
        />
      )}

      {activeTab === 'allocations' && (
        <DataTable
          title="Student & Faculty Bus Passes"
          columns={allocColumns}
          data={allocations}
          totalItems={allocTotal}
          page={allocPage}
          limit={allocLimit}
          isLoading={allocLoading}
          onPageChange={setAllocPage}
          onLimitChange={(l) => { setAllocPage(1); setAllocLimit(l); }}
          onSearch={(s) => { setAllocSearch(s); setAllocPage(1); }}
          onSort={() => {}}
          onAdd={() => { setAllocForm({ userName: '', userRole: 'Student', identifier: '', routeName: routes[0]?.name || 'Route 1', pickupStop: '', busNo: vehicles[0]?.busNo || 'BUS-01' }); setShowAllocModal(true); }}
          onDelete={(r) => { deleteMockItem('mock_transport_allocations', DEFAULT_TRANSPORT_ALLOCATIONS, r.id); setToast({ message: 'Bus pass revoked!', type: 'success' }); fetchAllocations(); }}
          addLabel="Issue Bus Pass"
          searchPlaceholder="Search commuter name or USN..."
        />
      )}

      {activeTab === 'maintenance' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Vehicle Servicing & Repair Logs</h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {maint.map((m) => (
              <div key={m.id} className="py-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">{m.busNo} - {m.serviceType}</h4>
                  <p className="text-xs text-slate-500">Vendor: {m.vendor} | Date: {m.serviceDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-indigo-600 dark:text-indigo-400">₹{m.cost.toLocaleString()}</p>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">{m.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'fuel' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Fuel Purchase & Mileage Log</h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {fuel.map((f) => (
              <div key={f.id} className="py-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">{f.busNo} ({f.liters} Liters Diesel)</h4>
                  <p className="text-xs text-slate-500">Driver: {f.driverName} | Odometer: {f.odometerReading} km | Date: {f.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-600 dark:text-amber-400">₹{f.totalCost.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vehicle Modal */}
      {showVehModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowVehModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editVeh ? 'Edit Vehicle' : 'Add Vehicle to Fleet'}</h3>
              <button onClick={() => setShowVehModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleVehSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Bus Identification *</label>
                  <input value={vehForm.busNo} onChange={(e) => setVehForm({ ...vehForm, busNo: e.target.value })} placeholder="e.g. BUS-04" required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Registration No *</label>
                  <input value={vehForm.vehicleNo} onChange={(e) => setVehForm({ ...vehForm, vehicleNo: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Capacity Seats</label>
                  <input type="number" value={vehForm.capacity} onChange={(e) => setVehForm({ ...vehForm, capacity: Number(e.target.value) })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Driver Name</label>
                  <input value={vehForm.driverName} onChange={(e) => setVehForm({ ...vehForm, driverName: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowVehModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Save Bus</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Driver Modal */}
      {showDrvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDrvModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editDrv ? 'Edit Driver' : 'Onboard Driver'}</h3>
              <button onClick={() => setShowDrvModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleDrvSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Driver Full Name *</label>
                <input value={drvForm.name} onChange={(e) => setDrvForm({ ...drvForm, name: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">License No *</label>
                  <input value={drvForm.licenseNo} onChange={(e) => setDrvForm({ ...drvForm, licenseNo: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Phone Number *</label>
                  <input value={drvForm.phone} onChange={(e) => setDrvForm({ ...drvForm, phone: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowDrvModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Save Driver</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Route Modal */}
      {showRteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowRteModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editRte ? 'Edit Route' : 'Add Route'}</h3>
              <button onClick={() => setShowRteModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleRteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Route Name *</label>
                <input value={rteForm.name} onChange={(e) => setRteForm({ ...rteForm, name: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Start Point</label>
                  <input value={rteForm.startPoint} onChange={(e) => setRteForm({ ...rteForm, startPoint: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">End Point</label>
                  <input value={rteForm.endPoint} onChange={(e) => setRteForm({ ...rteForm, endPoint: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Fare Per Term (₹)</label>
                  <input type="number" value={rteForm.farePerTerm} onChange={(e) => setRteForm({ ...rteForm, farePerTerm: Number(e.target.value) })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Distance (km)</label>
                  <input type="number" value={rteForm.distanceKm} onChange={(e) => setRteForm({ ...rteForm, distanceKm: Number(e.target.value) })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowRteModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Save Route</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bus Pass Allocation Modal */}
      {showAllocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAllocModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Issue Transport Bus Pass</h3>
              <button onClick={() => setShowAllocModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAllocSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Commuter Name *</label>
                  <input value={allocForm.userName} onChange={(e) => setAllocForm({ ...allocForm, userName: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">USN / Employee ID *</label>
                  <input value={allocForm.identifier} onChange={(e) => setAllocForm({ ...allocForm, identifier: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">User Role</label>
                  <select value={allocForm.userRole} onChange={(e) => setAllocForm({ ...allocForm, userRole: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0">
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher / Faculty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">Pickup Stop *</label>
                  <input value={allocForm.pickupStop} onChange={(e) => setAllocForm({ ...allocForm, pickupStop: e.target.value })} required className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm border-0" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button type="button" onClick={() => setShowAllocModal(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Issue Pass</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
