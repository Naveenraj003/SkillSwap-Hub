export default function Register() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-6">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>
        <p className="text-gray-500 text-center mb-6">Create your SkillSwap account</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600" />
          </div>
          <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm">
            Sign Up
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  )
}
