"use client";

import { BackgroundAmbience } from "@/components/landing/background-ambience";
import { LoadingScreen } from "@/components/loading-screen";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { optimizeResume } from "./actions";
import { Loader2, Sparkles, Printer, Zap, UploadCloud } from "lucide-react";
// import { useRouter } from "next/navigation";
import { ResumePreview } from "@/components/resume-preview";
// import { createClient } from "@/utils/supabase/client";

export default function OptimizerPage() {
  // const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [templateType, setTemplateType] = useState<
    "modern" | "classic" | "minimalist"
  >("modern");

  useEffect(() => {
    const pendingResume = localStorage.getItem("pendingOptimizerResume");
    if (pendingResume) {
      try {
        setResult(JSON.parse(pendingResume));
        localStorage.removeItem("pendingOptimizerResume");
      } catch (e) {}
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData(e.currentTarget);

    const file = formData.get("resume") as File;
    if (
      file &&
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please upload a valid PDF file.");
      setLoading(false);
      return;
    }

    const res = await optimizeResume(formData);

    if (res.error) {
      setError(res.error);
    } else {
      setResult(res.optimizedResume);
    }
    setLoading(false);
  }

  const handleDownloadAttempt = async () => {
    // Auth gate temporarily disabled.
    // const supabase = createClient();
    // const {
    //   data: { session },
    // } = await supabase.auth.getSession();
    //
    // if (session) {
    //   window.print();
    // } else {
    //   localStorage.setItem("pendingOptimizerResume", JSON.stringify(result));
    //   router.push("/login?callbackUrl=/optimizer");
    // }
    window.print();
  };

  return (
    <>
      {loading && <LoadingScreen title="Optimizing Your Resume" />}
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 relative overflow-hidden font-sans selection:bg-emerald-500/30 print:bg-white print:text-black print:overflow-visible">
        {/* Background Ambience */}
        <div className="fixed inset-0 z-0 pointer-events-none print:hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
        </div>

        <div className="container max-w-5xl px-6 py-16 mx-auto relative z-10 print:p-0 print:m-0 print:max-w-none">
          <div className="text-center mb-16 animate-fade-in-up print:hidden">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-slate-200 backdrop-blur-md mb-6 shadow-xl">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-slate-700">
                Intelligent Rewrite Engine
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              AI Resume{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                Optimizer
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Upload your existing resume and let our AI transform your bullet
              points into punchy, metric-driven achievements that recruiters
              love.
            </p>
          </div>

          {!result ? (
            <Card className="max-w-2xl mx-auto bg-white/70 border-slate-200 shadow-2xl backdrop-blur-xl relative overflow-hidden rounded-none animate-fade-in-up delay-100">
              <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none"></div>

              <CardHeader className="pb-4 border-b border-slate-200 relative z-10">
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Upload Resume
                </CardTitle>
                <CardDescription className="text-slate-600 text-base">
                  Ensure your resume is in a readable PDF format.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 relative z-10">
                {error && (
                  <div className="border border-red-500/30 bg-red-950/20 text-red-300 p-4 rounded-none mb-6 text-sm flex items-center gap-3">
                    <div className="p-1 bg-red-500/20 rounded-full">
                      <Zap className="w-5 h-5 text-red-400" />
                    </div>
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="resume"
                      className="text-sm font-medium text-slate-700"
                    >
                      Current Resume (PDF)
                    </Label>
                    <div className="relative group">
                      <Input
                        id="resume"
                        name="resume"
                        type="file"
                        accept=".pdf"
                        required
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (
                              file.type !== "application/pdf" &&
                              !file.name.toLowerCase().endsWith(".pdf")
                            ) {
                              setError("Please upload a PDF file.");
                              e.target.value = "";
                              setFileName(null);
                            } else {
                              setFileName(file.name);
                              setError(null);
                            }
                          } else {
                            setFileName(null);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        title={fileName || "Upload PDF"}
                      />
                      <div
                        className={`flex items-center justify-center w-full h-24 px-4 transition bg-white/50 border-2 border-dashed rounded-none ${fileName ? "border-emerald-500/50 bg-emerald-500/5" : "border-slate-200 group-hover:border-emerald-500/50 group-hover:bg-emerald-500/5"} text-slate-600 group-hover:text-emerald-600`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <UploadCloud
                            className={`w-6 h-6 ${fileName ? "text-emerald-600" : ""}`}
                          />
                          <span className="text-sm font-medium text-center">
                            {fileName ? (
                              <span className="text-emerald-600 font-semibold">
                                {fileName}
                              </span>
                            ) : (
                              "Click to upload or drag & drop"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="targetJob"
                      className="text-sm font-medium text-slate-700"
                    >
                      Target Job Description{" "}
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ml-1">
                        Highly Recommended
                      </span>
                    </Label>
                    <Textarea
                      id="targetJob"
                      name="targetJob"
                      placeholder="Paste the job description you are applying for. The AI will strategically weave in matching keywords and skills..."
                      className="min-h-[140px] resize-none bg-white/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 rounded-none p-4"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="context"
                      className="text-sm font-medium text-slate-700"
                    >
                      Additional Instructions{" "}
                      <span className="text-slate-400 text-xs font-normal">
                        (Optional)
                      </span>
                    </Label>
                    <Textarea
                      id="context"
                      name="context"
                      placeholder="e.g. Focus more on my leadership experience, keep it strictly under 1 page, switch my tone to be more analytical..."
                      className="min-h-[80px] resize-none bg-white/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 rounded-none p-4"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full h-14 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-none shadow-lg transition-all border-0"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                          Optimizing Resume...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-3 h-5 w-5 text-emerald-100" />
                          Optimize Now
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8 animate-fade-in-up print:space-y-0 print:m-0 print:p-0">
              <div className="flex flex-col gap-6 bg-white/70 border border-slate-200 p-6 sm:p-8 rounded-none backdrop-blur-xl shadow-2xl print:hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div className="text-center sm:text-left w-full sm:w-auto">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center justify-center sm:justify-start gap-2">
                      <Sparkles className="w-6 h-6 text-emerald-600" />
                      Optimization Complete!
                    </h2>
                    <p className="text-slate-600">
                      Your resume has been rewritten for maximum impact.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                    <Button
                      variant="outline"
                      onClick={() => setResult(null)}
                      className="h-11 px-6 bg-white border-slate-200 hover:bg-slate-50 hover:text-emerald-700 text-slate-600 rounded-none transition-all w-full sm:w-auto"
                    >
                      Optimize Another
                    </Button>
                    <Button
                      onClick={handleDownloadAttempt}
                      className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-none shadow-md transition-all border-0 w-full sm:w-auto font-medium"
                    >
                      <Printer className="mr-2 w-4 h-4 opacity-90" />
                      Download PDF
                    </Button>
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm font-semibold text-slate-900 tracking-wide">
                    Choose a Resume Template:
                  </div>
                  <div className="flex w-full sm:w-auto bg-slate-100/50 p-1.5 rounded-none border border-slate-200">
                    <Button
                      variant={templateType === "modern" ? "default" : "ghost"}
                      onClick={() => setTemplateType("modern")}
                      className={`flex-1 sm:px-8 h-9 rounded-none ${templateType === "modern" ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" : "hover:bg-slate-200/50 text-slate-600"}`}
                    >
                      Modern
                    </Button>
                    <Button
                      variant={templateType === "classic" ? "default" : "ghost"}
                      onClick={() => setTemplateType("classic")}
                      className={`flex-1 sm:px-8 h-9 rounded-none ${templateType === "classic" ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" : "hover:bg-slate-200/50 text-slate-600"}`}
                    >
                      Classic
                    </Button>
                    <Button
                      variant={
                        templateType === "minimalist" ? "default" : "ghost"
                      }
                      onClick={() => setTemplateType("minimalist")}
                      className={`flex-1 sm:px-8 h-9 rounded-none ${templateType === "minimalist" ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm" : "hover:bg-slate-200/50 text-slate-600"}`}
                    >
                      Minimalist
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white text-black p-4 sm:p-10 md:p-14 shadow-2xl rounded-none mx-auto max-w-[850px] min-h-[1100px] border border-slate-200 print:shadow-none print:border-none print:p-0 print:m-0 print:w-full print:max-w-none print:min-h-0 print:rounded-none overflow-hidden">
                <ResumePreview data={result} template={templateType} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
