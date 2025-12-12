import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Footer from '@/components/landing/Footer';

export default function Disclaimer() {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 mb-6">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">Important Information</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-slate-900 mb-4">
            Disclaimer
          </h1>
          <p className="text-slate-600">Please read carefully before using FabHab</p>
        </div>

        <div className="prose prose-slate max-w-none">
          <section className="mb-12">
            <div className="bg-amber-50 rounded-2xl p-8 border-2 border-amber-200">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Not Medical or Professional Advice</h2>
              <p className="text-slate-700">
                <strong>FabHab is not a medical device or healthcare service.</strong> The predictions, insights, 
                and recommendations provided by FabHab are for informational and motivational purposes only. 
                They should not be considered professional medical, psychological, or health advice.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">AI Predictions Are Not Guarantees</h2>
            <p className="text-slate-600 mb-4">
              FabHab uses artificial intelligence and machine learning to analyze your behavioral patterns 
              and predict potential streak breaks, suggest habits, and provide personalized recommendations. 
              However:
            </p>
            <ul className="space-y-2 ml-6 text-slate-600">
              <li>Predictions are based on statistical models and historical data patterns</li>
              <li>Accuracy varies based on data quality and individual circumstances</li>
              <li>AI cannot account for all external factors affecting your behavior</li>
              <li>Results may differ significantly from predictions</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Personal Responsibility</h2>
            <p className="text-slate-600">
              You are solely responsible for your decisions and actions regarding:
            </p>
            <ul className="space-y-2 ml-6 text-slate-600 mt-4">
              <li>Which habits you choose to track and pursue</li>
              <li>How you interpret and act on AI recommendations</li>
              <li>Your physical and mental health decisions</li>
              <li>The appropriateness of habits for your individual situation</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Consult Professionals</h2>
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <p className="text-slate-700">
                <strong>Always consult with qualified professionals:</strong>
              </p>
              <ul className="space-y-2 ml-6 text-slate-700 mt-4">
                <li>See a doctor before starting any new health or fitness habit</li>
                <li>Consult a therapist for mental health and emotional well-being</li>
                <li>Work with a nutritionist for dietary habits and changes</li>
                <li>Seek professional help if you're struggling with addiction or compulsive behaviors</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">No Warranty or Guarantee</h2>
            <p className="text-slate-600">
              FabHab makes no warranties or guarantees regarding:
            </p>
            <ul className="space-y-2 ml-6 text-slate-600 mt-4">
              <li>The effectiveness of habit tracking for achieving your goals</li>
              <li>The accuracy of AI predictions, forecasts, or insights</li>
              <li>Uninterrupted or error-free service availability</li>
              <li>Specific outcomes or results from using the platform</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Limitation of Liability</h2>
            <p className="text-slate-600">
              To the fullest extent permitted by law, Chaos Craft Labs and FabHab shall not be liable for:
            </p>
            <ul className="space-y-2 ml-6 text-slate-600 mt-4">
              <li>Any health issues, injuries, or adverse outcomes</li>
              <li>Decisions made based on AI predictions or recommendations</li>
              <li>Lost data, missed notifications, or technical failures</li>
              <li>Any indirect, incidental, or consequential damages</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Third-Party Content & Integrations</h2>
            <p className="text-slate-600">
              FabHab may integrate with third-party services like WhatsApp. We are not responsible for 
              the availability, accuracy, or policies of third-party platforms. Use of third-party 
              services is at your own risk.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Changes to Service</h2>
            <p className="text-slate-600">
              We reserve the right to modify, suspend, or discontinue any aspect of FabHab at any time 
              without notice. We are not liable for any modifications or interruptions to the service.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">User Age & Capacity</h2>
            <p className="text-slate-600">
              FabHab is intended for users aged 13 and older. By using FabHab, you confirm that:
            </p>
            <ul className="space-y-2 ml-6 text-slate-600 mt-4">
              <li>You meet the minimum age requirement</li>
              <li>You have the legal capacity to agree to these terms</li>
              <li>You understand the limitations and risks of using an AI-powered service</li>
            </ul>
          </section>

          <section className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Questions or Concerns?</h2>
            <p className="text-slate-600 mb-4">
              If you have questions about this disclaimer or need clarification:
            </p>
            <p className="text-slate-600">
              <strong>Email:</strong> support@chaoscraftlabs.com<br />
              <strong>Website:</strong> <a href="https://chaoscraftlabs.com" className="text-violet-600 hover:text-violet-700">chaoscraftlabs.com</a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}