import { Link, useNavigate } from 'react-router-dom'
import { Heart, Plus, User, Edit, Trash2, Calendar, LogOut, ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import AddFamilyMemberModal from '../components/AddFamilyMemberModal'
import EditFamilyMemberModal from '../components/EditFamilyMemberModal'
import PremiumLoader from '../components/PremiumLoader'

const Dashboard = () => {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [userName, setUserName] = useState('You')
  
  const [familyMembers, setFamilyMembers] = useState([])
  const [loading, setLoading] = useState(true)

  // Load user name and family members from API on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.name) setUserName(user.name)
    setLoading(true);
    fetchMembersAndSet().finally(() => setLoading(false));
  }, [])

  // Helper to refetch and set familyMembers
  const fetchMembersAndSet = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/family`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setFamilyMembers(
          data.members.map(m => ({
            id: m._id,
            name: m.name,
            relation: m.relation,
            lastActivity: new Date(m.lastActivity).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }),
            color: m.color || 'bg-pink-500',
            icon: <User className="w-6 h-6 text-white" />
          }))
        )
      }
    } catch {}
  }

  const handleAddMember = async (newMember) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/family`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newMember.name, relation: newMember.relation, color: newMember.color })
      })
      const data = await res.json()
      if (data.success) {
        // After add, _always_ refetch all members from server for consistency
        await fetchMembersAndSet()
        return true
      } else {
        alert('Failed to add family member: ' + (data.message || 'Error'))
        return false
      }
    } catch (e) {
      alert('Failed to add family member: ' + (e.message || e))
      return false
    }
  }

  const handleEditMember = (member) => {
    setEditingMember(member)
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async (updatedData) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/family/${editingMember.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: updatedData.name, relation: updatedData.relation, color: updatedData.color })
      })
      const data = await res.json()
      if (data.success) {
        setFamilyMembers(familyMembers.map(m => 
          m.id === editingMember.id ? { ...m, name: updatedData.name, relation: updatedData.relation, color: updatedData.color } : m
        ))
      }
    } catch (e) {
      console.error('Failed to update family member', e)
    }
    setIsEditModalOpen(false)
    setEditingMember(null)
  }

  const handleUpdateMember = (updatedMember) => {
    setFamilyMembers(familyMembers.map(member => 
      member.id === editingMember.id 
        ? { ...updatedMember, id: member.id, lastActivity: member.lastActivity, icon: <User className="w-6 h-6 text-white" /> }
        : member
    ))
    setEditingMember(null)
  }

  const handleDeleteMember = async (e, id) => {
    e.stopPropagation() // Prevent navigation
    if (!window.confirm('Are you sure you want to delete this family member?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/family/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (data.success) {
    setFamilyMembers(familyMembers.filter(member => member.id !== id))
      }
    } catch (e) {
      console.error('Failed to delete family member', e)
    }
  }

  const handleCardClick = (e, id) => {
    // Only navigate if clicking the card itself, not buttons
    if (e.target.closest('button')) return
    navigate(`/family/${id}`)
  }

  const handleOpenClick = (e, id) => {
    e.stopPropagation()
    navigate(`/family/${id}`)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  if (loading) return <PremiumLoader label="Loading family members..." />
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Orbs */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-40 right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-3000"></div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 py-4 bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo and Back Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGoBack}
                className="text-white/80 hover:text-pink-300 transition-colors font-medium flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">HealthMate</h1>
                <p className="text-sm text-white/80">Sehat ka Smart Dost</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white/80">3 of 8</span>
              <div className="w-16 h-2 bg-white/20 rounded-full">
                <div className="w-3/4 h-full bg-gradient-to-r from-pink-500 to-orange-500 rounded-full"></div>
              </div>
              <span className="text-sm text-white/80">92%</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>+ Add family member</span>
            </button>
              
              <button 
                onClick={handleLogout}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 backdrop-blur-sm hover:shadow-lg"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Instructions */}
            <div className="mb-8 text-center">
              <p className="text-white/80 text-lg">
                Tap a card to open that member's page. (We'll route this to /family/:id.)
              </p>
            </div>

            {/* Family Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {/* You Card */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 p-6 cursor-pointer group hover:bg-white/20 hover:scale-105">
                {/* Member Icon */}
                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <User className="w-6 h-6 text-white" />
                </div>

                {/* Member Info */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{userName}</h3>
                  <p className="text-sm text-white/80 mb-3">Self</p>
                  <div className="flex items-center justify-center space-x-2 text-xs text-white/70">
                    <Calendar className="w-4 h-4" />
                    <span>Today</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 mb-4">
                  <button className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 px-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-sm opacity-50 cursor-not-allowed">
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-sm opacity-50 cursor-not-allowed">
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>

                {/* Open Button */}
                <button onClick={() => navigate('/family/self')} className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
                  Open
                </button>
              </div>

              {/* Existing Family Members */}
              {familyMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={(e) => handleCardClick(e, member.id)}
                  className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 p-6 cursor-pointer group hover:bg-white/20 hover:scale-105"
                >
                  {/* Member Icon */}
                  <div className={`w-20 h-20 ${member.color} rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {member.icon}
                  </div>

                  {/* Member Info */}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                    <p className="text-sm text-white/80 mb-3">{member.relation}</p>
                    <div className="flex items-center justify-center space-x-2 text-xs text-white/70">
                      <Calendar className="w-4 h-4" />
                      <span>{member.lastActivity}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 mb-4">
                    <button onClick={(e) => { e.stopPropagation(); handleEditMember(member) }} className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 px-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-sm">
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={(e) => handleDeleteMember(e, member.id)}
                      className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>

                  {/* Open Button */}
                  <button onClick={(e) => handleOpenClick(e, member.id)} className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
                    Open
                  </button>
                </div>
              ))}

              {/* Add Family Member Card */}
              <div 
                onClick={() => setIsModalOpen(true)}
                className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-dashed border-white/30 p-6 cursor-pointer group hover:border-pink-400 hover:bg-white/20 hover:scale-105"
              >
                <div className="flex flex-col items-center justify-center h-full min-h-[250px]">
                  <div className="w-20 h-20 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pink-500/30 transition-all duration-300 backdrop-blur-sm">
                    <Plus className="w-10 h-10 text-pink-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Add family member</h3>
                  <p className="text-sm text-white/80 text-center">Create a new card</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 py-4 bg-white/10 backdrop-blur-md border-t border-white/20">
          <div className="max-w-7xl mx-auto">
            <p className="text-sm text-white/80">© 2025 HealthMate</p>
          </div>
        </footer>
      </div>

      {/* Add Family Member Modal */}
      <AddFamilyMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddMember}
      />

      {/* Edit Family Member Modal */}
      <EditFamilyMemberModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setEditingMember(null) }}
        onSave={handleSaveEdit}
        member={editingMember}
      />
    </div>
  )
}

export default Dashboard