import Link from "next/link";
import { Github, Twitter, Linkedin, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 relative z-10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2 space-y-6">
            <div className="w-32 sm:w-40">
              <img
                src="/logo.png"
                alt="ATScV logo"
                className="w-full h-auto object-contain"
              />
            </div>
            <p className="text-slate-600 max-w-sm leading-relaxed">
              Craft an industry-standard, ATS-optimized resume in minutes.
              Revamp your old resume or let our deep-learning engine analyze
              your ATS score instantly.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all"
              >
                <Twitter className="w-5 h-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all"
              >
                <Github className="w-5 h-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="#"
                className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all"
              >
                <Linkedin className="w-5 h-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-semibold text-slate-900 tracking-wide uppercase text-sm">
              Product
            </h4>
            <ul className="space-y-4 text-slate-600">
              <li>
                <Link
                  href="/builder"
                  className="hover:text-emerald-600 transition-colors inline-block"
                >
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link
                  href="/ats-checker"
                  className="hover:text-emerald-600 transition-colors inline-block"
                >
                  ATS Checker
                </Link>
              </li>
              <li>
                <Link
                  href="#templates"
                  className="hover:text-emerald-600 transition-colors inline-block"
                >
                  Templates
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="hover:text-emerald-600 transition-colors inline-block"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-semibold text-slate-900 tracking-wide uppercase text-sm">
              Resources
            </h4>
            <ul className="space-y-4 text-slate-600">
              <li>
                <Link
                  href="#"
                  className="hover:text-emerald-600 transition-colors inline-block"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-emerald-600 transition-colors inline-block"
                >
                  Career Advice
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-emerald-600 transition-colors inline-block"
                >
                  Interview Prep
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-emerald-600 transition-colors inline-block"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-semibold text-slate-900 tracking-wide uppercase text-sm">
              Contact
            </h4>
            <ul className="space-y-4 text-slate-600">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>hello@atscv.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  123 AI Boulevard
                  <br />
                  Tech District, CA 94107
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} ATScV. Built for excellence.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link
              href="/privacy"
              className="hover:text-emerald-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-emerald-600 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="hover:text-emerald-600 transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
