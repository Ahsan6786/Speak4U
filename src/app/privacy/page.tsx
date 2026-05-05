"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, EyeOff, Lock, Database } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
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
            Privacy <br />
            <span className="text-yellow-500">Protocol.</span>
          </h1>

          <div className="space-y-12 text-zinc-400 font-medium text-lg leading-relaxed">
            <section>
              <h2 className="text-white font-black uppercase italic tracking-widest text-sm mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-yellow-500" />
                Our Core Promise
              </h2>
              <p>
                At REVIAL, your privacy is not a feature—it's the foundation. We believe that professional growth should never come at the cost of personal data security. Our systems are designed to process information, not harvest it.
              </p>
            </section>

            <section className="p-8 bg-zinc-900/50 border border-white/5 rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.02)]">
              <h2 className="text-white font-black uppercase italic tracking-widest text-sm mb-4 flex items-center gap-2">
                <EyeOff size={18} className="text-yellow-500" />
                Zero-Capture Visual Policy
              </h2>
              <p className="mb-4">
                We implement a strict **No Photo/Video Storage** policy. When you use our visual analysis tools:
              </p>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2.5 flex-shrink-0" />
                  <span>No facial photos or videos are ever captured or stored on our servers.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2.5 flex-shrink-0" />
                  <span>Our AI "reads" facial landmarks in real-time and immediately converts them into mathematical weights.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2.5 flex-shrink-0" />
                  <span>Only these abstract weights are processed to give you feedback; the raw imagery is discarded instantly.</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-white font-black uppercase italic tracking-widest text-sm mb-4 flex items-center gap-2">
                <Database size={18} className="text-yellow-500" />
                Data Misuse Zero Tolerance
              </h2>
              <p>
                We do not sell, rent, or trade your data to third parties. Any data we retain (such as your speech metrics and progress reports) is encrypted and used solely to improve your personal coaching experience.
              </p>
            </section>

            <section>
              <h2 className="text-white font-black uppercase italic tracking-widest text-sm mb-4 flex items-center gap-2">
                <Lock size={18} className="text-yellow-500" />
                On-Device Intelligence
              </h2>
              <p>
                Whenever possible, REVIAL prioritizes on-device processing. This means your voice and visual patterns are analyzed right on your device, ensuring the most sensitive data never even leaves your hardware.
              </p>
            </section>
          </div>

          <div className="mt-20 pt-10 border-t border-white/5">
            <p className="text-zinc-600 font-black text-[10px] uppercase tracking-[0.5em]">©2026 REVIAL • Privacy Protocol v1.0</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
