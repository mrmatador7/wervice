export default function Newsletter() {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h2>
      <p className="text-gray-600 mb-6">Get the latest wedding tips and vendor recommendations delivered to your inbox.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-400 focus:border-transparent"
        />
        <button className="px-6 py-2 bg-lime-400 text-black font-semibold rounded-lg hover:bg-lime-300 transition-colors">
          Subscribe
        </button>
      </div>
    </div>
  );
}
