import { ArrowRight, Mic, Sparkles, Waves } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  {
    title: "Enrollment",
    text: "Capture multiple voice samples with recording, upload, and waveform preview.",
  },
  {
    title: "Recognition",
    text: "Run speaker identification with confidence scores and similarity analytics.",
  },
  {
    title: "History",
    text: "Track prior attempts, filter by speaker, and export the record stream.",
  },
  {
    title: "Admin",
    text: "Monitor model quality, user activity, and retraining controls.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-bg text-slate-100">
      <div className="fixed inset-0 -z-10 bg-aurora opacity-90" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[40rem] bg-[radial-gradient(circle_at_top,rgba(77,225,255,0.18),transparent_38%)]" />
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-200 shadow-glow">
            <Mic className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">
              Speaker AI
            </div>
            <div className="text-lg font-semibold">Speaker Recognition</div>
          </div>
        </div>
        <nav className="hidden items-center gap-2 md:flex">
          <Link
            to="/login"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/5"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:opacity-90"
          >
            Get Started
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-10 lg:px-6">
        <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
              <Sparkles className="h-4 w-4" /> AI-powered speaker intelligence
            </div>
            <h1 className="mt-6 max-w-3xl font-display text-5xl font-semibold leading-tight text-white lg:text-7xl">
              Recognize voices with a futuristic{" "}
              <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
                VoiceCore
              </span>{" "}
              stack.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              Enrollment, recognition, history, and analytics in a polished
              full-stack app built for modern speaker identification workflows.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-medium text-slate-950 transition hover:scale-[1.02]"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10"
              >
                Existing user
              </Link>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                "Waveform analysis",
                "Confidence scoring",
                "Deployment ready",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 backdrop-blur-xl"
                >
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative rounded-[2rem] border border-white/10 bg-panel p-5 shadow-glow backdrop-blur-2xl"
          >
            <div className="absolute inset-0 -z-10 animate-pulseGlow rounded-[2rem] bg-[radial-gradient(circle_at_center,rgba(77,225,255,0.24),transparent_55%)]" />
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-5">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Live recognition console</span>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-emerald-200">
                  Operational
                </span>
              </div>
              <div className="mt-5 h-64 overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(77,225,255,0.08),rgba(139,92,246,0.08))] p-4">
                <div className="flex h-full items-end gap-1">
                  {Array.from({ length: 48 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex-1 rounded-full bg-gradient-to-t from-cyan-400 via-violet-500 to-emerald-400"
                      style={{
                        height: `${20 + ((index * 17) % 78)}%`,
                        opacity: 0.25 + (index % 5) * 0.14,
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Predicted speaker", value: "Unknown" },
                  { label: "Confidence", value: "94.2%" },
                  { label: "Latency", value: "412 ms" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="text-xs uppercase tracking-[0.25em] text-slate-400">
                      {item.label}
                    </div>
                    <div className="mt-2 text-xl font-semibold text-white">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mt-20 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-200">
                <Waves className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {feature.text}
              </p>
            </motion.div>
          ))}
        </section>

        <section className="mt-20 flex flex-col items-start justify-between gap-6 rounded-[2rem] border border-white/10 bg-white/5 px-6 py-8 md:flex-row md:items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">
              Ready to deploy
            </div>
            <h2 className="mt-2 text-3xl font-semibold text-white">
              Start with the auth flow and move straight into recognition.
            </h2>
          </div>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 font-medium text-slate-950"
          >
            Build the app <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>

      <footer className="mx-auto max-w-7xl px-4 pb-10 text-sm text-slate-400 lg:px-6">
        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <div>Speaker AI © 2026</div>
          <div className="flex gap-4">
            <span>GitHub</span>
            <span>X</span>
            <span>LinkedIn</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
