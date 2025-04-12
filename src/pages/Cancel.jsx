function Cancel() {
    return (
        <div className="absolute inset-0 bg-gray-50 pt-20">
        <div className="w-full max-w-4xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment Canceled!</h1>
            <p className="mt-2">Payment was canceled feel free to try again.</p>
          </div>
        </div>
      </div>
    );
  }
  export default Cancel;
  