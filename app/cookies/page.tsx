import { Footer } from "@/components/landing/footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CookiesPage() {
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
              Cookie Policy
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
                  1. What are Cookies?
                </h2>
                <p>
                  Cookies are small pieces of text sent to your web browser by a
                  website you visit. A cookie file is stored in your web browser
                  and allows the Service or a third-party to recognize you and
                  make your next visit easier and the Service more useful to
                  you.
                </p>
                <p>
                  Cookies can be "persistent" or "session" cookies. Persistent
                  cookies remain on your personal computer or mobile device when
                  you go offline, while session cookies are deleted as soon as
                  you close your web browser.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  2. How ATScV Uses Cookies
                </h2>
                <p>
                  When you use and access the Service, we may place a number of
                  cookies files in your web browser. We use cookies for the
                  following purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2 marker:text-emerald-500">
                  <li>
                    <strong>Essential Cookies:</strong> We use essential cookies
                    to authenticate users and prevent fraudulent use of user
                    accounts. For example, to keep you logged in to your ATScV
                    account.
                  </li>
                  <li>
                    <strong>Preferences Cookies:</strong> We use preferences
                    cookies to remember information that changes the way the
                    Service behaves or looks, such as the "remember me"
                    functionality or saving incomplete resume drafts.
                  </li>
                  <li>
                    <strong>Analytics Cookies:</strong> We use analytics cookies
                    to track information how the Service is used so that we can
                    make improvements. We may also use analytics cookies to test
                    new advertisements, pages, features or new functionality of
                    the Service to see how our users react to them.
                  </li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  3. Third-Party Cookies
                </h2>
                <p>
                  In addition to our own cookies, we may also use various
                  third-parties cookies to report usage statistics of the
                  Service, deliver advertisements on and through the Service,
                  and so on.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  4. Your Choices Regarding Cookies
                </h2>
                <p>
                  If you'd like to delete cookies or instruct your web browser
                  to delete or refuse cookies, please visit the help pages of
                  your web browser.
                </p>
                <p>
                  Please note, however, that if you delete cookies or refuse to
                  accept them, you might not be able to use all of the features
                  we offer, you may not be able to store your preferences, and
                  some of our pages might not display properly.
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
