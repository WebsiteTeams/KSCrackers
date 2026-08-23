'use client';

import React, { useState } from 'react';
import { Store, CreditCard, Truck, Mail, Users, Palette, Save, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

type SettingsTab = 'store' | 'payment' | 'shipping' | 'email' | 'admins';

const TABS: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: 'store', label: 'Store Info', icon: Store },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'email', label: 'Email Templates', icon: Mail },
  { id: 'admins', label: 'Admin Users', icon: Users },
];

export default function SettingsClient() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('store');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    toast.success('Settings saved successfully.');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Settings</h1>
        <p className="text-sm text-stone-500 mt-0.5">Configure your store settings</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-56 shrink-0">
          <div className="bg-white border border-stone-200 rounded-xl p-2 shadow-sm flex lg:flex-col gap-1 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id ? 'bg-burgundy-50 text-burgundy-700' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'}`}>
                  <Icon className="w-4 h-4" /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white border border-stone-200 rounded-xl shadow-sm">
          {activeTab === 'store' && (
            <div className="p-6 space-y-5">
              <h3 className="text-lg font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Store Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Store Name</label>
                  <input type="text" defaultValue="KS Crackers" className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Phone</label>
                  <input type="tel" defaultValue="+91 98765 43210" className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Email</label>
                  <input type="email" defaultValue="support@kscrackers.com" className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Currency</label>
                  <input type="text" defaultValue="INR (₹)" disabled className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-500" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Address</label>
                <input type="text" defaultValue="12/A, Bypass Main Road, Sivakasi, Tamil Nadu 626123" className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Description</label>
                <textarea rows={3} defaultValue="Premium Sivakasi fireworks for every celebration." className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 resize-none" />
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="p-6 space-y-5">
              <h3 className="text-lg font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Payment Settings</h3>
              <div className="space-y-4">
                {['UPI (GPay, PhonePe, Paytm)', 'Bank Transfer', 'Cash on Pickup'].map((method) => (
                  <label key={method} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200 cursor-pointer hover:bg-stone-100 transition-colors">
                    <input type="checkbox" defaultChecked className="rounded border-stone-300 text-burgundy-600 focus:ring-burgundy-500 w-4 h-4" />
                    <span className="text-sm text-stone-700">{method}</span>
                  </label>
                ))}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Refund Policy</label>
                <textarea rows={3} defaultValue="Refund available within 24 hours of order placement if order hasn't been dispatched." className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500 resize-none" />
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="p-6 space-y-5">
              <h3 className="text-lg font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Shipping Settings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Base Shipping Fee (₹)</label>
                  <input type="number" defaultValue={0} className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Per Kg Rate (₹)</label>
                  <input type="number" defaultValue={10} className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Same-Day Cutoff</label>
                  <input type="time" defaultValue="14:00" className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider">Pickup Address</label>
                  <input type="text" defaultValue="12/A, Bypass Main Road, Sivakasi" className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-sm text-stone-900 focus:outline-none focus:border-burgundy-500" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="p-6 space-y-5">
              <h3 className="text-lg font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Email Templates</h3>
              <div className="space-y-3">
                {['Order Confirmation', 'Shipping Notification', 'Delivery Confirmation', 'Review Request'].map((template) => (
                  <div key={template} className="flex items-center justify-between p-4 bg-stone-50 rounded-lg border border-stone-200">
                    <div>
                      <span className="text-sm font-semibold text-stone-900 block">{template}</span>
                      <span className="text-xs text-stone-500">Auto-sent on order events</span>
                    </div>
                    <button className="text-xs text-burgundy-600 hover:text-burgundy-800 font-medium bg-white border border-stone-200 px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors">Edit</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'admins' && (
            <div className="p-6 space-y-5">
              <h3 className="text-lg font-bold text-stone-900" style={{ fontFamily: 'var(--font-heading)' }}>Admin Users</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-stone-50 rounded-lg border border-stone-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-burgundy-100 flex items-center justify-center text-burgundy-700 font-semibold text-xs">AD</div>
                    <div>
                      <span className="text-sm font-semibold text-stone-900 block">Administrator</span>
                      <span className="text-xs text-stone-500">admin@kscrackers.com</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold bg-burgundy-50 text-burgundy-700 px-2 py-1 rounded border border-burgundy-200">Owner</span>
                </div>
              </div>
              <button className="w-full p-3 border-2 border-dashed border-stone-200 rounded-lg text-sm text-stone-500 hover:text-burgundy-600 hover:border-burgundy-300 transition-colors">
                + Add Admin User
              </button>
            </div>
          )}

          {/* Save Footer */}
          <div className="px-6 py-4 border-t border-stone-100 flex justify-end">
            <button onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${saved ? 'bg-green-600 text-white' : 'bg-burgundy-700 text-white hover:bg-burgundy-800'}`}>
              {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Changes</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
