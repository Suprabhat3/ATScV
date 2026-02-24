"use client";

import { BackgroundAmbience } from "@/components/landing/background-ambience";
import { LoadingScreen } from "@/components/loading-screen";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { generateResumeContent } from "./actions";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Sparkles,
  Printer,
  FileText,
  User,
  GraduationCap,
  Lightbulb,
  Plus,
  Trash2,
  FolderGit2,
  Check,
} from "lucide-react";
// import { useRouter } from "next/navigation";
import { ResumePreview } from "@/components/resume-preview";
// import { createClient } from "@/utils/supabase/client";

export default function BuilderPage() {
  // const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templateType, setTemplateType] = useState<
    "modern" | "classic" | "minimalist"
  >("modern");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    personal: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      targetRole: "",
      linkedin: "",
      portfolio: "",
      github: "",
    },
    experience: [
      { role: "", company: "", startDate: "", endDate: "", description: "" },
    ],
    education: [{ degree: "", institution: "", startDate: "", endDate: "" }],
    projects: [{ name: "", description: "", liveLink: "", githubLink: "" }],
    skills: [""],
  });

  const [generatedResume, setGeneratedResume] = useState<any>(null);

  useEffect(() => {
    const pendingResume = localStorage.getItem("pendingBuilderResume");
    if (pendingResume) {
      try {
        setGeneratedResume(JSON.parse(pendingResume));
        setStep(6);
        localStorage.removeItem("pendingBuilderResume");
      } catch (e) {}
    }
  }, []);

  const handleNext = () => setStep((s) => s + 1);
  const handlePrev = () => setStep((s) => s - 1);

  const handlePersonalNext = () => {
    const errors: Record<string, string> = {};
    const { email, linkedin, portfolio, github } = formData.personal;

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (linkedin && !linkedin.startsWith("https://")) {
      errors.linkedin = "Link must start with https://";
    }
    if (portfolio && !portfolio.startsWith("https://")) {
      errors.portfolio = "Link must start with https://";
    }
    if (github && !github.startsWith("https://")) {
      errors.github = "Link must start with https://";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    handleNext();
  };

  const handleChange = (section: string, field: string, value: string) => {
    if (section === "personal") {
      setFormData((prev) => ({
        ...prev,
        personal: { ...prev.personal, [field]: value },
      }));
      if (fieldErrors[field]) {
        setFieldErrors((prev) => ({ ...prev, [field]: "" }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [section]: value }));
    }
  };

  const handleExperienceChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const newExp = [...formData.experience];
    newExp[index] = { ...newExp[index], [field]: value } as any;
    setFormData((prev) => ({ ...prev, experience: newExp }));
  };
  const addExperience = () =>
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { role: "", company: "", startDate: "", endDate: "", description: "" },
      ],
    }));
  const removeExperience = (index: number) =>
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));

  const handleEducationChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const newEdu = [...formData.education];
    newEdu[index] = { ...newEdu[index], [field]: value } as any;
    setFormData((prev) => ({ ...prev, education: newEdu }));
  };
  const addEducation = () =>
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: "", institution: "", startDate: "", endDate: "" },
      ],
    }));
  const removeEducation = (index: number) =>
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));

  const handleProjectChange = (index: number, field: string, value: string) => {
    const newProj = [...formData.projects];
    newProj[index] = { ...newProj[index], [field]: value } as any;
    setFormData((prev) => ({ ...prev, projects: newProj }));
  };
  const addProject = () =>
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { name: "", description: "", liveLink: "", githubLink: "" },
      ],
    }));
  const removeProject = (index: number) =>
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...formData.skills];
    newSkills[index] = value;
    setFormData((prev) => ({ ...prev, skills: newSkills }));
  };
  const addSkill = () =>
    setFormData((prev) => ({ ...prev, skills: [...prev.skills, ""] }));
  const removeSkill = (index: number) =>
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    const res = await generateResumeContent(formData);
    if (res.error) {
      setError(res.error);
    } else {
      setGeneratedResume({ ...formData.personal, ...res.aiGeneratedResume });
      setStep(6);
    }
    setLoading(false);
  };

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
    //   localStorage.setItem(
    //     "pendingBuilderResume",
    //     JSON.stringify(generatedResume),
    //   );
    //   router.push("/login?callbackUrl=/builder");
    // }
    window.print();
  };

  return (
    <>
      {loading && <LoadingScreen />}
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 relative overflow-hidden font-sans selection:bg-emerald-500/30 print:bg-white print:text-black print:overflow-visible">
        {/* Background Ambience */}
        <div className="fixed inset-0 z-0 pointer-events-none print:hidden">
          <div className="absolute top-0 right-1/4 w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[150px]" />
          <div className="absolute bottom-0 left-1/4 w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[150px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
        </div>

        <div className="container max-w-4xl px-4 py-16 mx-auto relative z-10 print:p-0 print:m-0 print:max-w-none">
          {step < 6 && (
            <div className="mb-12 text-center animate-fade-in-up print:hidden">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900">
                AI Resume Builder
              </h1>

              <div className="flex items-center justify-between w-full mt-8 max-w-xl mx-auto px-4 sm:px-0">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`flex items-center ${i < 5 ? "w-full" : ""}`}
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 text-sm sm:text-lg rounded-none font-bold transition-all duration-300 flex-shrink-0 relative z-10
                        ${
                          step === i
                            ? "bg-emerald-600 text-white shadow-lg"
                            : step > i
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "bg-white/80 text-slate-400 border-2 border-slate-200"
                        }`}
                    >
                      {step > i ? (
                        <Check className="w-4 h-4 sm:w-6 sm:h-6 text-white stroke-[3]" />
                      ) : (
                        i
                      )}
                    </div>
                    {i < 5 && (
                      <div
                        className={`h-[3px] w-full transition-all duration-300 mx-1 sm:mx-3
                          ${step > i ? "bg-emerald-600" : "bg-slate-200"}`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="border border-red-500/30 bg-red-950/20 text-red-300 p-4 rounded-none mb-8 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {step === 1 && (
            <Card className="bg-white/70 border-slate-200 shadow-2xl backdrop-blur-xl relative overflow-hidden rounded-none animate-fade-in-up">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none"></div>

              <CardHeader className="pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/20 rounded-none text-emerald-600 ring-1 ring-emerald-500/30">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900">
                      Personal Details
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Let's start with your contact information.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-8 space-y-6">
                <div className="space-y-2 relative">
                  <Label className="text-sm font-medium text-slate-700 ml-1">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.personal.fullName}
                    onChange={(e) =>
                      handleChange("personal", "fullName", e.target.value)
                    }
                    placeholder="John Doe"
                    className="h-12 bg-white/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 rounded-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 relative">
                    <Label className="text-sm font-medium text-slate-700 ml-1">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.personal.email}
                      onChange={(e) =>
                        handleChange("personal", "email", e.target.value)
                      }
                      placeholder="john@example.com"
                      type="email"
                      className={`h-12 bg-white/50 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 rounded-none ${fieldErrors.email ? "border-red-500 bg-red-50" : "border-slate-200"}`}
                    />
                    {fieldErrors.email && (
                      <p className="text-xs text-red-500 font-medium absolute -bottom-5 left-1">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 relative">
                    <Label className="text-sm font-medium text-slate-700 ml-1">
                      Phone <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.personal.phone}
                      onChange={(e) =>
                        handleChange("personal", "phone", e.target.value)
                      }
                      placeholder="(555) 123-4567"
                      className="h-12 bg-white/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 rounded-none"
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <Label className="text-sm font-medium text-slate-700 ml-1">
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.personal.location}
                      onChange={(e) =>
                        handleChange("personal", "location", e.target.value)
                      }
                      placeholder="New York, NY"
                      className="h-12 bg-white/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 rounded-none"
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <Label className="text-sm font-medium text-slate-700 ml-1">
                      Target Role <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.personal.targetRole}
                      onChange={(e) =>
                        handleChange("personal", "targetRole", e.target.value)
                      }
                      placeholder="Software Engineer"
                      className="h-12 bg-white/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 rounded-none"
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <Label className="text-sm font-medium text-slate-700 ml-1">
                      LinkedIn{" "}
                      <span className="text-slate-400 text-xs font-normal">
                        (Optional)
                      </span>
                    </Label>
                    <Input
                      value={formData.personal.linkedin}
                      onChange={(e) =>
                        handleChange("personal", "linkedin", e.target.value)
                      }
                      placeholder="https://linkedin.com/in/johndoe"
                      className={`h-12 bg-white/50 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 rounded-none ${fieldErrors.linkedin ? "border-red-500 bg-red-50" : "border-slate-200"}`}
                    />
                    {fieldErrors.linkedin && (
                      <p className="text-xs text-red-500 font-medium absolute -bottom-5 left-1">
                        {fieldErrors.linkedin}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 relative">
                    <Label className="text-sm font-medium text-slate-700 ml-1">
                      Portfolio / Website{" "}
                      <span className="text-slate-400 text-xs font-normal">
                        (Optional)
                      </span>
                    </Label>
                    <Input
                      value={formData.personal.portfolio}
                      onChange={(e) =>
                        handleChange("personal", "portfolio", e.target.value)
                      }
                      placeholder="https://johndoe.com"
                      className={`h-12 bg-white/50 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 rounded-none ${fieldErrors.portfolio ? "border-red-500 bg-red-50" : "border-slate-200"}`}
                    />
                    {fieldErrors.portfolio && (
                      <p className="text-xs text-red-500 font-medium absolute -bottom-5 left-1">
                        {fieldErrors.portfolio}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 relative md:col-span-2">
                    <Label className="text-sm font-medium text-slate-700 ml-1">
                      GitHub{" "}
                      <span className="text-slate-400 text-xs font-normal">
                        (Optional)
                      </span>
                    </Label>
                    <Input
                      value={formData.personal.github}
                      onChange={(e) =>
                        handleChange("personal", "github", e.target.value)
                      }
                      placeholder="https://github.com/johndoe"
                      className={`h-12 bg-white/50 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 rounded-none ${fieldErrors.github ? "border-red-500 bg-red-50" : "border-slate-200"}`}
                    />
                    {fieldErrors.github && (
                      <p className="text-xs text-red-500 font-medium absolute -bottom-5 left-1">
                        {fieldErrors.github}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-end border-t border-slate-200 pt-6 pb-6 w-full">
                <Button
                  onClick={handlePersonalNext}
                  disabled={
                    !formData.personal.fullName ||
                    !formData.personal.email ||
                    !formData.personal.phone ||
                    !formData.personal.location ||
                    !formData.personal.targetRole
                  }
                  className="h-12 px-8 text-base bg-emerald-600 hover:bg-emerald-700 text-white rounded-none shadow-lg border-0 transition-all font-semibold w-full sm:w-auto"
                >
                  Next Step <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 2 && (
            <Card className="bg-white/70 border-slate-200 shadow-2xl backdrop-blur-xl relative overflow-hidden rounded-none animate-fade-in-up">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none"></div>

              <CardHeader className="pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/20 rounded-none text-emerald-600 ring-1 ring-emerald-500/30">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900">
                      Experience Details
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Just drop your raw experience below. Our AI does the
                      formatting.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-8 space-y-6">
                {formData.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="p-6 border border-slate-200 bg-white/50 relative rounded-none space-y-4 shadow-sm group transition-all"
                  >
                    {formData.experience.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExperience(index)}
                        className="absolute right-2 top-2 text-red-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-none"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 ml-1">
                          Job Title
                        </Label>
                        <Input
                          value={exp.role}
                          onChange={(e) =>
                            handleExperienceChange(
                              index,
                              "role",
                              e.target.value,
                            )
                          }
                          placeholder="Software Engineer"
                          className="h-12 bg-white/70 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 rounded-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 ml-1">
                          Company
                        </Label>
                        <Input
                          value={exp.company}
                          onChange={(e) =>
                            handleExperienceChange(
                              index,
                              "company",
                              e.target.value,
                            )
                          }
                          placeholder="Tech Corp Inc."
                          className="h-12 bg-white/70 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 rounded-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 ml-1">
                          Start Date
                        </Label>
                        <Input
                          type="month"
                          value={exp.startDate}
                          onChange={(e) =>
                            handleExperienceChange(
                              index,
                              "startDate",
                              e.target.value,
                            )
                          }
                          className="h-12 bg-white/70 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 rounded-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 ml-1">
                          End Date{" "}
                          <span className="text-slate-400 text-xs font-normal">
                            (Leave empty if current)
                          </span>
                        </Label>
                        <Input
                          type="month"
                          value={exp.endDate}
                          onChange={(e) =>
                            handleExperienceChange(
                              index,
                              "endDate",
                              e.target.value,
                            )
                          }
                          className="h-12 bg-white/70 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 rounded-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700 ml-1">
                        Description / Achievements
                      </Label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) =>
                          handleExperienceChange(
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="e.g. Managed a team of 5 developers and improved load speeds by 20%..."
                        className="min-h-[120px] resize-none bg-white/70 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 rounded-none p-4"
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addExperience}
                  className="w-full border-dashed border-2 border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-500 hover:bg-emerald-50 h-14 rounded-none transition-all"
                >
                  <Plus className="w-5 h-5 mr-2" /> Add Another Experience
                </Button>
              </CardContent>
              <CardFooter className="flex flex-col-reverse sm:flex-row justify-between border-t border-slate-200 pt-6 pb-6 gap-4 sm:gap-0 w-full">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  className="h-12 px-6 bg-white/70 border-slate-200 hover:bg-slate-100 hover:text-emerald-700 text-slate-600 rounded-none w-full sm:w-auto"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" /> Go Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="h-12 px-8 text-base bg-emerald-600 hover:bg-emerald-700 text-white rounded-none shadow-lg border-0 font-semibold w-full sm:w-auto"
                >
                  Next Step <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 3 && (
            <Card className="bg-white/70 border-slate-200 shadow-2xl backdrop-blur-xl relative overflow-hidden rounded-none animate-fade-in-up">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none"></div>

              <CardHeader className="pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/20 rounded-none text-emerald-600 ring-1 ring-emerald-500/30">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900">
                      Education History
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Degrees, universities, bootcamps and certifications.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-8 space-y-6">
                {formData.education.map((edu, index) => (
                  <div
                    key={index}
                    className="p-6 border border-slate-200 bg-white/50 relative rounded-none space-y-4 shadow-sm group transition-all"
                  >
                    {formData.education.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEducation(index)}
                        className="absolute right-2 top-2 text-red-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-none"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 ml-1">
                          Degree / Certificate
                        </Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) =>
                            handleEducationChange(
                              index,
                              "degree",
                              e.target.value,
                            )
                          }
                          placeholder="B.S. Computer Science"
                          className="h-12 bg-white/70 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 rounded-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 ml-1">
                          Institution
                        </Label>
                        <Input
                          value={edu.institution}
                          onChange={(e) =>
                            handleEducationChange(
                              index,
                              "institution",
                              e.target.value,
                            )
                          }
                          placeholder="MIT"
                          className="h-12 bg-white/70 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 rounded-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 ml-1">
                          Start Date
                        </Label>
                        <Input
                          type="month"
                          value={edu.startDate}
                          onChange={(e) =>
                            handleEducationChange(
                              index,
                              "startDate",
                              e.target.value,
                            )
                          }
                          className="h-12 bg-white/70 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 rounded-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 ml-1">
                          End Date{" "}
                          <span className="text-slate-400 text-xs font-normal">
                            (Or expected)
                          </span>
                        </Label>
                        <Input
                          type="month"
                          value={edu.endDate}
                          onChange={(e) =>
                            handleEducationChange(
                              index,
                              "endDate",
                              e.target.value,
                            )
                          }
                          className="h-12 bg-white/70 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 rounded-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addEducation}
                  className="w-full border-dashed border-2 border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-500 hover:bg-emerald-50 h-14 rounded-none transition-all"
                >
                  <Plus className="w-5 h-5 mr-2" /> Add Another Education
                </Button>
              </CardContent>
              <CardFooter className="flex flex-col-reverse sm:flex-row justify-between border-t border-slate-200 pt-6 pb-6 gap-4 sm:gap-0 w-full">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  className="h-12 px-6 bg-white/70 border-slate-200 hover:bg-slate-100 hover:text-emerald-700 text-slate-600 rounded-none w-full sm:w-auto"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" /> Go Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="h-12 px-8 text-base bg-emerald-600 hover:bg-emerald-700 text-white rounded-none shadow-lg border-0 font-semibold w-full sm:w-auto"
                >
                  Next Step <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 4 && (
            <Card className="bg-white/70 border-slate-200 shadow-2xl backdrop-blur-xl relative overflow-hidden rounded-none animate-fade-in-up">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none"></div>

              <CardHeader className="pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/20 rounded-none text-emerald-600 ring-1 ring-emerald-500/30">
                    <FolderGit2 className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900">
                      Projects
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Highlight your best work with links to live demos or code.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-8 space-y-6">
                {formData.projects.map((proj, index) => (
                  <div
                    key={index}
                    className="p-6 border border-slate-200 bg-white/50 relative rounded-none space-y-4 shadow-sm group transition-all"
                  >
                    {formData.projects.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeProject(index)}
                        className="absolute right-2 top-2 text-red-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-none"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 ml-1">
                          Project Name
                        </Label>
                        <Input
                          value={proj.name}
                          onChange={(e) =>
                            handleProjectChange(index, "name", e.target.value)
                          }
                          placeholder="E-commerce Dashboard"
                          className="h-12 bg-white/70 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 rounded-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 ml-1">
                          Description
                        </Label>
                        <Textarea
                          value={proj.description}
                          onChange={(e) =>
                            handleProjectChange(
                              index,
                              "description",
                              e.target.value,
                            )
                          }
                          placeholder="e.g. A full-stack admin dashboard for managing products, orders, and analytics."
                          className="min-h-[80px] resize-none bg-white/70 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 rounded-none p-4"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700 ml-1">
                            Live Link{" "}
                            <span className="text-slate-400 text-xs font-normal">
                              (Optional)
                            </span>
                          </Label>
                          <Input
                            value={proj.liveLink}
                            onChange={(e) =>
                              handleProjectChange(
                                index,
                                "liveLink",
                                e.target.value,
                              )
                            }
                            placeholder="https://mycoolproject.com"
                            className="h-12 bg-white/70 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 rounded-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-700 ml-1">
                            GitHub Link{" "}
                            <span className="text-slate-400 text-xs font-normal">
                              (Optional)
                            </span>
                          </Label>
                          <Input
                            value={proj.githubLink}
                            onChange={(e) =>
                              handleProjectChange(
                                index,
                                "githubLink",
                                e.target.value,
                              )
                            }
                            placeholder="https://github.com/myusername/repo"
                            className="h-12 bg-white/70 border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 rounded-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addProject}
                  className="w-full border-dashed border-2 border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-500 hover:bg-emerald-50 h-14 rounded-none transition-all"
                >
                  <Plus className="w-5 h-5 mr-2" /> Add Another Project
                </Button>
              </CardContent>
              <CardFooter className="flex flex-col-reverse sm:flex-row justify-between border-t border-slate-200 pt-6 pb-6 gap-4 sm:gap-0 w-full">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  className="h-12 px-6 bg-white/70 border-slate-200 hover:bg-slate-100 hover:text-emerald-700 text-slate-600 rounded-none w-full sm:w-auto"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" /> Go Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="h-12 px-8 text-base bg-emerald-600 hover:bg-emerald-700 text-white rounded-none shadow-lg border-0 font-semibold w-full sm:w-auto"
                >
                  Next Step <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 5 && (
            <Card className="bg-white/70 border-slate-200 shadow-2xl backdrop-blur-xl relative overflow-hidden rounded-none animate-fade-in-up">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none"></div>

              <CardHeader className="pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/20 rounded-none text-emerald-600 ring-1 ring-emerald-500/30">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900">
                      Skills Matrix
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      List core skills separately by commas. (Last step!)
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="flex flex-wrap gap-4 mb-8">
                  {formData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-white/70 border border-slate-200 w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] rounded-none group focus-within:ring-2 focus-within:ring-emerald-500/50 focus-within:border-emerald-500/50 transition-all"
                    >
                      <Input
                        value={skill}
                        onChange={(e) =>
                          handleSkillChange(index, e.target.value)
                        }
                        placeholder={`Skill ${index + 1}`}
                        className="h-12 border-none bg-transparent focus-visible:ring-0 shadow-none px-4 rounded-none w-full text-slate-900 placeholder:text-slate-400"
                      />
                      {formData.skills.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSkill(index)}
                          className="text-slate-300 hover:text-red-500 hover:bg-transparent rounded-none flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSkill}
                  className="w-full border-dashed border-2 border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-500 hover:bg-emerald-50 h-14 rounded-none transition-all"
                >
                  <Plus className="w-5 h-5 mr-2" /> Add Another Skill
                </Button>
              </CardContent>
              <CardFooter className="flex flex-col-reverse sm:flex-row justify-between border-t border-slate-200 pt-6 pb-6 gap-4 sm:gap-0 w-full">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={loading}
                  className="h-12 px-6 bg-white/70 border-slate-200 hover:bg-slate-100 hover:text-emerald-700 text-slate-600 rounded-none w-full sm:w-auto"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" /> Go Back
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="h-12 px-8 text-base bg-emerald-600 hover:bg-emerald-700 text-white rounded-none shadow-lg border-0 font-bold transition-all hover:scale-[1.02] w-full sm:w-auto"
                >
                  {loading ? (
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  ) : (
                    <Sparkles className="mr-3 h-5 w-5 text-emerald-100" />
                  )}
                  {loading ? "AI is Generating..." : "Generate Magic"}
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 6 && generatedResume && (
            <div className="space-y-8 animate-fade-in-up print:space-y-0 print:m-0 print:p-0">
              <div className="flex flex-col gap-6 bg-white/70 border border-slate-200 p-6 sm:p-8 rounded-none backdrop-blur-xl shadow-2xl print:hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div className="text-center sm:text-left w-full sm:w-auto">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center justify-center sm:justify-start gap-2">
                      <Sparkles className="w-6 h-6 text-emerald-600" />
                      Your AI-Optimized Resume
                    </h2>
                    <p className="text-slate-600">
                      Ready to stand out? Review below or download directly.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
                    <Button
                      variant="outline"
                      onClick={() => setStep(4)}
                      className="h-11 px-6 bg-white border-slate-200 hover:bg-slate-50 hover:text-emerald-700 text-slate-600 rounded-none transition-all w-full sm:w-auto"
                    >
                      Edit Details
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

              {/* Visual Document Preview */}
              <div className="bg-white text-black p-4 sm:p-10 md:p-14 shadow-2xl rounded-none mx-auto max-w-[850px] min-h-[1100px] border border-slate-200 print:shadow-none print:border-none print:p-0 print:m-0 print:w-full print:max-w-none print:min-h-0 print:rounded-none overflow-hidden">
                <ResumePreview data={generatedResume} template={templateType} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
