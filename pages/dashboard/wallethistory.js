require("dotenv").config()
import { Flid } from "../../Svr_fns/FlutterwaveIds"
import { useState } from 'react';
import Head from 'next/head';
import { 
  FiCheckCircle, 
  FiXCircle, 
  FiClock,
  FiUser,
  FiDollarSign,
  FiCalendar
} from 'react-icons/fi';
import { format } from 'date-fns';
import Footer from "../../components/Footer";
import { useRouter } from 'next/router';
const Wallethistory = ({ arr }) => {
  const router = useRouter()

  // Sort transactions by date (newest first)
  const sortedTransactions = [...arr].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  // Group by month-year
  const groupedTransactions = sortedTransactions.reduce((acc, transaction) => {
    const monthYear = format(new Date(transaction.date), 'MMMM yyyy');
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(transaction);
    return acc;
  }, {});

  return (<>
  <Head>
    <title>Wallet history</title>
  </Head>
    <div className="max-w-3xl mx-auto p-4">
<div className="flex items-center justify-between mb-6">
  <div className="flex items-center space-x-4">
    <button 
      onClick={() => router.back()}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      aria-label="Go back"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5 text-gray-600" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M10 19l-7-7m0 0l7-7m-7 7h18" 
        />
      </svg>
    </button>
    <h2 className="text-2xl font-bold text-gray-800">Wallet Fund History</h2>
  </div>
  {/* Optional: Add additional header actions here */}
</div>      
      {Object.entries(groupedTransactions).map(([monthYear, transactions]) => (
        <div key={monthYear} className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 sticky top-0 bg-white py-2 z-10">
            {monthYear}
          </h3>
          
          <div className="space-y-3">
            {transactions.map((txn, index) => (
              <div 
                key={index}
                className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      txn.status === 'success' ? 'bg-green-100 text-green-600' : 
                      txn.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 
                      'bg-red-100 text-red-600'
                    }`}>
                      {txn.status === 'success' ? <FiCheckCircle size={20} /> :
                       txn.status === 'pending' ? <FiClock size={20} /> : 
                       <FiXCircle size={20} />}
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-900">
                        {txn.funder || 'Unknown funder'}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <FiCalendar className="mr-1" size={14} />
                        {format(new Date(txn.date), 'MMM dd, yyyy - hh:mm a')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-semibold w-20 ${
                      txn.amount >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {txn.amount >= 0 ? '+' : ''}
                      {txn.amount.toLocaleString('en-NG', {
                        style: 'currency',
                        currency: 'NGN'
                      })}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">
                      {txn.status}
                    </p>
                  </div>
                </div>
                
                {txn.note && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">{txn.note}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {arr.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No transactions found</p>
        </div>
      )}
    </div>
    </>
  );
};

export default Wallethistory;
export async function getServerSideProps(context){

    try{
        const Flutterwave = require('flutterwave-node-v3');
        const flw = new Flutterwave(
            process.env.FLW_PUBLIC_KEY, 
            process.env.FLW_SECRET_KEY
        );

        if(!context.req.isAuthenticated()){
return {
    redirect:{
        destination:"/login",
        permanent:false
    }
}
}
const profile= await Flid.findOne({Customer:context.req.user.Email});
if(!profile){
  return {
    props:{arr}
}
}
const obj=profile.Ids;
let arr=[];
for(const item of obj){
    const detail=await flw.Transaction.verify({id:item})
    arr.push({status:detail.status,amount:detail.data.amount,date:new Date(detail.data.created_at),funder:detail.data.meta.originatorname});
}

return {
    props:{arr}
}
    }
    catch(e){
        console.log("Wallet history failed to load",e)
        return {
            props:{arr:[]}
        }
    }
}