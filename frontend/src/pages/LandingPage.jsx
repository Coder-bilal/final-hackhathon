import { Link } from 'react-router-dom'
import { Heart, ArrowRight, CheckCircle, Shield, Zap, Users } from 'lucide-react'
import { motion } from 'framer-motion'

const LandingPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Premium Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Orbs */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-40 right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-3000"></div>
          <div className="absolute top-1/2 left-1/2 w-88 h-88 bg-orange-500/15 rounded-full blur-3xl animate-pulse delay-4000"></div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"></div>
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
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-white/80 hover:text-pink-300 transition-colors">Features</a>
              <a href="#how-it-works" className="text-white/80 hover:text-pink-300 transition-colors">How it works</a>
              <a href="#faq" className="text-white/80 hover:text-pink-300 transition-colors">FAQ</a>
              <a href="#get-started" className="text-white/80 hover:text-pink-300 transition-colors">Get started</a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-white hover:text-pink-300 font-medium transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl hover:from-pink-600 hover:to-orange-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Create account
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-md text-pink-300 rounded-full text-sm font-medium mb-8 border border-white/30">
                <Zap className="w-5 h-5 mr-2" />
                AI-powered Health Companion
              </div>

              <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
                Manage your{' '}
                <span className="text-pink-400">health</span>,{' '}
                <span className="text-orange-400">reports</span> &{' '}
                <span className="text-pink-400">vitals</span> — beautifully.
              </h1>

              <p className="text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                Upload your medical reports, get AI-powered explanations, and track your vitals — all in one colorful, easy experience.
              </p>

              <p className="text-xl text-white/70 mb-12 italic">
                "HealthMate - Sehat ka smart dost."
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8">
                <Link
                  to="/register"
                  className="group px-10 py-5 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-2xl hover:from-pink-600 hover:to-orange-600 transition-all duration-300 font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2"
                >
                  Start free
                  <ArrowRight className="w-6 h-6 ml-3 inline-block group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link
                  to="/dashboard"
                  className="px-10 py-5 border-2 border-white/50 text-white rounded-2xl hover:bg-white/20 transition-all duration-300 font-bold text-xl backdrop-blur-sm"
                >
                  View live demo
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why you'll love HealthMate Section */}
        <section id="features" className="px-6 py-20 bg-white/5 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl font-bold text-white mb-6">
                Why you'll love HealthMate
              </h2>
              <p className="text-2xl text-white/80 max-w-3xl mx-auto">
                Simple, vibrant, and secure — designed for families and caregivers.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:bg-white/20 hover:scale-105"
              >
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                  <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">One-click uploads</h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  Upload PDFs or images — instantly accessible.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:bg-white/20 hover:scale-105"
              >
                <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                  <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">AI report explain</h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  Gemini explains your health reports in simple words.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 hover:bg-white/20 hover:scale-105"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                  <CheckCircle className="w-8 h-8 text-green-300" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Manual vitals</h3>
                <p className="text-white/80 text-lg leading-relaxed">
                  BP, Sugar, Weight — even without lab reports.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20 bg-gradient-to-r from-pink-500/90 to-orange-500/90 backdrop-blur-md">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold text-white mb-8">
                Ready to take control of your health?
              </h2>
              <p className="text-2xl text-white/90 mb-12">
                Join thousands of families already using HealthMate to manage their health better.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8">
                <Link
                  to="/register"
                  className="px-10 py-5 bg-white text-pink-600 rounded-2xl hover:bg-gray-100 transition-all duration-300 font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2"
                >
                  Get started for free
                </Link>
                <Link
                  to="/login"
                  className="px-10 py-5 border-2 border-white text-white rounded-2xl hover:bg-white hover:text-pink-600 transition-all duration-300 font-bold text-xl backdrop-blur-sm"
                >
                  Sign in
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-12 bg-black/50 backdrop-blur-md border-t border-white/20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">HealthMate</h3>
                  <p className="text-sm text-white/80">Sehat ka Smart Dost</p>
                </div>
              </div>
              <p className="text-white/80 text-center md:text-right text-lg">
                © 2025 HealthMate. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default LandingPage
