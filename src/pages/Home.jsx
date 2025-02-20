function Home() {
  const categories = ['Textbooks', 'Electronics', 'Furniture', 'Clothing', 'School Supplies', 'Dorm Essentials', 
    'Sports Equipment', 'Musical Instruments', 'Art Supplies', 'Lab Equipment'];

  return (
    <div className="flex pt-16"> {/* pt-16 adds padding to account for fixed navbar */}
      {/* Sidebar */}
      <div className="w-64 fixed h-[calc(100vh-64px)] bg-gray-50 p-4 overflow-y-auto">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search for items..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-yellow-500"
          />
        </div>

        {/* Categories */}
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
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

      {/* Main Content */}
      <div className="ml-64 flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-yellow-600">
          Featured Items
        </h1>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img
                src={`https://picsum.photos/seed/${item}/300/200`}
                alt="Product"
                className="w-full h-48 object-cover"
              />
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