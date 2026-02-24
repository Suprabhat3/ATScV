import { Footer } from "@/components/landing/footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicyPage() {
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
              Privacy Policy
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
                  1. Introduction
                </h2>
                <p>
                  At ATScV, we respect your privacy and are committed to
                  protecting your personal data. This privacy policy will inform
                  you as to how we look after your personal data when you visit
                  our website and tell you about your privacy rights and how the
                  law protects you.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  2. The Data We Collect About You
                </h2>
                <p>
                  We may collect, use, store and transfer different kinds of
                  personal data about you which we have grouped together as
                  follows:
                </p>
                <ul className="list-disc pl-6 space-y-2 marker:text-emerald-500">
                  <li>
                    <strong>Identity Data:</strong> includes first name, last
                    name, username or similar identifier.
                  </li>
                  <li>
                    <strong>Contact Data:</strong> includes email address and
                    telephone numbers.
                  </li>
                  <li>
                    <strong>Resume Data:</strong> includes work experience,
                    education history, skills, and any other information you
                    choose to include in your resumes generated or uploaded on
                    our platform.
                  </li>
                  <li>
                    <strong>Technical Data:</strong> includes internet protocol
                    (IP) address, your login data, browser type and version,
                    time zone setting and location.
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  3. How We Use Your Personal Data
                </h2>
                <p>
                  We will only use your personal data when the law allows us to.
                  Most commonly, we will use your personal data in the following
                  circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 marker:text-emerald-500">
                  <li>
                    Where we need to perform the contract we are about to enter
                    into or have entered into with you (e.g., providing ATS
                    optimization services).
                  </li>
                  <li>
                    Where it is necessary for our legitimate interests (or those
                    of a third party) and your interests and fundamental rights
                    do not override those interests.
                  </li>
                  <li>Where we need to comply with a legal obligation.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  4. Data Security
                </h2>
                <p>
                  We have put in place appropriate security measures to prevent
                  your personal data from being accidentally lost, used, or
                  accessed in an unauthorized way, altered, or disclosed. In
                  addition, we limit access to your personal data to those
                  employees, agents, contractors, and other third parties who
                  have a business need to know.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  5. Your Legal Rights
                </h2>
                <p>
                  Under certain circumstances, you have rights under data
                  protection laws in relation to your personal data, including
                  the right to request access, correction, erasure, restriction,
                  transfer, to object to processing, to portability of data, and
                  (where the lawful ground of processing is consent) to withdraw
                  consent.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  6. Contact Us
                </h2>
                <p>
                  If you have any questions about this privacy policy or our
                  privacy practices, please contact us at:
                  <br />
                  <a
                    href="mailto:hello@atscv.com"
                    className="text-emerald-600 hover:text-emerald-700 font-semibold mt-2 inline-block"
                  >
                    hello@atscv.com
                  </a>
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
