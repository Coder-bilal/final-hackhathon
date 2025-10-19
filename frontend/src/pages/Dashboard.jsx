import { Link } from 'react-router-dom'
import { Heart, Plus, User, Edit, Trash2, Calendar } from 'lucide-react'
import { useState } from 'react'
import AddFamilyMemberModal from '../components/AddFamilyMemberModal'

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [familyMembers, setFamilyMembers] = useState([
    {
      id: 1,
      name: "You",
      relation: "Self",
      lastActivity: "Oct 15, 2025",
      color: "bg-pink-500",
      icon: <User className="w-6 h-6 text-white" />
    },
    {
      id: 2,
      name: "Ammi",
      relation: "Mother",
      lastActivity: "Oct 12, 2025",
      color: "bg-green-500",
      icon: <User className="w-6 h-6 text-white" />
    },
    {
      id: 3,
      name: "Wife",
      relation: "Spouse",
      lastActivity: "Oct 09, 2025",
      color: "bg-blue-500",
      icon: <User className="w-6 h-6 text-white" />
    },
    {
      id: 4,
      name: "Ali",
      relation: "Son",
      lastActivity: "Sep 28, 2025",
      color: "bg-pink-500",
      icon: <User className="w-6 h-6 text-white" />
    }
  ])

  const handleAddMember = (newMember) => {
    const member = {
      id: Date.now(), // Simple ID generation
      name: newMember.name,
      relation: newMember.relation,
      lastActivity: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: '2-digit' 
      }),
      color: newMember.color,
      icon: <User className="w-6 h-6 text-white" />
    }
    setFamilyMembers([...familyMembers, member])
  }

  const handleDeleteMember = (id) => {
    setFamilyMembers(familyMembers.filter(member => member.id !== id))
  }

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
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">HealthMate</h1>
                <p className="text-sm text-white/80">Sehat ka Smart Dost</p>
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

            {/* Add Family Member Button */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>+ Add family member</span>
            </button>
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
              {/* Existing Family Members */}
              {familyMembers.map((member) => (
                <div
                  key={member.id}
                  onClick={() => window.location.href = `/family/${member.id}`}
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
                    <button className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 px-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-sm">
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteMember(member.id)}
                      className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>

                  {/* Open Button */}
                  <button className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl">
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
    </div>
  )
}

export default Dashboard