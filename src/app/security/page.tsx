"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Zap, Fingerprint, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function SecurityProtocol() {
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
            Security <br />
            <span className="text-yellow-500">Protocol.</span>
          </h1>

          <div className="space-y-12 text-zinc-400 font-medium text-lg leading-relaxed">
            <section>
              <h2 className="text-white font-black uppercase italic tracking-widest text-sm mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-yellow-500" />
                Hardened Infrastructure
              </h2>
              <p>
                REVIAL is built on enterprise-grade infrastructure. We use military-grade encryption for all data at rest and in transit, ensuring that your communication metrics are always shielded from unauthorized access.
              </p>
            </section>

            <section className="p-8 bg-zinc-900/50 border border-white/5 rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.02)]">
              <h2 className="text-white font-black uppercase italic tracking-widest text-sm mb-4 flex items-center gap-2">
                <Fingerprint size={18} className="text-yellow-500" />
                Weight-Based Neural Security
              </h2>
              <p className="mb-4">
                Our security architecture is designed to minimize data surface area:
              </p>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2.5 flex-shrink-0" />
                  <span>**Anonymized Landmarks**: Facial analysis is performed by converting landmarks into abstract numerical weights.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2.5 flex-shrink-0" />
                  <span>**Non-Reconstructible**: It is mathematically impossible to reconstruct a face from the weights we process.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2.5 flex-shrink-0" />
                  <span>**Session-Only Processing**: Visual feeds are processed in volatile memory and never touch permanent storage.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-white font-black uppercase italic tracking-widest text-sm mb-4 flex items-center gap-2">
                <Zap size={18} className="text-yellow-500" />
                Real-Time Monitoring
              </h2>
              <p>
                Our systems are monitored 24/7 for potential threats. We employ automated threat detection that identifies and mitigates suspicious activity the moment it occurs.
              </p>
            </section>

            <section>
              <h2 className="text-white font-black uppercase italic tracking-widest text-sm mb-4 flex items-center gap-2">
                <RefreshCcw size={18} className="text-yellow-500" />
                Continuous Audits
              </h2>
              <p>
                We regularly undergo internal security audits to ensure our protocols meet the highest standards of data integrity and user protection.
              </p>
            </section>
          </div>

          <div className="mt-20 pt-10 border-t border-white/5">
            <p className="text-zinc-600 font-black text-[10px] uppercase tracking-[0.5em]">©2026 REVIAL • Security Protocol v1.0</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
