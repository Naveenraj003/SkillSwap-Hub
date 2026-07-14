export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-gray-50">
      <h1 className="text-5xl font-bold text-gray-800 mb-2">404</h1>
      <p className="text-lg text-gray-600 mb-4">Page not found</p>
      <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Go Home
      </a>
    </div>
  )
}
