import { TrashIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
export function SuccessDeleteComponent({ hide }) {
  return (
    <div className="rounded-md bg-blue-50 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800">Schedule successfully deleted</h3>
          <div className="mt-2 text-sm text-blue-700">
            <div className="flex items-center">
              <TrashIcon className="mr-1 h-4 w-4" />
              <p>Bill has been removed from scheduled payments</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="-mx-2 -my-1.5 flex">
              <button
              onClick={()=>{hide}}
                type="button"
                className="rounded-md bg-blue-50 px-2 py-1.5 text-sm font-medium text-blue-800 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-blue-50"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}