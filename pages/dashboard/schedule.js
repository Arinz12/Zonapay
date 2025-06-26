import { useState, useEffect } from 'react';
import styles from './BillSchedule.module.css';

export default function BillSchedule() {
  const [formData, setFormData] = useState({
    billtype: '',
    customer: '',
    time: '',
    amt: '',
    itemcode: '',
    repeat: 'off',
    cableProvider: '',
    electType: 'prepaid',
    selectedBillcode: ''
  });

  const [billItems, setBillItems] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [network, setNetwork] = useState(null);
  const [isFetchingItems, setIsFetchingItems] = useState(false);
  const [electricityBillCodes, setElectricityBillCodes] = useState([]);

  // Cable TV providers with their billcodes
  const cableProviders = [
    { name: 'GOtv', value: 'BIL122' },
    { name: 'DStv', value: 'BIL121' },
    { name: 'Startimes', value: 'BIL123' }
  ];

  // Electricity types
  const electTypes = [
    { name: 'Prepaid', value: 'prepaid' },
    { name: 'Postpaid', value: 'postpaid' }
  ];

  // Network detection
  useEffect(() => {
    if (formData.billtype === 'airtime' || formData.billtype === 'data') {
      const number = formData.customer;
      if (/^0803|^0806|^0813|^0816|^0810|^0814|^0903|^0906|^0703|^0706|^0805|^0807|^0815|^0811|^0705|^0701/.test(number)) {
        setNetwork('mtn');
      } else if (/^0802|^0808|^0812|^0708|^0902|^0907|^0909/.test(number)) {
        setNetwork('airtel');
      } else if (/^0805|^0807|^0811|^0815|^0705|^0905/.test(number)) {
        setNetwork('glo');
      } else if (/^0809|^0817|^0818|^0908|^0909/.test(number)) {
        setNetwork('9mobile');
      } else {
        setNetwork(null);
      }
    } else {
      setNetwork(null);
    }
  }, [formData.customer, formData.billtype]);

  // Fetch items based on billtype
  useEffect(() => {
    const fetchItems = async () => {
      if (!formData.billtype) return;

      setIsFetchingItems(true);
      try {
        if (formData.billtype === 'data' && network) {
          const billcode = {
            mtn: '108',
            airtel: '110',
            glo: '109',
            '9mobile': '111'
          }[network];

          const response = await fetch('https://www.billsly.co/zonapay/fdp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bille: billcode })
          });
          const result = await response.json();
          setBillItems(result.data);
        }
        else if (formData.billtype === 'cabletv' && formData.cableProvider) {
          const response = await fetch('https://www.billsly.co/zonapay/ftp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bille: formData.cableProvider })
          });
          const result = await response.json();
          setBillItems(result.data);
        }
        else if (formData.billtype === 'elect') {
          const response = await fetch('https://www.billsly.co/zonapay/elects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          const result = await response.json();
          setElectricityBillCodes([...new Set(result.data.map(item => item.biller_code))]);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setIsFetchingItems(false);
      }
    };

    fetchItems();
  }, [network, formData.billtype, formData.cableProvider]);

  // Fetch electricity plans when billcode is selected
  const fetchElectricityPlans = async (billcode) => {
    setIsFetchingItems(true);
    try {
      const response = await fetch('https://www.billsly.co/zonapay/fdp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bille: billcode })
      });
      const result = await response.json();
      setBillItems(result.data);
    } catch (error) {
      console.error('Error fetching electricity plans:', error);
    } finally {
      setIsFetchingItems(false);
    }
  };

  // Form validation
  useEffect(() => {
    const { billtype, customer, time, amt, itemcode, cableProvider } = formData;
    let valid = billtype && customer && time && amt;
    
    if (billtype === 'data') valid = valid && network && itemcode;
    if (billtype === 'cabletv') valid = valid && cableProvider && itemcode;
    if (billtype === 'elect') valid = valid && itemcode && formData.selectedBillcode;
    
    setIsValid(valid);
  }, [formData, network]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare final submission data
    const submissionData = {
      billtype: formData.billtype,
      customer: formData.customer,
      time: formData.time,
      amt: formData.amt,
      itemcode: formData.itemcode,
      repeat: formData.repeat,
      id: Math.random().toString(36).substring(2, 15),
      nid: network || formData.billtype,
      billcode: formData.billtype === 'data' ? 
        { mtn: '108', airtel: '110', glo: '109', '9mobile': '111' }[network] :
        formData.billtype === 'cabletv' ? formData.cableProvider :
        formData.selectedBillcode
    };

    // Log all values being sent to server
    console.log('Submitting data:', Object.entries(submissionData).map(([name, value]) => ({ name, value }));

    // Submit to server
    setIsLoading(true);
    fetch('/submitdetails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submissionData)
    })
    .then(response => {
      if (!response.ok) throw new Error('Submission failed');
      alert('Bill scheduled successfully!');
      // Reset form
      setFormData({
        billtype: '',
        customer: '',
        time: '',
        amt: '',
        itemcode: '',
        repeat: 'off',
        cableProvider: '',
        electType: 'prepaid',
        selectedBillcode: ''
      });
      setNetwork(null);
      setBillItems([]);
      setElectricityBillCodes([]);
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to schedule bill');
    })
    .finally(() => setIsLoading(false));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bill Scheduling</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Bill Type Selection */}
        <div className={styles.formGroup}>
          <label htmlFor="billtype">Bill Type:</label>
          <select
            id="billtype"
            name="billtype"
            value={formData.billtype}
            onChange={handleChange}
            required
          >
            <option value="">Select bill type</option>
            <option value="airtime">Airtime</option>
            <option value="data">Data</option>
            <option value="cabletv">Cable TV</option>
            <option value="elect">Electricity</option>
          </select>
        </div>

        {/* Customer Input */}
        <div className={styles.formGroup}>
          <label htmlFor="customer">
            {formData.billtype === 'airtime' || formData.billtype === 'data' ? 'Phone Number' : 'Customer ID'}:
          </label>
          <input
            type="text"
            id="customer"
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            required
          />
          {network && <span className={styles.networkBadge}>{network.toUpperCase()}</span>}
        </div>

        {/* Cable Provider Selection */}
        {formData.billtype === 'cabletv' && (
          <div className={styles.formGroup}>
            <label htmlFor="cableProvider">Cable Provider:</label>
            <select
              id="cableProvider"
              name="cableProvider"
              value={formData.cableProvider}
              onChange={handleChange}
              required
            >
              <option value="">Select provider</option>
              {cableProviders.map(provider => (
                <option key={provider.value} value={provider.value}>{provider.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Electricity Type Selection */}
        {formData.billtype === 'elect' && (
          <>
            <div className={styles.formGroup}>
              <label>Electricity Type:</label>
              <div className={styles.radioGroup}>
                {electTypes.map(type => (
                  <label key={type.value}>
                    <input
                      type="radio"
                      name="electType"
                      value={type.value}
                      checked={formData.electType === type.value}
                      onChange={handleChange}
                    />
                    {type.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Electricity Billcode Selection */}
            {electricityBillCodes.length > 0 && (
              <div className={styles.formGroup}>
                <label>Electricity Provider:</label>
                <select
                  value={formData.selectedBillcode}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, selectedBillcode: e.target.value }));
                    fetchElectricityPlans(e.target.value);
                  }}
                  required
                >
                  <option value="">Select provider</option>
                  {electricityBillCodes.map(billcode => (
                    <option key={billcode} value={billcode}>{billcode}</option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}

        {/* Time Selection */}
        <div className={styles.formGroup}>
          <label htmlFor="time">Time:</label>
          <input
            type="datetime-local"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        {/* Amount Input */}
        <div className={styles.formGroup}>
          <label htmlFor="amt">Amount:</label>
          <input
            type="number"
            id="amt"
            name="amt"
            value={formData.amt}
            onChange={handleChange}
            required
            min="0"
            readOnly={billItems.length > 0}
          />
        </div>

        {/* Item Selection (Data/Cable/Electricity) */}
        {isFetchingItems ? (
          <div className={styles.loading}>Loading options...</div>
        ) : billItems.length > 0 && (
          <div className={styles.formGroup}>
            <label htmlFor="itemcode">
              {formData.billtype === 'data' ? 'Data Plan' :
               formData.billtype === 'cabletv' ? 'Cable Package' : 'Electricity Plan'}:
            </label>
            <select
              id="itemcode"
              name="itemcode"
              value={formData.itemcode}
              onChange={(e) => {
                const selectedItem = billItems.find(item => item.item_code === e.target.value);
                setFormData(prev => ({
                  ...prev,
                  itemcode: e.target.value,
                  amt: selectedItem?.amount?.toString() || ''
                }));
              }}
              required
            >
              <option value="">Select plan</option>
              {billItems.map(item => (
                <option key={item.item_code} value={item.item_code}>
                  {item.name} - ₦{item.amount}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Schedule Options */}
        <div className={styles.formGroup}>
          <label>Schedule:</label>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="repeat"
                value="off"
                checked={formData.repeat === 'off'}
                onChange={handleChange}
              />
              Once
            </label>
            <label>
              <input
                type="radio"
                name="repeat"
                value="on"
                checked={formData.repeat === 'on'}
                onChange={handleChange}
              />
              Repeat
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={!isValid || isLoading || isFetchingItems}
        >
          {isLoading ? 'Scheduling...' : 'Schedule Bill'}
        </button>
      </form>
    </div>
  );
}