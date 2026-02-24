import { Footer } from "@/components/landing/footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500/30">
      <main className="flex-grow pt-12 pb-24 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-1/4 w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[150px] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

        <div className="container max-w-4xl mx-auto px-6 relative z-10">
          <Link href="/">
            <Button
              variant="ghost"
              className="mb-8 hover:bg-slate-200/50 hover:text-emerald-700 -ml-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Button>
          </Link>

          <div className="bg-white/70 backdrop-blur-xl border border-slate-200 p-8 md:p-12 shadow-xl shadow-slate-200/50">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
              Terms of Service
            </h1>
            <p className="text-slate-500 mb-10 text-sm font-medium">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>

            <div className="space-y-8 text-slate-700 leading-relaxed text-lg">
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing and using ATScV, you accept and agree to be bound
                  by the terms and provision of this agreement. In addition,
                  when using this service, you shall be subject to any posted
                  guidelines or rules applicable to such services.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  2. Service Description
                </h2>
                <p>
                  ATScV provides an AI-powered resume building and ATS
                  optimization service. We reserve the right to modify, suspend,
                  or discontinue any aspect of the service at any time without
                  notice. We will not be liable to you or any third party for
                  any modification, suspension, or discontinuance of the
                  service.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  3. User Responsibilities
                </h2>
                <p>
                  You are responsible for any activity that occurs under your
                  account. You agree not to:
                </p>
                <ul className="list-disc pl-6 space-y-2 marker:text-emerald-500">
                  <li>
                    Use the service for any illegal purpose or in violation of
                    any local, state, national, or international law.
                  </li>
                  <li>
                    Violate, or encourage others to violate, any right of a
                    third party, including by infringing or misappropriating any
                    third-party intellectual property right.
                  </li>
                  <li>
                    Interfere with security-related features of the service.
                  </li>
                  <li>
                    Perform any fraudulent activity including impersonating any
                    person or entity, or claiming a false affiliation.
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  4. Intellectual Property
                </h2>
                <p>
                  The service and its original content (excluding content
                  provided by you), features, and functionality are and will
                  remain the exclusive property of ATScV and its licensors. Our
                  trademarks and trade dress may not be used in connection with
                  any product or service without the prior written consent of
                  ATScV.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  5. Limitation of Liability
                </h2>
                <p>
                  In no event shall ATScV, nor its directors, employees,
                  partners, agents, suppliers, or affiliates, be liable for any
                  indirect, incidental, special, consequential or punitive
                  damages, including without limitation, loss of profits, data,
                  use, goodwill, or other intangible losses, resulting from your
                  access to or use of or inability to access or use the service.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  6. Governing Law
                </h2>
                <p>
                  These Terms shall be governed and construed in accordance with
                  the laws, without regard to its conflict of law provisions.
                  Our failure to enforce any right or provision of these Terms
                  will not be considered a waiver of those rights.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
