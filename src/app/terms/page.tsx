"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Gavel, Scale, UserCheck, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-yellow-400 selection:text-black py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-black uppercase text-xs tracking-widest">Back to Home</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 leading-[0.9]">
            Terms of <br />
            <span className="text-yellow-500">Service.</span>
          </h1>

          <div className="space-y-12 text-zinc-400 font-medium text-lg leading-relaxed">
            <section>
              <h2 className="text-white font-black uppercase italic tracking-widest text-sm mb-4 flex items-center gap-2">
                <Gavel size={18} className="text-yellow-500" />
                Agreement to Terms
              </h2>
              <p>
                By accessing REVIAL, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are prohibited from using or accessing this platform.
              </p>
            </section>

            <section>
              <h2 className="text-white font-black uppercase italic tracking-widest text-sm mb-4 flex items-center gap-2">
                <Scale size={18} className="text-yellow-500" />
                Ethical Usage
              </h2>
              <p>
                REVIAL is designed for professional self-improvement. Users agree not to use the platform for deceptive purposes, impersonation, or any activity that violates the privacy or rights of others.
              </p>
            </section>

            <section className="p-8 bg-zinc-900/50 border border-white/5 rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.02)]">
              <h2 className="text-white font-black uppercase italic tracking-widest text-sm mb-4 flex items-center gap-2">
                <UserCheck size={18} className="text-yellow-500" />
                AI Interaction & Analysis
              </h2>
              <p className="mb-4">
                Our platform uses advanced neural processing to analyze your communication patterns. By using REVIAL, you acknowledge:
              </p>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2.5 flex-shrink-0" />
                  <span>Your facial landmarks are converted to weights for feedback and never stored as images.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2.5 flex-shrink-0" />
                  <span>The AI coaching provides suggestions based on probabilistic models and should be used as a guide, not absolute truth.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2.5 flex-shrink-0" />
                  <span>You retain ownership of your generated speech content and reports.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-white font-black uppercase italic tracking-widest text-sm mb-4 flex items-center gap-2">
                <AlertTriangle size={18} className="text-yellow-500" />
                Limitations of Liability
              </h2>
              <p>
                REVIAL shall not be held liable for any damages arising out of the use or inability to use the materials on our platform. We provide tools for improvement; the final result depends on the user's application and effort.
              </p>
            </section>
          </div>

          <div className="mt-20 pt-10 border-t border-white/5">
            <p className="text-zinc-600 font-black text-[10px] uppercase tracking-[0.5em]">©2026 REVIAL • Terms of Service v1.0</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
