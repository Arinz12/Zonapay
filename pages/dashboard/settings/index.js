import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import {
  ArrowBack,
  Person,
  Lock,
  CreditCard,
  Notifications,
  Palette,
  Language,
  Help,
  Info,
  ExitToApp,
  ArrowForward,
  CheckCircle,
  Warning,
  LocalAtm,
  Wifi,
  WaterDrop,
  ElectricBolt
} from '@mui/icons-material';
import Delay from '../../../components/Delay';
import Link from 'next/link'

export default function SettingsPage() {
  const [notificationSettings, setNotificationSettings] = useState({
    payment: true,
    reminders: true,
    promotions: false,
    security: true
  });

  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleNotificationSetting = useCallback((setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  }, []);

  const handleLogout = useCallback(() => {
    console.log('User logged out');
    setLoading(true);
  }, []);

  const SettingItem = ({ icon, title, description, onClick, isDanger = false }) => (
    <li 
      className={`flex justify-between items-center p-5 border-b border-gray-200 cursor-pointer transition-colors hover:bg-gray-50 ${
        isDanger ? 'text-red-500' : ''
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className={`flex items-center justify-center ${
          isDanger ? 'text-red-500' : 'text-blue-600'
        }`}>
          {React.cloneElement(icon, {
            fontSize: "medium"
          })}
        </div>
        <div className="flex-1">
          <h3 className="text-base font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <ArrowForward 
          fontSize="small" 
          className={isDanger ? 'text-red-500' : 'text-gray-400'} 
        />
      </div>
    </li>
  );

  return (
    <>
      <Head>
        <title>Settings | BillPay App</title>
        <meta name="description" content="Manage your account settings" />
      </Head>

      <div className="max-w-2xl mx-auto my-5 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-4 p-5 border-b border-gray-200">
          <button 
            className="flex items-center justify-center p-1 text-blue-600" 
            onClick={() => window.history.back()}
          >
            <ArrowBack color="primary" />
          </button>
          <div className="text-xl font-semibold">Settings</div>
        </div>
        
        <ul className="divide-y divide-gray-200">
          <li className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
            Account Settings
          </li>
          
          <Link href="/info">
            <SettingItem
              icon={<Person />}
              title="Profile Information"
              description="Update your personal details"
              onClick={() => console.log('Profile settings clicked')}
            />
          </Link>
          
          <Link href="/sec">
            <SettingItem
              icon={<Lock />}
              title="Password & Security"
              description="Change password and security settings"
              onClick={() => console.log('Password settings clicked')}
            />
          </Link>
          
          <Link href="dashboard/notifications">
            <SettingItem
              icon={<Notifications />}
              title="Notifications"
              description="Configure alert preferences"
              onClick={() => setShowNotificationModal(true)}
            />
          </Link>
          
          <li className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
            App Preferences
          </li>
          
          <SettingItem
            icon={<Palette />}
            title="Appearance"
            description="Dark mode and theme settings"
            onClick={() => console.log('Appearance settings clicked')}
          />
          
          <SettingItem
            icon={<Language />}
            title="Language"
            description="English (United States)"
            onClick={() => console.log('Language settings clicked')}
          />
          
          <li className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
            More
          </li>
          
          <Link>
            <SettingItem
              icon={<Help />}
              title="Help & Support"
              description="FAQs and contact support"
              onClick={() => console.log('Help clicked')}
            />
          </Link>
          
          <SettingItem
            icon={<Info />}
            title="About"
            description="App version and legal information"
            onClick={() => console.log('About clicked')}
          />
          
          <SettingItem
            icon={<ExitToApp />}
            title="Log Out"
            description="Sign out of your account"
            onClick={() => setShowLogoutModal(true)}
            isDanger={true}
          />
        </ul>
      </div>
      
      {/* Notification Settings Modal */}
      {showNotificationModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowNotificationModal(false)}
        >
          <div 
            className="bg-white w-full max-w-md rounded-xl overflow-hidden animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-gray-200 font-semibold">
              Notification Settings
            </div>
            <div className="p-5">
              {Object.entries(notificationSettings).map(([key, value]) => (
                <div key={key} className="mb-4">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => toggleNotificationSetting(key)}
                        className="absolute opacity-0 w-0 h-0"
                      />
                      <span className={`block overflow-hidden h-6 rounded-full ${
                        value ? 'bg-blue-600' : 'bg-gray-300'
                      }`}>
                        <span className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-0'
                        }`}></span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {key === 'payment' && <LocalAtm fontSize="small" />}
                      {key === 'reminders' && <CheckCircle fontSize="small" />}
                      {key === 'promotions' && <Warning fontSize="small" />}
                      {key === 'security' && <Lock fontSize="small" />}
                      {key === 'payment' && 'Payment Notifications'}
                      {key === 'reminders' && 'Bill Reminders'}
                      {key === 'promotions' && 'Promotional Offers'}
                      {key === 'security' && 'Security Alerts'}
                    </div>
                  </label>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button 
                className="px-4 py-2 rounded-md border border-gray-300 font-medium"
                onClick={() => setShowNotificationModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium"
                onClick={() => {
                  console.log('Notification settings saved:', notificationSettings);
                  setShowNotificationModal(false);
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowLogoutModal(false)}
        >
          <div 
            className="bg-white w-full max-w-md rounded-xl overflow-hidden animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-gray-200 font-semibold">
              Log Out
            </div>
            <div className="p-5">
              <p>Are you sure you want to log out of your account?</p>
            </div>
            <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button 
                className="px-4 py-2 rounded-md border border-gray-300 font-medium"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <Link href="https://www.billsly.co/zonapay/logout">
                <button 
                  className="px-4 py-2 rounded-md bg-red-500 text-white font-medium flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <ExitToApp style={{ fontSize: '18px' }} />
                  Log Out
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {loading && <Delay />}
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}