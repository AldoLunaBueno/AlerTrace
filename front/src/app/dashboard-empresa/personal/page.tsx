'use client'

import { useState } from 'react'
import { Plus, User, Mail, Phone, MapPin, Thermometer, Droplets, Leaf, Cloud, Settings, Edit, Trash2, CreditCard, Lock, X } from 'lucide-react'

interface PersonalUser {
  id: string
  name: string
  dni: string
  email: string
  phone: string
  role: 'admin' | 'supervisor' | 'operador' | 'tecnico'
  department: string
  assignedSensors: string[]
  status: 'active' | 'inactive'
  avatar?: string
  lastActive: string
}

interface Sensor {
  id: string
  name: string
  type: 'temperature' | 'humidity' | 'soil' | 'weather'
  location: string
  status: 'online' | 'offline' | 'maintenance'
}

// Datos de prueba
const mockUsers: PersonalUser[] = [
  {
    id: '1',
    name: 'María González',
    dni: '12345678',
    email: 'maria.gonzalez@sachatrace.com',
    phone: '+51 987 654 321',
    role: 'admin',
    department: 'Administración',
    assignedSensors: ['sensor-001', 'sensor-002', 'sensor-003'],
    status: 'active',
    lastActive: '2024-01-15'
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    dni: '23456789',
    email: 'carlos.rodriguez@sachatrace.com',
    phone: '+51 987 654 322',
    role: 'supervisor',
    department: 'Producción',
    assignedSensors: ['sensor-004', 'sensor-005'],
    status: 'active',
    lastActive: '2024-01-14'
  },
  {
    id: '3',
    name: 'Ana Martínez',
    dni: '34567890',
    email: 'ana.martinez@sachatrace.com',
    phone: '+51 987 654 323',
    role: 'operador',
    department: 'Calidad',
    assignedSensors: ['sensor-006'],
    status: 'active',
    lastActive: '2024-01-13'
  },
  {
    id: '4',
    name: 'Luis Fernández',
    dni: '45678901',
    email: 'luis.fernandez@sachatrace.com',
    phone: '+51 987 654 324',
    role: 'tecnico',
    department: 'Mantenimiento',
    assignedSensors: ['sensor-007', 'sensor-008'],
    status: 'inactive',
    lastActive: '2024-01-10'
  },
  {
    id: '5',
    name: 'Sofia Herrera',
    dni: '56789012',
    email: 'sofia.herrera@sachatrace.com',
    phone: '+51 987 654 325',
    role: 'operador',
    department: 'Producción',
    assignedSensors: ['sensor-009'],
    status: 'active',
    lastActive: '2024-01-12'
  }
]

const mockSensors: Sensor[] = [
  { id: 'sensor-001', name: 'Sensor Temp Norte', type: 'temperature', location: 'Campo Norte', status: 'online' },
  { id: 'sensor-002', name: 'Sensor Humedad Sur', type: 'humidity', location: 'Campo Sur', status: 'online' },
  { id: 'sensor-003', name: 'Sensor Suelo Este', type: 'soil', location: 'Campo Este', status: 'offline' },
  { id: 'sensor-004', name: 'Estación Meteorológica', type: 'weather', location: 'Centro', status: 'maintenance' },
  { id: 'sensor-005', name: 'Sensor Temp Oeste', type: 'temperature', location: 'Campo Oeste', status: 'online' },
  { id: 'sensor-006', name: 'Sensor Humedad Centro', type: 'humidity', location: 'Campo Centro', status: 'online' },
  { id: 'sensor-007', name: 'Sensor Suelo Norte', type: 'soil', location: 'Campo Norte', status: 'offline' },
  { id: 'sensor-008', name: 'Sensor Clima Sur', type: 'weather', location: 'Campo Sur', status: 'online' },
  { id: 'sensor-009', name: 'Sensor Temp Este', type: 'temperature', location: 'Campo Este', status: 'online' }
]

