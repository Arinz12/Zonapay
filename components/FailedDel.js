import { ExclamationTriangleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import router from "next/router"
export function FailedDeleteComponent({ billId, errorMessage }) {
  return (
    <div className="rounded-md bg-red-50 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Failed to delete schedule</h3>
          <div className="mt-2 text-sm text-red-700">
            <p className="flex items-center">
              <ExclamationTriangleIcon className="mr-1 h-4 w-4" />
              Could not delete bill
            </p>
            {errorMessage && (
              <p className="mt-1 pl-5 font-mono text-xs">{errorMessage}</p>
            )}
          </div>
          { <div className="mt-4">
            <div className="-mx-2 -my-1.5 flex space-x-2">
              <button
              onClick={()=>{
router.push("https://www.billsly.co/dashboard")
              }}
                type="button"
                className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
              >
                Home
                              </button>
              <button
              onClick={()=>{hide()}}
                type="button"
                className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
              >
                Try again
              </button>
            </div>
          </div> }
        </div>
      </div>
    </div>
  );
}