export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-2">SkillSwap Hub</h1>
      <p className="text-lg text-gray-600 mb-6 max-w-md text-center">
        Exchange knowledge with skilled peers. Teach what you know, learn what you need, and grow together.
      </p>
      <div className="flex gap-4">
        <a href="/login" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm">
          Login
        </a>
        <a href="/register" className="px-6 py-2 bg-white hover:bg-gray-100 text-blue-600 border border-blue-600 font-medium rounded-md">
          Register
        </a>
      </div>
    </div>
  )
}
