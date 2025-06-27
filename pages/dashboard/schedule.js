import { useState, useEffect } from 'react';
import styles from '../../styles/schedule.module.css';

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

  const [dataPlans, setDataPlans] = useState([]);
  const [cablePlans, setCablePlans] = useState([]);
  const [electricityOptions, setElectricityOptions] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [network, setNetwork] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  // Cable TV providers
  const cableProviders = [
    { name: 'GOtv', value: 'BIL122' },
    { name: 'DStv', value: 'BIL121' },
    { name: 'Startimes', value: 'BIL123' }
  ];

  // Electricity types with direct itemcodes
  const electTypes = [
    { name: 'Prepaid', value: 'prepaid', itemcode: 'UB163' },
    { name: 'Postpaid', value: 'postpaid', itemcode: 'UB164' }
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

  // Fetch data plans when network is detected
  useEffect(() => {
    const fetchDataPlans = async () => {
      if (formData.billtype !== 'data' || !network) return;

      setIsFetching(true);
      try {
        const billcode = {
          mtn: 'BIL108',
          airtel: 'BIL110', 
          glo: 'BIL109',
          '9mobile': 'BIL111'
        }[network];

        const response = await fetch('https://www.billsly.co/zonapay/fdp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },

          body: JSON.stringify({ bille: billcode })
        });
        const result = await response.json();
        setDataPlans(result.data);
      } catch (error) {
        console.error('Error fetching data plans:', error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchDataPlans();
  }, [network, formData.billtype]);

  // Fetch cable plans when provider is selected
  useEffect(() => {
    const fetchCablePlans = async () => {
      if (formData.billtype !== 'cabletv' || !formData.cableProvider) return;

      setIsFetching(true);
      try {
        const response = await fetch('https://www.billsly.co/zonapay/ftp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bille: formData.cableProvider })
        });
        const result = await response.json();
        setCablePlans(result.data);
      } catch (error) {
        console.error('Error fetching cable plans:', error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchCablePlans();
  }, [formData.cableProvider, formData.billtype]);

  // Fetch electricity options when elect is selected
  useEffect(() => {
    const fetchElectricityOptions = async () => {
      if (formData.billtype !== 'elect') return;

      setIsFetching(true);
      try {
        const response = await fetch('https://www.billsly.co/zonapay/elects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const result = await response.json();
        
        // Map response to options with billcode and description
        const options = result.data.map(item => ({
          billcode: item.biller_code,
          description: item.description || item.biller_name || `Electricity (${item.biller_code})`
        }));
        
        setElectricityOptions(options);
      } catch (error) {
        console.error('Error fetching electricity options:', error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchElectricityOptions();
  }, [formData.billtype]);

  // Update itemcode when electType changes
  useEffect(() => {
    if (formData.billtype === 'elect') {
      const selectedType = electTypes.find(type => type.value === formData.electType);
      setFormData(prev => ({
        ...prev,
        itemcode: selectedType ? selectedType.itemcode : ''
      }));
    }
  }, [formData.electType, formData.billtype]);

  // Form validation
  useEffect(() => {
    const { billtype, customer, time, amt, itemcode, cableProvider, selectedBillcode } = formData;
    let valid = billtype && customer && time && amt;
    
    if (billtype === 'data') valid = valid && network && itemcode;
    if (billtype === 'cabletv') valid = valid && cableProvider && itemcode;
    if (billtype === 'elect') valid = valid && selectedBillcode && itemcode;
    
    setIsValid(valid);
  }, [formData, network]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submissionData = {
      billtype: formData.billtype,
      customer: formData.customer,
      time: formData.time,
      amt: formData.amt,
      itemcode: formData.itemcode,
      repeat: formData.repeat,
      id: Math.random().toString(36).substring(2, 15),
      nid: network || formData.billtype,
      billcode: formData.billtype === 'data' 
        ? { mtn: '108', airtel: '110', glo: '109', '9mobile': '111' }[network] 
        : formData.billtype === 'cabletv' 
          ? formData.cableProvider 
          : formData.selectedBillcode,
      electType: formData.electType
    };

    console.log('Submitting:', submissionData);

    setIsLoading(true);
    try {
      const response = await fetch('https://www.billsly.co/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

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
      setDataPlans([]);
      setCablePlans([]);
      setElectricityOptions([]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
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
                <option key={provider.value} value={provider.value}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Electricity Section */}
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
                    {type.name} ({type.itemcode})
                  </label>
                ))}
              </div>
            </div>

            {electricityOptions.length > 0 && (
              <div className={styles.formGroup}>
                <label>Electricity Provider:</label>
                <select
                  value={formData.selectedBillcode}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    selectedBillcode: e.target.value
                  }))}
                  required
                >
                  <option value="">Select provider</option>
                  {electricityOptions.map((option, index) => (
                    <option key={index} value={option.billcode}>
                      {option.description}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formData.itemcode && (
              <div className={styles.formGroup}>
                <label>Item Code:</label>
                <input
                  type="text"
                  value={formData.itemcode}
                  readOnly
                  className={styles.readOnlyInput}
                />
              </div>
            )}
          </>
        )}

        {/* Time Selection */}
        <div className={styles.formGroup}>
          <label htmlFor="time">Payment Time</label>
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
            readOnly={formData.billtype === 'data' || formData.billtype === 'cabletv'}
          />
        </div>
        {isFetching&&<div>loading options...</div>}

        {/* Data Plans Selection */}
        {formData.billtype === 'data' && dataPlans.length > 0 && (
          <div className={styles.formGroup}>
            <label htmlFor="itemcode">Data Plan:</label>
            <select
              id="itemcode"
              name="itemcode"
              value={formData.itemcode}
              onChange={(e) => {
                const selectedPlan = dataPlans.find(plan => plan.item_code === e.target.value);
                setFormData(prev => ({
                  ...prev,
                  itemcode: e.target.value,
                  amt: selectedPlan?.amount?.toString() || ''
                }));
              }}
              required
            >
              <option value="">Select data plan</option>
              {dataPlans.map(plan => (
                <option key={plan.item_code} value={plan.item_code}>
                  {plan.name} - ₦{plan.amount}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Cable Plans Selection */}
        {formData.billtype === 'cabletv' && cablePlans.length > 0 && (
          <div className={styles.formGroup}>
            <label htmlFor="itemcode">Cable Package:</label>
            <select
              id="itemcode"
              name="itemcode"
              value={formData.itemcode}
              onChange={(e) => {
                const selectedPlan = cablePlans.find(plan => plan.item_code === e.target.value);
                setFormData(prev => ({
                  ...prev,
                  itemcode: e.target.value,
                  amt: selectedPlan?.amount?.toString() || ''
                }));
              }}
              required
            >
              <option value="">Select cable package</option>
              {cablePlans.map(plan => (
                <option key={plan.item_code} value={plan.item_code}>
                  {plan.name} - ₦{plan.amount}
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
          disabled={!isValid || isLoading || isFetching}
        >
          {isLoading ? 'Scheduling...' : 'Schedule Bill'}
        </button>
      </form>
    </div>
  );
}
