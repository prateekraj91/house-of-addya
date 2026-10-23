"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store-context";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  Sparkles,
  CheckCircle2,
  Send,
} from "lucide-react";

export default function ContactPage() {
  const { settings } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Styling / Sizing Advice",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
    setForm({
      name: "",
      email: "",
      phone: "",
      subject: "Styling / Sizing Advice",
      message: "",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 space-y-16">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold tracking-[0.2em] text-pink-600 uppercase block">
          We&apos;d Love To Hear From You
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl text-[#1E171B]">
          Contact House of Addya
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Whether you have a sizing question, order inquiry, or PR collaboration proposal, our New Delhi atelier team is here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Information Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-pink-100 p-8 shadow-pink-soft space-y-6">
            <h3 className="font-editorial text-2xl text-stone-900 pb-3 border-b border-pink-100">
              Atelier & Headquarters
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-pink-50 rounded-2xl text-pink-600 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-stone-900 font-bold mb-0.5">
                    Studio & Showroom
                  </strong>
                  <p className="text-stone-500 leading-relaxed">
                    {settings.businessAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-pink-50 rounded-2xl text-pink-600 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-stone-900 font-bold mb-0.5">
                    Email Inquiries
                  </strong>
                  <a
                    href={`mailto:${settings.businessEmail}`}
                    className="text-pink-600 hover:underline"
                  >
                    {settings.businessEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-pink-50 rounded-2xl text-pink-600 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-stone-900 font-bold mb-0.5">
                    Direct Phone Line
                  </strong>
                  <p className="text-stone-600 font-medium">
                    {settings.businessPhone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-pink-50 rounded-2xl text-pink-600 flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-stone-900 font-bold mb-0.5">
                    Operating Hours
                  </strong>
                  <p className="text-stone-500">
                    Monday to Saturday: 10:00 AM – 7:00 PM IST
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp VIP Direct Chat */}
            <div className="pt-4 border-t border-pink-100">
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=Hi%20House%20of%20Addya!%20I%20have%20an%20inquiry.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Instantly on WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="bg-pink-50/70 rounded-3xl border border-pink-100 p-6 text-xs text-stone-600 space-y-2">
            <span className="font-bold uppercase tracking-wider text-stone-900 block">
              Returns Logistics Hub
            </span>
            <p className="text-stone-500 leading-relaxed">
              {settings.returnAddress}
            </p>
            <p className="text-stone-400 pt-1">
              GST Registered Entity: {settings.gstNumber}
            </p>
          </div>
        </div>

        {/* Right Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-pink-100 p-8 sm:p-12 shadow-pink-soft space-y-6">
            <h3 className="font-editorial text-2xl text-stone-900">
              Send Us a Note
            </h3>

            {submitted ? (
              <div className="bg-pink-50 border border-pink-200 p-8 rounded-2xl text-center space-y-3">
                <div className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-editorial text-2xl text-stone-900">
                  Message Received!
                </h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  Thank you for reaching out to House of Addya. Our customer care team will get back to you via email or WhatsApp within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 bg-stone-900 text-white rounded-full text-xs font-bold uppercase"
                >
                  Send Another Note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Radhika Sharma"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-bold mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="radhika@gmail.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-bold mb-1">
                      Inquiry Topic
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500"
                    >
                      <option>Styling / Sizing Advice</option>
                      <option>Order Status / Shiprocket Delivery</option>
                      <option>Exchange / Return Request</option>
                      <option>PR / Influencer Collaborations</option>
                      <option>Custom Alterations</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what you need help with..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full p-4 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-pink-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-pink-soft flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Inquiry to Atelier</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
