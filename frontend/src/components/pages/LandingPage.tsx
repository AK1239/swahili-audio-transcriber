import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { TopNav } from "../layout/TopNav";

export function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root">
      {/* Navbar */}
      <TopNav
        paddingYClass="py-4"
        rightContent={
          <>
            <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
              <nav className="flex items-center gap-8">
                <a className="text-[#4b5563] text-sm font-medium hover:text-primary transition-colors" href="#features">
                  Features
                </a>
                <a className="text-[#4b5563] text-sm font-medium hover:text-primary transition-colors" href="#pricing">
                  Pricing
                </a>
                <a className="text-[#4b5563] text-sm font-medium hover:text-primary transition-colors" href="#teams">
                  For Teams
                </a>
              </nav>
              <Button
                variant="default"
                className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all transform hover:scale-105"
                onClick={() => navigate("/upload")}
              >
                <span>Anza Bure</span>
              </Button>
            </div>
            {/* Mobile Menu Icon */}
            <div className="md:hidden text-[#0d101b]">
              <span className="material-symbols-outlined">menu</span>
            </div>
          </>
        }
      />

      <main className="grow flex flex-col items-center w-full">
        {/* Hero Section with Upload */}
        <section className="relative w-full flex justify-center py-12 md:py-20 lg:py-24 bg-hero-pattern">
          {/* Abstract Background Blobs */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl -z-10"></div>
          
          <div className="w-full max-w-[1280px] px-4 md:px-10 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            {/* Text Content */}
            <div className="flex flex-col gap-6 flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 w-fit mx-auto lg:mx-0">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">AI V2.0 Now Live</span>
              </div>
              <h1 className="text-[#0d101b] text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-[-0.02em]">
                Badili sauti kuwa <br className="hidden lg:block" />
                <span className="text-primary">
                  maandishi
                </span>{" "}
                na muhtasari wa akili
              </h1>
              <p className="text-[#4b5563] text-lg font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                The most accurate Swahili AI transcription tool for teams and professionals in East Africa. Save hours
                of work with automated summaries.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
                <div className="flex items-center gap-2 text-sm font-medium text-[#4b5563]">
                  <span className="material-symbols-outlined text-[20px] bg-green-500 text-white rounded-full">check_circle</span>
                  <span>98% Accuracy</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-[#4b5563]">
                  <span className="material-symbols-outlined text-[20px] bg-green-500 text-white rounded-full">check_circle</span>
                  <span>Swahili & English</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-[#4b5563]">
                  <span className="material-symbols-outlined text-[20px] bg-green-500 text-white rounded-full">check_circle</span>
                  <span>Fast Export</span>
                </div>
              </div>
            </div>

            {/* Interactive Upload Card */}
            <div className="w-full max-w-[500px] shrink-0">
              <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-[#e7e9f3] overflow-hidden p-6 md:p-8 relative group">
                {/* Drag overlay effect */}
                <div className="absolute inset-0 bg-primary/5 border-2 border-primary border-dashed rounded-2xl m-2 hidden group-hover:block pointer-events-none transition-all"></div>
                
                <div className="flex flex-col items-center justify-center gap-6 text-center border-2 border-dashed border-[#cfd3e7] rounded-xl bg-[#f8f9fc] px-6 py-10 transition-colors hover:border-primary/50 hover:bg-blue-50/30">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-primary mb-2">
                    <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[#0d101b] text-lg font-bold">Upload Audio File</h3>
                    <p className="text-[#6b7280] text-sm leading-normal max-w-[280px] mx-auto">
                      Drag & drop MP3, WAV, or M4A files here to transcribe immediately.
                    </p>
                  </div>
                  <Button 
                    variant="default" 
                    className="flex items-center justify-center rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all shadow-md w-full sm:w-auto min-w-[160px]"
                    onClick={() => navigate('/upload')}
                  >
                    Browse Files
                  </Button>
                  <p className="text-xs text-[#9ca3af] mt-2">Max file size: 500MB</p>
                </div>

                {/* Recent/History Mockup (Mini) */}
                <div className="mt-6 border-t border-slate-100 pt-4">
                  <p className="text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-3">Recent Projects</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                      <div className="w-8 h-8 rounded bg-teal-100 flex items-center justify-center text-secondary shrink-0">
                        <span className="material-symbols-outlined text-sm">description</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0d101b] truncate">Interview_Nairobi_Tech.mp3</p>
                        <p className="text-xs text-[#6b7280]">Processed • 2m ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                      <div className="w-8 h-8 rounded bg-amber-100 flex items-center justify-center text-accent shrink-0">
                        <span className="material-symbols-outlined text-sm">mic</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0d101b] truncate">Lecture_Swahili_101.wav</p>
                        <p className="text-xs text-[#6b7280]">Processed • 1h ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features / How it Works */}
        <section id="features" className="w-full bg-white py-16 border-y border-[#e7e9f3]">
          <div className="w-full max-w-[1280px] px-4 md:px-10 mx-auto">
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-4 max-w-2xl">
                <h2 className="text-[#0d101b] text-3xl md:text-4xl font-bold leading-tight tracking-tight">
                  Jinsi Inavyofanya Kazi
                </h2>
                <p className="text-[#4b5563] text-lg font-normal leading-relaxed">
                  Simple 3-step process to transform your unstructured audio into structured data ready for analysis.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="group flex flex-col gap-6 p-8 rounded-2xl bg-[#f8f9fc] border border-[#e7e9f3] hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl">upload_file</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[#0d101b] text-xl font-bold">1. Upload</h3>
                    <p className="text-[#4b5563] leading-relaxed">
                      Securely upload your audio files directly from your device. We support multiple formats including
                      MP3 and WAV.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="group flex flex-col gap-6 p-8 rounded-2xl bg-[#f8f9fc] border border-[#e7e9f3] hover:shadow-lg hover:border-secondary/20 transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl bg-teal-100 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl">graphic_eq</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[#0d101b] text-xl font-bold">2. Transcribe</h3>
                    <p className="text-[#4b5563] leading-relaxed">
                      Our AI engine processes speech to text instantly, understanding Swahili dialects and context with
                      high precision.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="group flex flex-col gap-6 p-8 rounded-2xl bg-[#f8f9fc] border border-[#e7e9f3] hover:shadow-lg hover:border-accent/20 transition-all duration-300">
                  <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl">summarize</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[#0d101b] text-xl font-bold">3. Summarize</h3>
                    <p className="text-[#4b5563] leading-relaxed">
                      Get structured summaries, key points, and export your data as PDF, Word, or JSON instantly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Showcase Section */}
        <section className="w-full py-16 md:py-24 bg-background-light">
          <div className="w-full max-w-[1280px] px-4 md:px-10 mx-auto">
            <div className="bg-linear-to-br from-primary to-[#101322] rounded-3xl p-8 md:p-12 lg:p-16 text-white relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://placeholder.pics/svg/1000')] bg-cover mix-blend-overlay"></div>
              <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-1/4 translate-y-1/4">
                <svg height="400" viewBox="0 0 200 200" width="400" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-4.9C93.5,9.3,82.2,22.9,71.1,34.3C60,45.7,49.1,54.9,37.3,61.9C25.5,68.9,12.7,73.7,-0.7,74.9C-14.1,76.1,-28.3,73.6,-40.5,66.1C-52.7,58.6,-63,46,-70.8,32.1C-78.6,18.2,-83.9,3,-81.9,-11.3C-79.9,-25.6,-70.6,-39,-59.1,-48.2C-47.6,-57.4,-33.9,-62.4,-20.7,-66.4C-7.5,-70.4,5.2,-73.3,17.9,-76.4L44.7,-76.4Z"
                    fill="#FFFFFF"
                    transform="translate(100 100)"
                  ></path>
                </svg>
              </div>
              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col gap-6">
                  <h2 className="text-3xl md:text-4xl font-bold leading-tight">Trusted by Professionals</h2>
                  <p className="text-blue-100 text-lg max-w-md">
                    Join thousands of researchers, journalists, and students using Swahili AI to streamline their
                    workflow.
                  </p>
                  <div className="flex gap-4 pt-4">
                    <Button 
                      variant="default" 
                      className="bg-white text-primary px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors"
                      onClick={() => navigate('/upload')}
                    >
                      Get Started
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-transparent border border-white/30 text-white px-6 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors"
                    >
                      View Demo
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  {/* Abstract UI representation */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl">
                    <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
                      <div className="w-10 h-10 rounded-full bg-teal-400/20 flex items-center justify-center text-teal-300">
                        <span className="material-symbols-outlined">play_arrow</span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-1/3 bg-teal-400 rounded-full"></div>
                      </div>
                      <span className="text-sm font-mono text-teal-300">04:20</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/50 shrink-0"></div>
                        <div className="space-y-2 w-full">
                          <div className="h-3 w-3/4 bg-white/20 rounded"></div>
                          <div className="h-3 w-1/2 bg-white/10 rounded"></div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-purple-500/50 shrink-0"></div>
                        <div className="space-y-2 w-full">
                          <div className="h-3 w-5/6 bg-white/20 rounded"></div>
                          <div className="h-3 w-2/3 bg-white/10 rounded"></div>
                          <div className="h-3 w-1/2 bg-white/10 rounded"></div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/50 shrink-0"></div>
                        <div className="space-y-2 w-full">
                          <div className="h-3 w-4/5 bg-white/20 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-10 bg-white border-t border-[#e7e9f3]">
        <div className="w-full max-w-[1280px] px-4 md:px-10 mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-[#0d101b]">
            <div className="size-6 text-primary">
              <span className="material-symbols-outlined">graphic_eq</span>
            </div>
            <span className="text-lg font-bold">Sauti AI</span>
          </div>
          <div className="flex gap-8 flex-wrap justify-center">
            <a className="text-sm text-[#4b5563] hover:text-primary transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="text-sm text-[#4b5563] hover:text-primary transition-colors" href="#">
              Terms of Service
            </a>
            <a className="text-sm text-[#4b5563] hover:text-primary transition-colors" href="#">
              Help Center
            </a>
          </div>
          <div className="flex gap-4">
            <a className="text-[#9ca3af] hover:text-primary transition-colors" href="#">
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </a>
            <a className="text-[#9ca3af] hover:text-primary transition-colors" href="#">
              <span className="sr-only">GitHub</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  fillRule="evenodd"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

