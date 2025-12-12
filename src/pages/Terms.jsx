import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, FileText } from 'lucide-react';
import Footer from '@/components/landing/Footer';

export default function Terms() {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 mb-6">
            <FileText className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Terms of Service</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-slate-900 mb-4">
            Terms of <span className="font-medium">Service</span>
          </h1>
          <p className="text-slate-600">Last updated: January 2025</p>
        </div>

        <div className="prose prose-slate max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Acceptance of Terms</h2>
            <p className="text-slate-600">
              By accessing and using FabHab, you accept and agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Description of Service</h2>
            <p className="text-slate-600 mb-4">
              FabHab is an AI-powered habit tracking platform that provides:
            </p>
            <ul className="space-y-2 ml-6 text-slate-600">
              <li>Habit creation, tracking, and streak management</li>
              <li>Predictive AI forecasting for streak breaks</li>
              <li>Emotion-aware logging and pattern detection</li>
              <li>Auto-detection of new habits from behavioral patterns</li>
              <li>Adaptive protocol adjustments</li>
              <li>WhatsApp AI coaching integration (optional)</li>
              <li>Gamification features including points, levels, and badges</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">User Accounts</h2>
            <div className="space-y-4 text-slate-600">
              <p>You are responsible for:</p>
              <ul className="space-y-2 ml-6">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
                <li>Providing accurate and complete information</li>
              </ul>
              <p className="mt-4">
                We reserve the right to suspend or terminate accounts that violate these terms or 
                engage in fraudulent activity.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">AI Predictions & Accuracy</h2>
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <p className="text-slate-700">
                <strong>Important:</strong> FabHab's AI predictions, forecasts, and recommendations are based on 
                behavioral patterns and machine learning models. While we strive for accuracy, predictions are 
                not guarantees. Results may vary based on individual circumstances, data quality, and external factors.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">User Content</h2>
            <div className="space-y-4 text-slate-600">
              <p>By using FabHab, you grant us the right to:</p>
              <ul className="space-y-2 ml-6">
                <li>Store and process your habit data to provide AI predictions</li>
                <li>Use anonymized, aggregated data to improve our algorithms</li>
                <li>Display your shared achievements on social platforms (only with your explicit consent)</li>
              </ul>
              <p className="mt-4">
                You retain all ownership rights to your data. We will never sell your personal information 
                to third parties.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Prohibited Activities</h2>
            <div className="space-y-4 text-slate-600">
              <p>You may not:</p>
              <ul className="space-y-2 ml-6">
                <li>Use FabHab for any illegal purpose or to violate any laws</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Reverse engineer or attempt to extract our AI models</li>
                <li>Use automated tools to manipulate points, levels, or achievements</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Share false or misleading information</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Third-Party Integrations</h2>
            <p className="text-slate-600">
              FabHab integrates with WhatsApp for AI coaching. When you connect WhatsApp, you also agree 
              to WhatsApp's terms of service. We are not responsible for the availability, functionality, 
              or policies of third-party services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Limitation of Liability</h2>
            <p className="text-slate-600">
              FabHab is provided "as is" without warranties of any kind. We are not liable for:
            </p>
            <ul className="space-y-2 ml-6 text-slate-600 mt-4">
              <li>Inaccurate predictions or recommendations</li>
              <li>Lost data due to technical issues or user error</li>
              <li>Health outcomes resulting from habit choices</li>
              <li>Interruptions or downtime in service availability</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Changes to Terms</h2>
            <p className="text-slate-600">
              We may update these Terms of Service from time to time. Significant changes will be 
              communicated via email or in-app notification. Continued use of FabHab after changes 
              constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Termination</h2>
            <p className="text-slate-600">
              You may delete your account at any time from the app settings. Upon account deletion, 
              all your data will be permanently removed from our systems within 30 days. We reserve 
              the right to terminate accounts that violate these terms.
            </p>
          </section>

          <section className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Contact Us</h2>
            <p className="text-slate-600 mb-4">
              Questions about these Terms of Service? Contact us:
            </p>
            <p className="text-slate-600">
              <strong>Email:</strong> legal@chaoscraftlabs.com<br />
              <strong>Website:</strong> <a href="https://chaoscraftlabs.com" className="text-violet-600 hover:text-violet-700">chaoscraftlabs.com</a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}