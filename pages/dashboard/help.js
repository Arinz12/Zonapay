// pages/help.js
import Head from 'next/head';
import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Contact Help - Our Service</title>
        <meta name="description" content="Contact our support team" />
      </Head>

      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Need Help?</h1>
          <p className="text-lg text-gray-600">Our support team is here to assist you</p>
        </div>

        <div className="bg-white shadow rounded-lg p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Phone Support</h2>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-blue-500 mr-3" />
                  <span className="text-gray-700">Main Support: <a href="tel:+2348166041953" className="text-blue-600 hover:underline">+234 (701)8237160</a></span>
                </li>
               
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Email Support</h2>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <MailIcon className="h-5 w-5 text-blue-500 mr-3" />
                  <span className="text-gray-700">General Inquiries: <a href="mailto:support@example.com" className="text-blue-600 hover:underline">support@billsly.co</a></span>
                </li>
                
              </ul>
            </div>

            <div className="pt-4">
              <Link href="/">
                <a className="text-blue-600 hover:underline flex items-center">
                  <ArrowLeftIcon className="h-4 w-4 mr-1" />
                  Back to Home
                </a>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Simple icons (or install @heroicons/react)
const PhoneIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MailIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ArrowLeftIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);