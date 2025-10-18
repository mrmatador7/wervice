export default function FilterPanel() {
  return (
    <div className="rounded-2xl bg-white shadow-sm p-4 md:p-5 space-y-5">
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase">Search vendors</p>
        <input
          type="text"
          placeholder="Business name or keyword"
          className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-500 uppercase">City</p>
        <select className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm">
          <option>All Cities</option>
          <option>Marrakech</option>
          <option>Casablanca</option>
          <option>Rabat</option>
          <option>Tangier</option>
        </select>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-500 uppercase">Price Range (MAD)</p>
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Min" className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm" />
          <input placeholder="Max" className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-500 uppercase">Minimum rating</p>
        <select className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm">
          <option>Any rating</option>
          <option>4.0+</option>
          <option>4.5+</option>
        </select>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-500 uppercase">Category</p>
        <select className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm">
          <option>All categories</option>
          <option>Venues</option>
          <option>Catering</option>
          <option>Photo & Video</option>
          <option>Event Planner</option>
          <option>Music</option>
          <option>Beauty</option>
          <option>Decor</option>
          <option>Dresses</option>
        </select>
      </div>
    </div>
  );
}
