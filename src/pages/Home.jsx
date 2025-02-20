function Home() {
  const categories = ['Textbooks', 'Electronics', 'Furniture', 'Clothing', 'School Supplies', 'Dorm Essentials', 
    'Sports Equipment', 'Musical Instruments', 'Art Supplies', 'Lab Equipment'];

  return (
    <div className="flex bg-white w-full min-w-[1200px]">
      {/* Sidebar */}
      <div className="w-64 fixed left-0 h-[calc(100vh-64px)] bg-gray-50" style={{ top: '84px' }}>
        <div className="h-full overflow-y-auto">
          {/* Search Bar */}
          <div className="p-4 pt-8">
            <input
              type="text"
              placeholder="Search for items..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-yellow-500"
            />
          </div>

          {/* Categories */}
          <div className="p-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Categories
            </h2>
            <div className="flex flex-col gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className="text-left px-4 py-2 rounded-lg hover:bg-yellow-500 hover:text-white transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-6 pt-24 min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 pt-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-[4/3] relative">
                <img
                  src={`https://picsum.photos/seed/${item}/800/600`}
                  alt="Product"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">Sample Product {item}</h3>
                <p className="text-gray-600 text-sm mb-2">Brief description here</p>
                <p className="text-yellow-600 font-bold">${(Math.random() * 100).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home 