/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Github,
  Linkedin,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  Phone
} from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans overflow-x-hidden flex flex-col relative selection:bg-amber-500/30 selection:text-amber-100">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <main className="flex-1 flex flex-col lg:flex-row px-8 md:px-12 py-12 lg:py-0 items-center justify-center gap-12 lg:gap-24 relative z-10 w-full max-w-7xl mx-auto min-h-screen">

        {/* Left Column: Biography & Info */}
        <div className="flex-1 flex flex-col justify-center w-full max-w-2xl text-center lg:text-left mt-8 lg:mt-0">
          <div className="mb-4">
            <span className="text-amber-500 text-sm font-mono tracking-tighter uppercase">[ NOC Engineer ]</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter leading-none mb-6 italic uppercase">
            Md Jahid Hasan <span className="text-amber-500">Emon</span>
          </h1>

          <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
            <div className="hidden lg:block h-[1px] w-12 bg-amber-500/50"></div>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 font-light tracking-wide uppercase italic">
              Junior Engineer, NOC | Bright Technologies Limited
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-8 text-gray-500 font-mono text-[10px] sm:text-xs uppercase tracking-widest">
            <div className="flex items-center gap-2 border border-gray-800 px-3 py-1 rounded">
              <GraduationCap className="w-4 h-4 text-amber-500" />
              <span>Northern University Bangladesh</span>
            </div>
            <div className="flex items-center gap-2 border border-gray-800 px-3 py-1 rounded">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>

          <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed mb-10 lg:pr-10 mx-auto lg:mx-0 max-w-lg">
            IT Support & NOC Engineer specializing in network infrastructure monitoring, configuring Cisco & MikroTik routers, and managing OLT switches to ensure high availability. Dedicated to real-time network monitoring and troubleshooting.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-10">
            <a href="tel:01303258509" className="w-full sm:w-auto px-5 py-3.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 font-semibold text-xs sm:text-sm tracking-widest uppercase hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-colors flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              Call
            </a>
            <a href="mailto:jahidhasanemon2211@gmail.com" className="w-full sm:w-auto px-6 py-3.5 bg-amber-500 text-black font-semibold text-xs sm:text-sm tracking-widest uppercase hover:bg-amber-400 transition-colors flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              Get in touch
            </a>
            <a href="https://jahidhasanemon.pro.bd/" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-6 py-3.5 bg-transparent text-gray-300 border border-gray-800 font-medium text-xs sm:text-sm tracking-widest uppercase hover:text-amber-500 hover:border-amber-500 transition-colors flex items-center justify-center gap-2 group">
              View Portfolio
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-8 border-t border-gray-900 mx-auto lg:mx-0 w-full max-w-lg">
            <SocialLink href="https://github.com/jahidhasanemon2211" icon={<Github className="w-4 h-4 sm:w-5 sm:h-5" />} label="GitHub" />
            <SocialLink href="https://www.linkedin.com/in/jahid-hasan-emon-9a4971227/" icon={<Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />} label="LinkedIn" />
            <SocialLink href="https://www.facebook.com/jahidhasan.emon.549/" icon={<Facebook className="w-4 h-4 sm:w-5 sm:h-5" />} label="Facebook" />
            <SocialLink href="https://www.instagram.com/worst_emon/" icon={<Instagram className="w-4 h-4 sm:w-5 sm:h-5" />} label="Instagram" />
            <SocialLink href="https://jahidhasanemon.pro.bd/" icon={<ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />} label="Website" />
          </div>
        </div>

        {/* Right Column: Visual Identity */}
        <div className="w-full max-w-[280px] sm:max-w-[360px] flex flex-col items-center lg:items-end pb-12 lg:pb-0">
          <div className="relative w-full">
            <div className="w-full aspect-[3/4] bg-gradient-to-tr from-[#111] to-[#222] border border-gray-800 rounded-2xl relative overflow-hidden group shadow-2xl">
              <img
                src="https://github.com/jahidhasanemon2211.png"
                alt="Md Jahid Hasan Emon Profile"
                className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-700"
              />
              {/* Decorative corner marks */}
              <div className="absolute top-6 left-6 w-4 h-4 border-t border-l border-amber-500/40"></div>
              <div className="absolute bottom-6 right-6 w-4 h-4 border-b border-r border-amber-500/40"></div>
            </div>

            {/* Vertical Text Decorative Element */}
            <div className="hidden lg:block absolute -right-8 top-1/2 -translate-y-1/2 rotate-180" style={{ writingMode: 'vertical-rl' }}>
              <span className="text-[10px] text-gray-700 uppercase tracking-[1em]">NETWORKING. SECURITY. ROUTING. SWITCHING.</span>
            </div>

            {/* Briefcase Badge */}
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 lg:-right-12 bg-amber-500 text-black p-3 sm:p-4 rounded-xl border border-[#111] shadow-xl transform rotate-3 hover:rotate-0 transition-transform">
              <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Bar Detail */}
      <footer className="py-6 sm:py-0 h-auto sm:h-12 border-t border-gray-900 flex flex-col sm:flex-row items-center px-6 lg:px-12 justify-between gap-4 sm:gap-0 relative z-10 bg-[#080808]/80 backdrop-blur-sm shrink-0">
        <span className="text-[9px] sm:text-[10px] text-gray-600 uppercase tracking-widest text-center sm:text-left">Md Jahid Hasan Emon // {new Date().getFullYear()} NOC Portfolio</span>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
          <span className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest">Status: Online & Monitoring</span>
        </div>
      </footer>
    </div>
  );
}

function SocialLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#111] text-gray-400 border border-gray-800 hover:text-amber-500 hover:border-amber-500 transition-all duration-300 transform hover:-translate-y-1"
      aria-label={label}
      title={label}
    >
      {icon}
    </a>
  );
}

