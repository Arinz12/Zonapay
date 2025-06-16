import "@fontsource/roboto";
import { Paper } from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import Footer from '../../components/Footer';

const History = ({ userhistory }) => {
  const [filter, setFilter] = useState("All");
  const [groupedHistory, setGroupedHistory] = useState({});

  useEffect(() => {
    // if(document.getElementById("hiscon")){
    // document.getElementById("hiscon").lastChild.style.marginBottom = "100px";}
    groupAndFilterHistory();
  }, [userhistory, filter]);

  const categorizeBill = (item) => {
    const product = item.Product?.toLowerCase() || '';
    const network = item.network?.toLowerCase() || '';

    if (/airtime|mtn|airtel|glo|9mobile/.test(product) || /airtime|mtn|airtel|glo|9mobile/.test(network)) {
      return "Airtime";
    } else if (/electricity/.test(product) || /electricity/.test(network)) {
      return "Electricity";
    } else if (/gotv|dstv|startimes|cabletv/.test(product) || /gotv|dstv|startimes|cabletv/.test(network)) {
      return "Cable TV";
    } else if (/data|mb|gb|tb|bundle/.test(product)) {
      return "Data";
    }
    return "Other";
  };

  const groupAndFilterHistory = () => {
    const filtered = userhistory.dataa.filter(item => {
      if (filter === "All") return true;
      return categorizeBill(item) === filter;
    });

    const grouped = filtered.reduce((acc, item) => {
      const date = new Date(item.Time);
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      const monthYear = `${month} ${year}`; // Format: "June 2025"
      
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(item);
      return acc;
    }, {});

    setGroupedHistory(grouped);
  };

  const getFilterButtonClass = (filterName) => 
    `px-3 py-1 rounded-full text-sm ${filter === filterName ? 'bg-blue-500 focus:bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`;

  return (
    <div className="relative min-h-screen">
      <Head>
        <title>History</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
        <link href="https://fonts.googleapis.com/css2?family=Monomaniac+One&display=swap" rel="stylesheet"></link>
      </Head>
      
      <div style={{fontSize:"30px"}} className="sticky top-0 mt-0 py-7 w-full mx-auto border-b-2 text-center bg-white text-blue-500 rounded-b-2xl rubik-h px-4">
        History
      </div>

      {/* Filter Controls */}
      <div className="sticky top-20 z-10 bg-white py-3 px-4 border-b flex overflow-x-auto gap-2">
        <button onClick={() => setFilter("All")} className={getFilterButtonClass("All")}>All</button>
        <button onClick={() => setFilter("Airtime")} className={getFilterButtonClass("Airtime")}>Airtime</button>
        <button onClick={() => setFilter("Data")} className={getFilterButtonClass("Data")}>Data</button>
        <button onClick={() => setFilter("Cable TV")} className={getFilterButtonClass("Cable TV")}>Cable TV</button>
        <button onClick={() => setFilter("Electricity")} className={getFilterButtonClass("Electricity")}>Electricity</button>
      </div>

      {(userhistory.dataa.length !== 0) ? 
        <div id='hiscon' className="p-6  bg-white w-full gap-1 mx-auto rubik-b">
          {Object.entries(groupedHistory).map(([monthYear, items]) => (
            <div key={monthYear} className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 sticky top-32 bg-white py-2 z-10">
                {monthYear} {/* This will show "June 2025" format */}
              </h3>
              {items.map((a, index) => (
                <div key={index} style={{backgroundColor:"whitesmoke"}} className="rubik-b flex justify-between rounded items-start p-3 border-b mx-auto w-full font-sans">
                  <div className="text-left">
                    <div className="font-medium text-gray-900">{a.Product?.slice(0,30)}</div>
                    <div className="text-xs text-gray-500 mt-1">{a.Time}</div>
                    <div className="text-xs text-gray-500 mt-1">{a.Phoneno}</div>
                  </div>
                  <div className="text-right"> 
                    <div className="font-medium text-gray-900">{a.Amount}</div>
                    <div className={`text-xs px-2 py-0.5 rounded-full ${(a.Status=="failed") ? "bg-red-100" : "bg-green-100"}  
                      ${(a.Status=="failed") ? "text-red-600" : "text-green-800"} inline-block mt-1`}>
                      {a.Status || "success"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        : <div className="p-6 max-w-3xl mx-auto text-center w-full monomaniac-one-regular">
            There is no history at the moment
          </div>
      }
      <div className="sticky bottom-0"><Footer/></div>
    </div>
  );
};

// Keep your existing getServerSideProps
export async function getServerSideProps(context) {
  try {
    if(!context.req.isAuthenticated()) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        }
      }
    }
    
    try {
      const data = await fetch("https://www.billsly.co/api/history", {method: "post"});
      if(data.ok) {
        const data1 = await data.json();
        const data2a = data1.data.sort((a, b) => new Date(b.Time) - new Date(a.Time));
        const data2 = data2a.filter(a => a.User === context.req.user.Email);
        return {
          props: {userhistory: {dataa: data2}}
        }
      } else {
        return {
          props: {userhistory: {dataa: []}}
        }
      }   
    } catch(e) {
      context.res.send("An error occured");
      return {
        props: {}
      }
    }
  } catch(error) {
    return {
      redirect: {
        destination: 'billsly.co/offline.html',
        permanent: false,
      }
    }
  } finally {
    console.log("/dashboard has been resolved");
  }
}

export default History;