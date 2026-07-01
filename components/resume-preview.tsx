import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";

export function ResumePreview({
  data,
  template = "modern",
  fontScale = 1,
}: {
  data: any;
  template?: string;
  fontScale?: number;
}) {
  if (!data) return null;

  const safeScale = Math.min(Math.max(fontScale, 0.8), 1.05);
  const scaledPreviewStyle = {
    width: "100%",
    zoom: safeScale,
  };

  if (template === "classic") {
    return (
      <div style={scaledPreviewStyle}>
        <ClassicTemplate data={data} />
      </div>
    );
  }

  if (template === "minimalist") {
    return (
      <div style={scaledPreviewStyle}>
        <MinimalistTemplate data={data} />
      </div>
    );
  }

  if (template === "executive") {
    return (
      <div style={scaledPreviewStyle}>
        <ExecutiveTemplate data={data} />
      </div>
    );
  }

  if (template === "compact") {
    return (
      <div style={scaledPreviewStyle}>
        <CompactTemplate data={data} />
      </div>
    );
  }

  return (
    <div style={scaledPreviewStyle}>
      <ModernTemplate data={data} />
    </div>
  );
}

function ModernTemplate({ data }: { data: any }) {
  return (
    <div className="font-sans text-[11pt] leading-snug">
      {/* Header */}
      <div className="text-center mb-4 border-b-[3px] border-emerald-800 pb-3">
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-[0.1em] text-zinc-900 mb-1 break-words">
          {data.fullName || "Your Name"}
        </h1>
        {data.targetRole && (
          <p className="text-base sm:text-lg text-emerald-800 font-semibold tracking-wide mb-3">
            {data.targetRole}
          </p>
        )}
        <div className="text-xs text-zinc-600 flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mt-2 px-2">
          {data.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> <span>{data.email}</span>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> <span>{data.phone}</span>
            </div>
          )}
          {data.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> <span>{data.location}</span>
            </div>
          )}
        </div>
        {(data.linkedin || data.github || data.portfolio) && (
          <div className="text-xs text-zinc-600 flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mt-2">
            {data.linkedin && (
              <div className="flex items-center gap-1">
                <Linkedin className="w-3.5 h-3.5" />{" "}
                <a
                  href={
                    data.linkedin.startsWith("http")
                      ? data.linkedin
                      : `https://${data.linkedin}`
                  }
                  className="hover:text-emerald-700 transition"
                  target="_blank"
                  rel="noreferrer"
                >
                  {data.linkedin.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              </div>
            )}
            {data.github && (
              <div className="flex items-center gap-1">
                <Github className="w-3.5 h-3.5" />{" "}
                <a
                  href={
                    data.github.startsWith("http")
                      ? data.github
                      : `https://${data.github}`
                  }
                  className="hover:text-emerald-700 transition"
                  target="_blank"
                  rel="noreferrer"
                >
                  {data.github.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              </div>
            )}
            {data.portfolio && (
              <div className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />{" "}
                <a
                  href={
                    data.portfolio.startsWith("http")
                      ? data.portfolio
                      : `https://${data.portfolio}`
                  }
                  className="hover:text-emerald-700 transition"
                  target="_blank"
                  rel="noreferrer"
                >
                  {data.portfolio.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-800 border-b border-zinc-300 pb-1 mb-2 flex items-center">
            Professional Summary
          </h2>
          <p className="text-[10.5pt] text-zinc-800 leading-relaxed text-justify">
            {data.summary}
          </p>
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-800 border-b border-zinc-300 pb-1 mb-2">
            Education
          </h2>
          <div className="space-y-3 sm:space-y-2">
            {data.education.map((edu: any, i: number) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row justify-between items-start"
              >
                <div className="w-full sm:w-auto">
                  <h3 className="font-bold text-[11pt] text-zinc-900 leading-tight mb-0.5 break-words">
                    {edu.degree}
                  </h3>
                  <div className="text-[10.5pt] text-zinc-700 break-words">
                    {edu.institution}
                  </div>
                </div>
                {edu.year && (
                  <span className="text-[10px] sm:text-xs text-emerald-700 font-semibold uppercase tracking-wider mt-1 sm:mt-0.5 whitespace-nowrap">
                    {edu.year}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div className="mb-2">
          <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-800 border-b border-zinc-300 pb-1 mb-2">
            Skills & Expertise
          </h2>
          <p className="text-[10.5pt] text-zinc-800 leading-relaxed">
            {Array.isArray(data.skills) ? data.skills.join(" • ") : data.skills}
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-800 border-b border-zinc-300 pb-1 mb-2">
            Professional Experience
          </h2>
          <div className="space-y-4 sm:space-y-3">
            {data.experience.map((exp: any, i: number) => (
              <div key={i}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline mb-1 sm:mb-0.5">
                  <h3 className="font-bold text-[11.5pt] text-zinc-900 break-words w-full sm:w-auto">
                    {exp.role}
                  </h3>
                  <span className="text-[10px] sm:text-xs text-emerald-700 font-semibold uppercase tracking-wider whitespace-nowrap mt-0.5 sm:mt-0">
                    {exp.duration}
                  </span>
                </div>
                <div className="text-[10.5pt] font-medium text-zinc-700 mb-2 break-words">
                  {exp.company}
                </div>
                <ul className="list-outside list-disc pl-4 space-y-1.5 marker:text-emerald-500">
                  {exp.bullets?.map((bullet: string, j: number) => (
                    <li
                      key={j}
                      className="text-[10.5pt] text-zinc-800 pl-1 leading-relaxed text-justify"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-800 border-b border-zinc-300 pb-1 mb-2">
            Projects
          </h2>
          <div className="space-y-4 sm:space-y-3">
            {data.projects.map((proj: any, i: number) => (
              <div key={i}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline mb-1 sm:mb-0.5 gap-2 sm:gap-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <h3 className="font-bold text-[11.5pt] text-zinc-900 wrap-break-word">
                      {proj.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {proj.liveLink && (
                        <a
                          href={
                            proj.liveLink.startsWith("http")
                              ? proj.liveLink
                              : `https://${proj.liveLink}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="text-zinc-500 hover:text-emerald-600 transition flex items-center gap-1 text-[10px] font-semibold tracking-wider"
                        >
                          <Globe className="w-3 h-3" /> Live View
                        </a>
                      )}
                      {proj.githubLink && (
                        <a
                          href={
                            proj.githubLink.startsWith("http")
                              ? proj.githubLink
                              : `https://${proj.githubLink}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="text-zinc-500 hover:text-emerald-600 transition flex items-center gap-1 text-[10px] font-semibold tracking-wider"
                        >
                          <Github className="w-3 h-3" /> CODE
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                {proj.description && (
                  <div className="text-[10.5pt] font-medium text-zinc-700 mb-2">
                    {proj.description}
                  </div>
                )}
                <ul className="list-outside list-disc pl-4 space-y-1.5 marker:text-emerald-500">
                  {proj.bullets?.map((bullet: string, j: number) => (
                    <li
                      key={j}
                      className="text-[10.5pt] text-zinc-800 pl-1 leading-relaxed text-justify"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// CLASSIC TEMPLATE (Serif, strict professional layout)
// ----------------------------------------------------
function ClassicTemplate({ data }: { data: any }) {
  const allLinks = [];
  if (data.email) allLinks.push(data.email);
  if (data.phone) allLinks.push(data.phone);
  if (data.location) allLinks.push(data.location);
  if (data.linkedin)
    allLinks.push(data.linkedin.replace(/^https?:\/\/(www\.)?/, ""));
  if (data.github)
    allLinks.push(data.github.replace(/^https?:\/\/(www\.)?/, ""));
  if (data.portfolio)
    allLinks.push(data.portfolio.replace(/^https?:\/\/(www\.)?/, ""));

  return (
    <div className="font-serif text-[11pt] leading-snug text-black">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-4xl text-black mb-2 uppercase break-words">
          {data.fullName || "Your Name"}
        </h1>
        <div className="text-[9pt] sm:text-[10pt] text-zinc-800 mt-2 px-2 flex flex-wrap justify-center items-center">
          {allLinks.map((item, idx) => (
            <span key={idx}>
              {item}
              {idx < allLinks.length - 1 && <span className="mx-2">|</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b-2 border-black pb-1 mb-2 text-black">
            Professional Summary
          </h2>
          <p className="text-[10.5pt] text-black leading-relaxed text-justify">
            {data.summary}
          </p>
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b-2 border-black pb-1 mb-2 text-black">
            Education
          </h2>
          <div className="space-y-2">
            {data.education.map((edu: any, i: number) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row justify-between items-start"
              >
                <div>
                  <h3 className="font-bold text-[11pt] text-black">
                    {edu.institution}
                  </h3>
                  <div className="text-[10.5pt] italic text-black">
                    {edu.degree}
                  </div>
                </div>
                {edu.year && (
                  <span className="text-[10.5pt] text-black whitespace-nowrap">
                    {edu.year}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div className="mb-2">
          <h2 className="text-sm font-bold uppercase border-b-2 border-black pb-1 mb-2 text-black">
            Skills
          </h2>
          <p className="text-[10.5pt] text-black leading-relaxed">
            {Array.isArray(data.skills) ? data.skills.join(", ") : data.skills}
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b-2 border-black pb-1 mb-2 text-black">
            Experience
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp: any, i: number) => (
              <div key={i}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline">
                  <h3 className="font-bold text-[11.5pt] text-black">
                    {exp.company}
                  </h3>
                  <span className="text-[10.5pt] text-black whitespace-nowrap">
                    {exp.duration}
                  </span>
                </div>
                <div className="text-[10.5pt] italic text-zinc-800 mb-2">
                  {exp.role}
                </div>
                <ul className="list-outside list-disc pl-5 space-y-1">
                  {exp.bullets?.map((bullet: string, j: number) => (
                    <li
                      key={j}
                      className="text-[10.5pt] text-black leading-relaxed text-justify"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase border-b-2 border-black pb-1 mb-2 text-black">
            Projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((proj: any, i: number) => (
              <div key={i}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline">
                  <div className="flex gap-2 items-baseline flex-wrap">
                    <h3 className="font-bold text-[11.5pt] text-black">
                      {proj.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 ml-2">
                      {proj.liveLink && (
                        <a
                          href={
                            proj.liveLink.startsWith("http")
                              ? proj.liveLink
                              : `https://${proj.liveLink}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="text-zinc-600 hover:text-black transition flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase"
                        >
                          <Globe className="w-3 h-3" /> Live
                        </a>
                      )}
                      {proj.githubLink && (
                        <a
                          href={
                            proj.githubLink.startsWith("http")
                              ? proj.githubLink
                              : `https://${proj.githubLink}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="text-zinc-600 hover:text-black transition flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase"
                        >
                          <Github className="w-3 h-3" /> Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                {proj.description && (
                  <div className="text-[10.5pt] italic text-zinc-800 mb-2">
                    {proj.description}
                  </div>
                )}
                <ul className="list-outside list-disc pl-5 space-y-1">
                  {proj.bullets?.map((bullet: string, j: number) => (
                    <li
                      key={j}
                      className="text-[10.5pt] text-black leading-relaxed text-justify"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// MINIMALIST TEMPLATE (Clean, simple, sans-serif)
// ----------------------------------------------------
function MinimalistTemplate({ data }: { data: any }) {
  return (
    <div className="font-sans text-[10.5pt] leading-relaxed text-zinc-800">
      {/* Header */}
      <div className="mb-6 text-left">
        <h1 className="text-4xl font-light text-zinc-900 mb-2 break-words">
          {data.fullName || "Your Name"}
        </h1>
        {data.targetRole && (
          <p className="text-lg text-zinc-500 mb-4">{data.targetRole}</p>
        )}
        <div className="text-[9.5pt] text-zinc-500 flex flex-wrap gap-x-6 gap-y-2">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.location && <span>{data.location}</span>}
          {data.linkedin && (
            <span>{data.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>
          )}
          {data.github && (
            <span>{data.github.replace(/^https?:\/\/(www\.)?/, "")}</span>
          )}
          {data.portfolio && (
            <span>{data.portfolio.replace(/^https?:\/\/(www\.)?/, "")}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        {/* Summary */}
        {data.summary && (
          <div className="mb-6">
            <p className="text-zinc-700 text-justify">{data.summary}</p>
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu: any, i: number) => (
                <div key={i}>
                  <h3 className="font-medium text-zinc-900">{edu.degree}</h3>
                  <div className="text-zinc-500 text-sm mt-0.5">
                    {edu.institution}
                  </div>
                  <div className="text-zinc-400 text-xs mt-0.5">
                    {edu.year}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
              Skills
            </h2>
            <div className="flex flex-col gap-1">
              {Array.isArray(data.skills) ? (
                data.skills.map((s: string, i: number) => (
                  <span key={i} className="text-zinc-700">
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-zinc-700">{data.skills}</span>
              )}
            </div>
          </div>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4 border-b border-zinc-200 pb-1">
              Experience
            </h2>
            <div className="space-y-5">
              {data.experience.map((exp: any, i: number) => (
                <div key={i}>
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-[12pt] text-zinc-900">
                        {exp.role}
                      </h3>
                      <div className="text-zinc-500">{exp.company}</div>
                    </div>
                    <span className="text-zinc-400 text-sm mt-1 sm:mt-0 whitespace-nowrap">
                      {exp.duration}
                    </span>
                  </div>
                  <ul className="list-inside list-disc space-y-2 marker:text-zinc-300">
                    {exp.bullets?.map((bullet: string, j: number) => (
                      <li
                        key={j}
                        className="text-zinc-700 leading-relaxed text-justify"
                      >
                        <span className="relative -left-2">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4 border-b border-zinc-200 pb-1">
              Projects
            </h2>
            <div className="space-y-5">
              {data.projects.map((proj: any, i: number) => (
                <div key={i}>
                  <div className="mb-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-medium text-[12pt] text-zinc-900">
                        {proj.name}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {proj.liveLink && (
                          <a
                            href={
                              proj.liveLink.startsWith("http")
                                ? proj.liveLink
                                : `https://${proj.liveLink}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="text-zinc-400 hover:text-zinc-700 transition flex items-center gap-1 text-[11px]"
                          >
                            <Globe className="w-3.5 h-3.5" /> Live
                          </a>
                        )}
                        {proj.githubLink && (
                          <a
                            href={
                              proj.githubLink.startsWith("http")
                                ? proj.githubLink
                                : `https://${proj.githubLink}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="text-zinc-400 hover:text-zinc-700 transition flex items-center gap-1 text-[11px]"
                          >
                            <Github className="w-3.5 h-3.5" /> Code
                          </a>
                        )}
                      </div>
                    </div>
                    {proj.description && (
                      <div className="text-zinc-500 mt-1">
                        {proj.description}
                      </div>
                    )}
                  </div>
                  <ul className="list-inside list-disc space-y-2 marker:text-zinc-300">
                    {proj.bullets?.map((bullet: string, j: number) => (
                      <li
                        key={j}
                        className="text-zinc-700 leading-relaxed text-justify"
                      >
                        <span className="relative -left-2">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// EXECUTIVE TEMPLATE (Bold dark header band, senior/leadership feel)
// ----------------------------------------------------
function ExecutiveTemplate({ data }: { data: any }) {
  const allLinks = [];
  if (data.email) allLinks.push(data.email);
  if (data.phone) allLinks.push(data.phone);
  if (data.location) allLinks.push(data.location);
  if (data.linkedin)
    allLinks.push(data.linkedin.replace(/^https?:\/\/(www\.)?/, ""));
  if (data.github)
    allLinks.push(data.github.replace(/^https?:\/\/(www\.)?/, ""));
  if (data.portfolio)
    allLinks.push(data.portfolio.replace(/^https?:\/\/(www\.)?/, ""));

  return (
    <div className="font-sans text-[11pt] leading-snug text-zinc-800">
      {/* Header band */}
      <div className="bg-zinc-900 text-white px-6 py-5 -mx-6 -mt-6 mb-5 sm:-mx-8 sm:-mt-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-1 break-words">
          {data.fullName || "Your Name"}
        </h1>
        {data.targetRole && (
          <p className="text-base sm:text-lg text-amber-400 font-medium tracking-wide mb-3">
            {data.targetRole}
          </p>
        )}
        <div className="text-[9.5pt] text-zinc-300 flex flex-wrap gap-x-4 gap-y-1">
          {allLinks.map((item, idx) => (
            <span key={idx} className="flex items-center gap-1">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 border-l-4 border-amber-500 pl-2 mb-2">
            Executive Summary
          </h2>
          <p className="text-[10.5pt] text-zinc-700 leading-relaxed text-justify">
            {data.summary}
          </p>
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 border-l-4 border-amber-500 pl-2 mb-2">
            Core Competencies
          </h2>
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(data.skills) ? data.skills : [data.skills]).map(
              (s: string, i: number) => (
                <span
                  key={i}
                  className="text-[9.5pt] font-medium text-zinc-800 bg-zinc-100 px-2.5 py-1"
                >
                  {s}
                </span>
              ),
            )}
          </div>
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 border-l-4 border-amber-500 pl-2 mb-2">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp: any, i: number) => (
              <div key={i}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline mb-0.5">
                  <h3 className="font-bold text-[11.5pt] text-zinc-900 break-words">
                    {exp.role}{" "}
                    <span className="font-normal text-zinc-600">
                      &mdash; {exp.company}
                    </span>
                  </h3>
                  <span className="text-[10px] sm:text-xs text-zinc-500 font-semibold uppercase tracking-wider whitespace-nowrap">
                    {exp.duration}
                  </span>
                </div>
                <ul className="list-outside list-disc pl-4 space-y-1.5 marker:text-amber-500 mt-1.5">
                  {exp.bullets?.map((bullet: string, j: number) => (
                    <li
                      key={j}
                      className="text-[10.5pt] text-zinc-800 pl-1 leading-relaxed text-justify"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 border-l-4 border-amber-500 pl-2 mb-2">
            Key Projects
          </h2>
          <div className="space-y-4">
            {data.projects.map((proj: any, i: number) => (
              <div key={i}>
                <div className="flex flex-wrap items-baseline gap-2 mb-0.5">
                  <h3 className="font-bold text-[11.5pt] text-zinc-900">
                    {proj.name}
                  </h3>
                  {proj.liveLink && (
                    <a
                      href={
                        proj.liveLink.startsWith("http")
                          ? proj.liveLink
                          : `https://${proj.liveLink}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-500 hover:text-amber-600 transition flex items-center gap-1 text-[10px] font-semibold tracking-wider"
                    >
                      <Globe className="w-3 h-3" /> Live
                    </a>
                  )}
                  {proj.githubLink && (
                    <a
                      href={
                        proj.githubLink.startsWith("http")
                          ? proj.githubLink
                          : `https://${proj.githubLink}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-500 hover:text-amber-600 transition flex items-center gap-1 text-[10px] font-semibold tracking-wider"
                    >
                      <Github className="w-3 h-3" /> Code
                    </a>
                  )}
                </div>
                {proj.description && (
                  <div className="text-[10.5pt] text-zinc-600 mb-1.5">
                    {proj.description}
                  </div>
                )}
                <ul className="list-outside list-disc pl-4 space-y-1.5 marker:text-amber-500">
                  {proj.bullets?.map((bullet: string, j: number) => (
                    <li
                      key={j}
                      className="text-[10.5pt] text-zinc-800 pl-1 leading-relaxed text-justify"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 border-l-4 border-amber-500 pl-2 mb-2">
            Education
          </h2>
          <div className="space-y-2">
            {data.education.map((edu: any, i: number) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row justify-between items-start"
              >
                <div>
                  <h3 className="font-bold text-[11pt] text-zinc-900">
                    {edu.degree}
                  </h3>
                  <div className="text-[10.5pt] text-zinc-600">
                    {edu.institution}
                  </div>
                </div>
                {edu.year && (
                  <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mt-1 sm:mt-0.5 whitespace-nowrap">
                    {edu.year}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// COMPACT TEMPLATE (Two-column sidebar layout)
// ----------------------------------------------------
function CompactTemplate({ data }: { data: any }) {
  return (
    <div className="font-sans text-[10.5pt] leading-snug text-zinc-800 flex flex-col sm:flex-row gap-6">
      {/* Sidebar */}
      <div className="sm:w-[32%] sm:border-r sm:border-zinc-200 sm:pr-5">
        <h1 className="text-2xl font-black text-zinc-900 mb-0.5 break-words leading-tight">
          {data.fullName || "Your Name"}
        </h1>
        {data.targetRole && (
          <p className="text-[10pt] text-teal-700 font-semibold mb-4">
            {data.targetRole}
          </p>
        )}

        <div className="mb-5">
          <h2 className="text-[9.5pt] font-bold uppercase tracking-widest text-zinc-400 mb-2">
            Contact
          </h2>
          <div className="space-y-1.5 text-[9.5pt] text-zinc-700">
            {data.email && (
              <div className="flex items-start gap-1.5 break-all">
                <Mail className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{data.email}</span>
              </div>
            )}
            {data.phone && (
              <div className="flex items-start gap-1.5">
                <Phone className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{data.phone}</span>
              </div>
            )}
            {data.location && (
              <div className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{data.location}</span>
              </div>
            )}
            {data.linkedin && (
              <div className="flex items-start gap-1.5 break-all">
                <Linkedin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{data.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</span>
              </div>
            )}
            {data.github && (
              <div className="flex items-start gap-1.5 break-all">
                <Github className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{data.github.replace(/^https?:\/\/(www\.)?/, "")}</span>
              </div>
            )}
            {data.portfolio && (
              <div className="flex items-start gap-1.5 break-all">
                <Globe className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{data.portfolio.replace(/^https?:\/\/(www\.)?/, "")}</span>
              </div>
            )}
          </div>
        </div>

        {data.skills && data.skills.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[9.5pt] font-bold uppercase tracking-widest text-zinc-400 mb-2">
              Skills
            </h2>
            <div className="flex flex-col gap-1.5">
              {(Array.isArray(data.skills) ? data.skills : [data.skills]).map(
                (s: string, i: number) => (
                  <span
                    key={i}
                    className="text-[9.5pt] text-zinc-700 border-l-2 border-teal-500 pl-2"
                  >
                    {s}
                  </span>
                ),
              )}
            </div>
          </div>
        )}

        {data.education && data.education.length > 0 && (
          <div>
            <h2 className="text-[9.5pt] font-bold uppercase tracking-widest text-zinc-400 mb-2">
              Education
            </h2>
            <div className="space-y-3">
              {data.education.map((edu: any, i: number) => (
                <div key={i}>
                  <h3 className="font-semibold text-[10pt] text-zinc-900 break-words">
                    {edu.degree}
                  </h3>
                  <div className="text-[9.5pt] text-zinc-600 break-words">
                    {edu.institution}
                  </div>
                  {edu.year && (
                    <div className="text-[9px] text-teal-700 font-semibold uppercase tracking-wider mt-0.5">
                      {edu.year}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="sm:w-[68%]">
        {data.summary && (
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-teal-800 mb-2">
              Summary
            </h2>
            <p className="text-[10.5pt] text-zinc-700 leading-relaxed text-justify">
              {data.summary}
            </p>
          </div>
        )}

        {data.experience && data.experience.length > 0 && (
          <div className="mb-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-teal-800 mb-2">
              Experience
            </h2>
            <div className="space-y-3.5">
              {data.experience.map((exp: any, i: number) => (
                <div key={i}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline mb-0.5">
                    <h3 className="font-bold text-[11pt] text-zinc-900 break-words">
                      {exp.role}
                    </h3>
                    <span className="text-[9.5px] text-teal-700 font-semibold uppercase tracking-wider whitespace-nowrap">
                      {exp.duration}
                    </span>
                  </div>
                  <div className="text-[10pt] font-medium text-zinc-600 mb-1.5">
                    {exp.company}
                  </div>
                  <ul className="list-outside list-disc pl-4 space-y-1 marker:text-teal-500">
                    {exp.bullets?.map((bullet: string, j: number) => (
                      <li
                        key={j}
                        className="text-[10pt] text-zinc-800 pl-1 leading-relaxed text-justify"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.projects && data.projects.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-teal-800 mb-2">
              Projects
            </h2>
            <div className="space-y-3.5">
              {data.projects.map((proj: any, i: number) => (
                <div key={i}>
                  <div className="flex flex-wrap items-baseline gap-2 mb-0.5">
                    <h3 className="font-bold text-[11pt] text-zinc-900">
                      {proj.name}
                    </h3>
                    {proj.liveLink && (
                      <a
                        href={
                          proj.liveLink.startsWith("http")
                            ? proj.liveLink
                            : `https://${proj.liveLink}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-500 hover:text-teal-600 transition flex items-center gap-1 text-[10px] font-semibold tracking-wider"
                      >
                        <Globe className="w-3 h-3" /> Live
                      </a>
                    )}
                    {proj.githubLink && (
                      <a
                        href={
                          proj.githubLink.startsWith("http")
                            ? proj.githubLink
                            : `https://${proj.githubLink}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-500 hover:text-teal-600 transition flex items-center gap-1 text-[10px] font-semibold tracking-wider"
                      >
                        <Github className="w-3 h-3" /> Code
                      </a>
                    )}
                  </div>
                  {proj.description && (
                    <div className="text-[10pt] text-zinc-600 mb-1.5">
                      {proj.description}
                    </div>
                  )}
                  <ul className="list-outside list-disc pl-4 space-y-1 marker:text-teal-500">
                    {proj.bullets?.map((bullet: string, j: number) => (
                      <li
                        key={j}
                        className="text-[10pt] text-zinc-800 pl-1 leading-relaxed text-justify"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
