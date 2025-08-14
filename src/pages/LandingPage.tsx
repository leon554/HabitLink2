import { Link, useNavigate } from "react-router-dom"
import { TbTargetArrow } from "react-icons/tb"
import { FaLink, FaRegCheckCircle, FaRegClock, FaMagic } from "react-icons/fa"
import InfoPanel from "@/components/InfoPanel"
import ProgressBar from "@/components/InputComponents/ProgressBar"
import InfoBox from "@/components/StatsComponents/InfoBox"

export default function LandingPage() {
  const navigate = useNavigate()
  return (
    <div className="relative">
      <div className="absolute inset-0 texture opacity-20 dark:opacity-10 pointer-events-none" />
      <div className="pt-16  ">
        {/* Hero */}
        <section className="relative overflow-hidden">
          
          <div className="relative mx-auto w-[90%] md:w-auto md:max-w-7xl md:px-6 lg:px-8 py-14 md:py-20">
            <div className="grid md:grid-cols-2 items-center gap-10">
              <div>
                <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight text-title text-center md:text-left">
                  Build habits. Hit goals. Understand your patterns.
                </h1>
                <p className="mt-4 text-subtext1 leading-relaxed text-center md:text-left">
                  HabitLink gives super‑detailed analytics so you can see how habits
                  influence each other, associate habits to habits, and track goal
                  progress and consistency with clarity.
                </p>

                <div className="mt-6 flex max-sm:flex-row max-sm:w-full gap-3 justify-center md:justify-start">
                  <Link to="/auth">
                    <button className="w-full hover:cursor-pointer sm:w-auto inline-flex items-center justify-center rounded-lg bg-blue-500 dark:bg-highlight text-white dark:text-btn-text px-5 py-3 font-medium shadow-sm hover:opacity-90 transition">
                      Get started free
                    </button>
                  </Link>
                  <Link to="/dashboard">
                    <button className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-border bg-panel2/70 px-5 py-3 font-medium text-subtext1 hover:bg-panel2 transition">
                      View demo
                    </button>
                  </Link>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-subtext2 justify-center md:justify-start">
                  <div className="flex items-center gap-2">
                    <FaRegCheckCircle className="text-blue-500 dark:text-highlight" />
                    Dark mode ready
                  </div>
                  <div className="flex items-center gap-2">
                    <FaRegCheckCircle className="text-blue-500 dark:text-highlight" />
                    Mobile friendly
                  </div>
                </div>
              </div>

              {/* Hero examples from the app (uniform width on mobile) */}
              <div className="relative">
                <div className="flex flex-col items-center  gap-4 w-full ">
                  <div className="w-full max-w-[600px] mx-auto md:mx-0 flex flex-col items-center gap-3">
                    <InfoPanel full={true}>
                      <InfoPanel.Title title="Today at a glance" />
                      <div className="flex flex-col gap-3">
                      
                        <div className="mt-3">
                          <p className="text-subtext1 text-sm mb-1.5">Consistency</p>
                          <ProgressBar min={0} max={30} current={18} height={8} />
                        </div>
                        <div className="mt-2">
                          <p className="text-subtext1 text-sm mb-1.5">Strength</p>
                          <ProgressBar min={0} max={4} current={3} height={8} />
                        </div>
                        <div className="mt-2">
                          <p className="text-subtext1 text-sm mb-1.5">Goal Progress</p>
                          <ProgressBar min={0} max={100} current={33} height={8} />
                        </div>
                      </div>
                    </InfoPanel>
                  </div>

                  <div className="w-full max-w-[600px] mx-auto md:mx-0 bg-panel1 rounded-2xl p-4 outline-1 outline-border">
                    <div className="grid grid-cols-3 gap-6">
                      <InfoBox value={"74%"} text="Miss Rate" toolTipText="Your rolling consistency" />
                      <InfoBox value={"68%"} text="Strength" toolTipText="Your rolling strength" />
                      <InfoBox value={"12"} text="Best Streak" toolTipText="Longest streak" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature grid */}
        <section className="relative">
          <div className="mx-auto w-[90%] md:w-auto md:max-w-7xl md:px-6 lg:px-8 py-10 md:py-16">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <FeatureCard
                icon={<TbTargetArrow className="text-blue-500 dark:text-highlight" size={20} />}
                title="Goal‑centric tracking"
                text="Associate habits to goals and measure real progress, not just streaks."
              />
              <FeatureCard
                icon={<FaLink className="text-blue-500 dark:text-highlight" size={18} />}
                title="Habit linking"
                text="Connect habits to other habits to understand cause‑and‑effect in your routine."
              />
              <FeatureCard
                icon={<FaRegClock className="text-blue-500 dark:text-highlight" size={18} />}
                title="Consistency & streaks"
                text="See adherence, streaks, and momentum at a glance to stay on track."
              />
              <FeatureCard
                icon={<FaMagic className="text-blue-500 dark:text-highlight" size={18} />}
                title="AI habit generation"
                text="Describe a goal and get instant habit ideas."
              />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="relative">
          <div className="mx-auto w-[90%] md:w-auto md:max-w-7xl md:px-6 lg:px-8 py-10 md:py-16">
            <div className="rounded-2xl border bg-panel1 border-border p-6 md:p-10">
              <div className="grid md:grid-cols-3 ">
                <HowItWorksStep
                  step="1"
                  title="Create habits & goals"
                  text="Define what you want to achieve and the habits that move the needle."
                />
                <HowItWorksStep
                  step="2"
                  title="Log with ease"
                  text="Capture your activity daily—fast, simple, and on any device."
                />
                <HowItWorksStep
                  skip={true}
                  step="3"
                  title="Discover insights"
                  text="See correlations, trends, and bottlenecks so you can iterate intelligently."
                />
              </div>
              <div className=" max-md:mt-5 flex justify-center md:justify-start">
                <Link to="/auth">
                  <button className=" m-3 inline-flex items-center justify-center rounded-lg bg-blue-500 dark:bg-highlight text-white dark:text-btn-text px-5 py-3 font-medium shadow-sm hover:opacity-90 transition">
                    Start tracking now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA banner */}
        <section className="relative">
          <div className="mx-auto w-[90%] md:w-auto md:max-w-7xl md:px-6 lg:px-8 pb-14 md:pb-20 mt-8 md:mt-16">
            <div className="rounded-2xl border border-border bg-panel1 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-xl md:text-2xl font-semibold text-title">
                  Ready to build habits that actually stick?
                </h2>
                <p className="mt-2 text-subtext2">
                  Join HabitLink and turn intention into measurable progress.
                </p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <Link to="/auth" className="flex-1 md:flex-none">
                  <button className="w-full inline-flex items-center max-sm:text-sm justify-center rounded-lg bg-blue-500 dark:bg-highlight text-white dark:text-btn-text px-5 py-3 font-medium shadow-sm hover:opacity-90 transition">
                    Create account
                  </button>
                </Link>
                <Link to="/dashboard" className="flex-1 md:flex-none">
                  <button className="w-full inline-flex items-center max-sm:text-sm justify-center rounded-lg border border-border bg-panel2 px-5 py-3 font-medium text-subtext1 hover:bg-panel2/70 transition">
                    Explore demo
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/70 py-8">
          <div className="mx-auto w-[90%] md:w-auto md:max-w-7xl md:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-subtext3">
            <p>© {new Date().getFullYear()} HabitLink. All rights reserved.</p>
            <div className="flex gap-3 ">
              <p className="text-sm text-subtext3 underline hover:cursor-pointer" 
                  onClick={() => navigate("/terms")}>
                  Terms & Conditions
              </p>
              <p className="text-sm text-subtext3 underline hover:cursor-pointer" 
                  onClick={() => navigate("/refund")}>
                  Refund Policy
              </p>
              <p className="text-sm text-subtext3 underline hover:cursor-pointer" 
                  onClick={() => navigate("/priv")}>
                  Privacy Policy
              </p>
          </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="rounded-xl border border-border bg-panel1 p-5 hover:-translate-y-0.5 transition-transform">
      <div className="flex items-start gap-3">
        <div className="mt-1">{icon}</div>
        <div>
          <h3 className="text-title font-medium">{title}</h3>
          <p className="mt-1 text-sm text-subtext2 leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  )
}

function HowItWorksStep({
  step,
  title,
  text,
  skip
}: {
  step: string
  title: string
  text: string
  skip?: boolean
}) {
  return (
    <div className={`${skip ? "py-10 pb-3" : "py-10 max-md:border-b-1"} border-border  p-3 `} >
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 shrink-0 rounded-full bg-blue-500/15 dark:bg-highlight/20 flex items-center justify-center text-blue-500 dark:text-highlight text-sm font-semibold">
          {step}
        </div>
        <h3 className="text-title font-medium">{title}</h3>
      </div>
      <p className="mt-2 text-subtext2 text-sm leading-relaxed">{text}</p>
    </div>
  )
}
