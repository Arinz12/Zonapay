// pages/profile.tsx
import { useRouter } from 'next/router';
import { useState } from 'react';
import Head from 'next/head';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function ProfilePage({obj}) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function capitalizeFirstLetter(str) {
    if (!str) return str; // handle empty string
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  const handleLogout = async () => {
    setIsLoading(true);
    await fetch("https://www.billsly.co/zonapay/logout2",{method:"post"})
    console.log("user logged out from profile page")
    router.replace('/login');
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    // Add your account deletion logic here
    // Example API call:
    try {
      const response = await fetch('https://www.billsly.co/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        router.push('/signup');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Head>
        <title>Profile | Your App Name</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
          <div className="p-8">
            <div className="flex flex-col items-center">
            <AccountCircleIcon  sx={{height:"120px",width:"120px",color:"#2563EB"}}/> 
            <Link href="/dashboard">{<div className='w-full text-center'>Back to Dashboard</div>}</Link> 
             <div className="relative w-24 h-24 mb-6">
              </div>

              {/* User Info */}
              <div className="text-center mb-8 w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {capitalizeFirstLetter(obj.username)}
                </h2>
                <p className="text-gray-600 mb-6">{obj.email}</p>
                
                <div className="border-t border-gray-200 pt-6 w-full">
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="w-full mb-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-200"
                  >
                    {isLoading ? 'Logging out...' : 'Logout'}
                  </button>

                  {/* Delete Account Button */}
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    disabled={isLoading}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-4 rounded-lg transition duration-200"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Delete Account</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export async function getServerSideProps(context){
    try{
if(!context.req.isAuthenticated()){
return {
    redirect:{
        destination:"/login", permanent:false
    }
}
}else{
const ob= context.req.user;
const obj={email:ob.Email,username:ob.Username}
return{
    props:{obj}
}
}
    }catch(e){
console.log("Info page failed to load")
    }finally{
        console.log("/info page has been settled")
    }
}