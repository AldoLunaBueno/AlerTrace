'use client'

export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          🎉 ¡Login Exitoso!
        </h1>
        <p className="text-gray-600">
          El sistema de autenticación funciona correctamente.
        </p>
        <div className="mt-6">
          <button 
            onClick={() => {
              localStorage.clear()
              window.location.href = '/login'
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Volver al Login
          </button>
        </div>
      </div>
    </div>
  )
}