import { useState, useCallback } from 'react';
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
  const [loading,setLoading]=useState(false)

  const toggleNotificationSetting = useCallback((setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  }, []);

  const handleLogout = useCallback(() => {
    console.log('User logged out');
    setloading(true);
  }, []);

  const SettingItem = ({ icon, title, description, onClick, isDanger = false }) => (
    <li 
      className={`settings-item ${isDanger ? 'logout-item' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <div className="item-content">
        <div className="item-icon">
          {React.cloneElement(icon, {
            fontSize: "medium",
            color: isDanger ? "error" : "primary"
          })}
        </div>
        <div className="item-text">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      <div className="item-arrow">
        <ArrowForward fontSize="small" color={isDanger ? "error" : "disabled"} />
      </div>
    </li>
  );

  return (
    <>
      <Head>
        <title>Settings | BillPay App</title>
        <meta name="description" content="Manage your account settings" />
      </Head>

      <div className="settings-container">
        <div className="settings-header">
          <button className="back-button" onClick={() => window.history.back()}>
            <ArrowBack color="primary" />
          </button>
          <div className="settings-title">Settings</div>
        </div>
        
        <ul className="settings-menu">
          <li className="divider">Account Settings</li>
          
         <Link href="/info"> {<SettingItem
            icon={<Person />}
            title="Profile Information"
            description="Update your personal details"
            onClick={() => console.log('Profile settings clicked')}
          />}</Link>
          
          <Link href="/sec">{<SettingItem
            icon={<Lock />}
            title="Password & Security"
            description="Change password and security settings"
            onClick={() => console.log('Password settings clicked')}
          />}</Link>
          
          {/* <SettingItem
            icon={<CreditCard />}
            title="Payment Methods"
            description="Manage your payment options"
            onClick={() => console.log('Payment methods clicked')}
          /> */}
          
         <Link href={"dashboard/notifications"}>{<SettingItem
            icon={<Notifications />}
            title="Notifications"
            description="Configure alert preferences"
            onClick={() => setShowNotificationModal(true)}
          />}</Link>
          
          <li className="divider">App Preferences</li>
          
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
          
          <li className="divider">More</li>
          
         <Link>{<SettingItem
            icon={<Help />}
            title="Help & Support"
            description="FAQs and contact support"
            onClick={() => console.log('Help clicked')}
          />}</Link>
          
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
        <div className="modal" onClick={() => setShowNotificationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">Notification Settings</div>
            <div className="modal-body">
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={notificationSettings.payment}
                    onChange={() => toggleNotificationSetting('payment')}
                    className="toggle-switch"
                  />
                  <span className="slider"></span>
                  <span style={{ marginLeft: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LocalAtm fontSize="small" /> Payment Notifications
                  </span>
                </label>
              </div>
              
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={notificationSettings.reminders}
                    onChange={() => toggleNotificationSetting('reminders')}
                    className="toggle-switch"
                  />
                  <span className="slider"></span>
                  <span style={{ marginLeft: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle fontSize="small" /> Bill Reminders
                  </span>
                </label>
              </div>
              
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={notificationSettings.promotions}
                    onChange={() => toggleNotificationSetting('promotions')}
                    className="toggle-switch"
                  />
                  <span className="slider"></span>
                  <span style={{ marginLeft: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Warning fontSize="small" /> Promotional Offers
                  </span>
                </label>
              </div>
              
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={notificationSettings.security}
                    onChange={() => toggleNotificationSetting('security')}
                    className="toggle-switch"
                  />
                  <span className="slider"></span>
                  <span style={{ marginLeft: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Lock fontSize="small" /> Security Alerts
                  </span>
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowNotificationModal(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
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
        <div className="modal" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">Log Out</div>
            <div className="modal-body">
              <p>Are you sure you want to log out of your account?</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
              <Link href={"https://www.billsly.co/zonapay/logout"}>
              <button className="btn btn-danger" onClick={handleLogout}>
                <ExitToApp style={{ marginRight: '8px' }} />
                Log Out
              </button></Link>
            </div>
          </div>
        </div>
      )}
{loading && <Delay/>}
      <style jsx global>{`
        :root {
          --primary: #2563EB;
          --primary-light: rgba(37, 99, 235, 0.1);
          --secondary: #f8f9fa;
          --success: #28a745;
          --warning: #ffc107;
          --danger: #dc3545;
          --text: #333;
          --light-text: #6c757d;
          --border: #e0e0e0;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
          background-color: #f5f7fa;
          color: var(--text);
        }
        
        .settings-container {
          max-width: 800px;
          margin: 20px auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        
        .settings-header {
          padding: 20px;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .back-button {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }
        
        .settings-title {
          font-size: 20px;
          font-weight: 600;
        }
        
        .settings-menu {
          list-style: none;
        }
        
        .settings-item {
          padding: 18px 20px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .settings-item:hover {
          background-color: var(--secondary);
        }
        
        .item-content {
          display: flex;
          align-items: center;
          gap: 15px;
          flex: 1;
        }
        
        .item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .item-text {
          flex: 1;
        }
        
        .item-text h3 {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 3px;
        }
        
        .item-text p {
          font-size: 13px;
          color: var(--light-text);
        }
        
        .item-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .divider {
          padding: 10px 20px;
          font-size: 13px;
          font-weight: 500;
          color: var(--light-text);
          text-transform: uppercase;
          background-color: var(--secondary);
        }
        
        .logout-item {
          color: var(--danger);
        }
        
        .logout-item .item-icon {
          color: var(--danger);
        }
        
        /* Modal Styles */
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.5);
          z-index: 100;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .modal-content {
          background: white;
          width: 90%;
          max-width: 400px;
          border-radius: 12px;
          overflow: hidden;
          animation: modalFadeIn 0.3s;
        }
        
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .modal-header {
          padding: 15px 20px;
          border-bottom: 1px solid var(--border);
          font-weight: 600;
        }
        
        .modal-body {
          padding: 20px;
        }
        
        .modal-footer {
          padding: 15px 20px;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        
        .btn {
          padding: 8px 16px;
          border-radius: 6px;
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .btn-primary {
          background-color: var(--primary);
          color: white;
        }
        
        .btn-outline {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text);
        }
        
        .btn-danger {
          background-color: var(--danger);
          color: white;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-group label {
          display: flex;
          align-items: center;
          margin-bottom: 5px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }
        
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 24px;
          width: 50px;
          height: 24px;
        }
        
        .slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        
        input:checked + .slider {
          background-color: var(--primary);
        }
        
        input:checked + .slider:before {
          transform: translateX(26px);
        }
        
        @media (max-width: 480px) {
          .settings-item {
            padding: 15px;
          }
          
          .item-text h3 {
            font-size: 15px;
          }
        }
      `}</style>
    </>
  );
}