export default function PersonalEmpresaPage() {
  const [users, setUsers] = useState<PersonalUser[]>(mockUsers)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<PersonalUser | null>(null)
  const [formData, setFormData] = useState({
    dni: '',
    password: '',
    confirmPassword: '',
    assignedSensors: [] as string[]
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'temperature': return <Thermometer className="w-4 h-4" />
      case 'humidity': return <Droplets className="w-4 h-4" />
      case 'soil': return <Leaf className="w-4 h-4" />
      case 'weather': return <Cloud className="w-4 h-4" />
      default: return <Settings className="w-4 h-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'supervisor': return 'bg-blue-100 text-blue-800'
      case 'operador': return 'bg-green-100 text-green-800'
      case 'tecnico': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getUserSensors = (userSensors: string[]) => {
    return mockSensors.filter(sensor => userSensors.includes(sensor.id))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.dni.trim()) {
      newErrors.dni = 'El DNI es requerido'
    } else if (!/^\d{8}$/.test(formData.dni)) {
      newErrors.dni = 'El DNI debe tener 8 dígitos'
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      const newUser: PersonalUser = {
        id: Date.now().toString(),
        name: `Usuario ${formData.dni}`,
        dni: formData.dni,
        email: `usuario${formData.dni}@sachatrace.com`,
        phone: '+51 000 000 000',
        role: 'operador', // Rol por defecto trabajador
        department: 'Producción',
        assignedSensors: formData.assignedSensors,
        status: 'active',
        lastActive: new Date().toISOString().split('T')[0]
      }
      
      setUsers([...users, newUser])
      setShowAddModal(false)
      setFormData({
        dni: '',
        password: '',
        confirmPassword: '',
        assignedSensors: []
      })
      setErrors({})
    }
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
    setFormData({
      dni: '',
      password: '',
      confirmPassword: '',
      assignedSensors: []
    })
    setErrors({})
  }

  const handleSensorToggle = (sensorId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedSensors: prev.assignedSensors.includes(sensorId)
        ? prev.assignedSensors.filter(id => id !== sensorId)
        : [...prev.assignedSensors, sensorId]
    }))
  }

  const handleDeleteClick = (user: PersonalUser) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter(user => user.id !== userToDelete.id))
      setShowDeleteModal(false)
      setUserToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setUserToDelete(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Gestión de Personal</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Administra usuarios, roles y permisos del sistema
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">
              {users.filter(u => u.status === 'active').length} de {users.length} usuarios activos
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Personal
            </button>
          </div>
        </div>
      </div>

      {/* Personal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => {
          const userSensors = getUserSensors(user.assignedSensors)
          
          return (
            <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.department}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(user)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <CreditCard className="w-4 h-4 mr-2" />
                  <span className="font-medium">DNI: {user.dni}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rol:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estado:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </div>
              </div>

              {/* Assigned Sensors */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Sensores Asignados:</span>
                  <span className="text-sm text-gray-500">{user.assignedSensors.length}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {userSensors.map((sensor) => (
                    <div
                      key={sensor.id}
                      className="flex items-center px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700"
                      title={`${sensor.name} - ${sensor.location}`}
                    >
                      {getSensorIcon(sensor.type)}
                      <span className="ml-1 truncate max-w-20">{sensor.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Personal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Agregar Nuevo Personal
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campos Principales */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      DNI
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={formData.dni}
                        onChange={(e) => setFormData(prev => ({ ...prev, dni: e.target.value }))}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          errors.dni ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="12345678"
                        maxLength={8}
                      />
                    </div>
                    {errors.dni && <p className="mt-1 text-sm text-red-600">{errors.dni}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Repite la contraseña"
                    />
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Selección de Sensores */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Asignar Sensores</h4>
                <p className="text-sm text-gray-600">
                  Selecciona los sensores que este trabajador podrá gestionar
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {mockSensors.map((sensor) => {
                    const isSelected = formData.assignedSensors.includes(sensor.id)
                    return (
                      <button
                        key={sensor.id}
                        type="button"
                        onClick={() => handleSensorToggle(sensor.id)}
                        className={`flex flex-col items-center p-4 border-2 rounded-lg transition-all ${
                          isSelected
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                        title={`${sensor.name} - ${sensor.location}`}
                      >
                        <div className={`w-8 h-8 flex items-center justify-center rounded-lg mb-2 ${
                          isSelected ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {getSensorIcon(sensor.type)}
                        </div>
                        <span className="text-xs font-medium text-center leading-tight">
                          {sensor.name}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          {sensor.location}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {formData.assignedSensors.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      <strong>{formData.assignedSensors.length}</strong> sensor(es) seleccionado(s)
                    </p>
                  </div>
                )}
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Crear Trabajador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmar Eliminación
                </h3>
                <p className="text-sm text-gray-600">
                  Esta acción no se puede deshacer
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                ¿Estás seguro de que deseas eliminar a este trabajador?
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                    {userToDelete.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{userToDelete.name}</h4>
                    <p className="text-sm text-gray-600">DNI: {userToDelete.dni}</p>
                    <p className="text-sm text-gray-600">{userToDelete.department}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Eliminar Trabajador
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
