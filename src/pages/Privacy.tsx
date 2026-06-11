import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Shield } from 'lucide-react';
import Footer from '@/components/landing/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link to={createPageUrl('Home')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Privacy Policy</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-slate-900 mb-4">
            Your data, <span className="font-medium">your control</span>
          </h1>
          <p className="text-slate-600">Last updated: January 2025</p>
        </div>

        <div className="prose prose-slate max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">What We Collect</h2>
            <div className="space-y-4 text-slate-600">
              <p>
                FabHab collects information necessary to provide you with intelligent habit tracking and predictions:
              </p>
              <ul className="space-y-2 ml-6">
                <li><strong>Account Information:</strong> Name, email address, and authentication details</li>
                <li><strong>Habit Data:</strong> Habits you create, completion logs, streaks, and preferences</li>
                <li><strong>Behavioral Patterns:</strong> Timing, emotional states, skip reasons, and context data</li>
                <li><strong>AI Predictions:</strong> Generated forecasts, suggestions, and insights based on your patterns</li>
                <li><strong>Usage Data:</strong> How you interact with the app to improve our service</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">How We Use Your Data</h2>
            <div className="space-y-4 text-slate-600">
              <p>Your data powers FabHab's AI features:</p>
              <ul className="space-y-2 ml-6">
                <li>Generate personalized habit predictions and break forecasts</li>
                <li>Auto-detect new habits from your behavioral patterns</li>
                <li>Adapt habit protocols based on your performance trends</li>
                <li>Provide emotion-aware insights and recommendations</li>
                <li>Send timely WhatsApp notifications and interventions</li>
                <li>Improve our AI models and product features</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Data Security</h2>
            <p className="text-slate-600">
              We take security seriously. Your data is encrypted in transit and at rest. We use industry-standard 
              security practices and regularly audit our systems. FabHab runs on secure cloud infrastructure 
              with automated backups and disaster recovery.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Third-Party Services</h2>
            <div className="space-y-4 text-slate-600">
              <p>FabHab integrates with the following services:</p>
              <ul className="space-y-2 ml-6">
                <li><strong>WhatsApp:</strong> For AI coaching and habit notifications (opt-in)</li>
                <li><strong>OpenAI:</strong> Powers our predictive AI and natural language processing</li>
                <li><strong>Base44:</strong> Cloud hosting and database infrastructure</li>
              </ul>
              <p className="mt-4">
                We only share the minimum data necessary for these services to function. Each service 
                has its own privacy policy that governs their data handling.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Your Rights</h2>
            <div className="space-y-4 text-slate-600">
              <p>You have full control over your data:</p>
              <ul className="space-y-2 ml-6">
                <li><strong>Access:</strong> View all your data at any time in the app</li>
                <li><strong>Export:</strong> Download your complete habit history and logs</li>
                <li><strong>Delete:</strong> Permanently remove your account and all associated data</li>
                <li><strong>Opt-out:</strong> Disable AI features or WhatsApp integration anytime</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Cookies & Tracking</h2>
            <p className="text-slate-600">
              FabHab uses essential cookies for authentication and session management. We do not use 
              third-party advertising cookies or sell your data to advertisers. Analytics data is 
              anonymized and used only to improve the product.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Children's Privacy</h2>
            <p className="text-slate-600">
              FabHab is not intended for users under 13 years of age. We do not knowingly collect 
              personal information from children. If you believe we have collected data from a child, 
              please contact us immediately.
            </p>
          </section>

          <section className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Questions?</h2>
            <p className="text-slate-600 mb-4">
              If you have questions about this Privacy Policy or how we handle your data, reach out to us:
            </p>
            <p className="text-slate-600">
              <strong>Email:</strong> privacy@chaoscraftlabs.com<br />
              <strong>Website:</strong> <a href="https://chaoscraftlabs.com" className="text-violet-600 hover:text-violet-700">chaoscraftlabs.com</a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
