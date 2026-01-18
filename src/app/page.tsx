'use client';

import Link from 'next/link';
import { ArrowRight, MessageCircle, Shield, Users, Zap, Github } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 relative overflow-hidden">
      {/* Subtle Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-20 md:mb-32">
          <div className="inline-flex items-center bg-white/60 border border-slate-200 rounded-3xl px-6 py-3 mb-8 backdrop-blur-sm shadow-sm">
            <Zap className="w-5 h-5 text-cyan-600 mr-2" />
            <span className="text-sm font-bold text-slate-800 tracking-tight">Real-time • Encrypted • Professional</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-black mb-6 leading-tight tracking-tighter">
            Baba Chat
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-800 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Secure real-time messaging for teams and individuals. Built with{' '}
            <span className="font-bold text-cyan-600">Next.js 16</span> +{' '}
            <span className="font-bold text-purple-600">Socket.IO</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <Link
              href="/chat"
              className="group bg-black text-white font-bold px-10 py-5 rounded-3xl text-lg shadow-xl hover:bg-slate-800 hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              Start Chatting
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="https://baba-chat.onrender.com"
              target="_blank"
              className="border-2 border-slate-900 bg-transparent px-10 py-5 rounded-3xl text-lg text-black hover:bg-black hover:text-white transition-all duration-300 font-bold"
            >
              Live Demo →
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {[
            {
              icon: Shield,
              title: 'Secure Encryption',
              desc: 'High-level security protects every private message across the network.',
            },
            {
              icon: MessageCircle,
              title: 'Instant Sync',
              desc: 'Messages appear instantly on all your devices with low-latency sockets.',
            },
            {
              icon: Users,
              title: 'Live Status',
              desc: 'See exactly who is online and available in your professional sidebar.',
            },
          ].map((feature, i) => (
            <div key={i} className="group bg-white/80 border border-slate-200 rounded-3xl p-8 hover:border-black hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <feature.icon className="w-12 h-12 text-black mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto" />
              <h3 className="text-2xl font-bold text-black mb-4 text-center">
                {feature.title}
              </h3>
              <p className="text-slate-700 font-medium text-center leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/40 border border-slate-200 rounded-[3rem] p-12 md:p-20 backdrop-blur-xl shadow-inner mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-black mb-8 tracking-tight leading-tight">
            Ready to experience the <br />future of secure chat?
          </h2>
          <Link
            href="/chat"
            className="inline-flex items-center bg-black text-white font-black px-12 py-6 rounded-3xl text-xl shadow-2xl hover:scale-110 transition-all duration-300"
          >
            Launch Chat App
            <ArrowRight className="w-6 h-6 ml-3" />
          </Link>
        </div>

        {/* Footer with GitHub Link */}
        <footer className="py-12 border-t border-slate-200 text-center">
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-lg">
              <MessageCircle className="w-6 h-6 text-cyan-600" />
              <span>Baba Chat © 2026</span>
            </div>
            
            <p className="text-slate-600 font-medium max-w-md leading-relaxed">
              Designed and developed as a professional real-time communication showcase.
            </p>

            <a 
              href="https://github.com/Babamosie333" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group inline-flex items-center bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all duration-300 hover:scale-105 shadow-xl"
            >
              <Github className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
              Follow @Babamosie333
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
