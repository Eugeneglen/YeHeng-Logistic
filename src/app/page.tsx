"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Shield,
  Globe,
  Truck,
  Clock,
  Eye,
  Users,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Package,
  Route,
  Warehouse,
  X,
  Calendar,
  MapPinned,
  Target,
  TrendingUp,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Scroll-reveal hook                                                 */
/* ------------------------------------------------------------------ */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const children = el.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    children.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return ref;
}

/* ------------------------------------------------------------------ */
/*  Animated counter                                                  */
/* ------------------------------------------------------------------ */
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2000;
          const startTime = performance.now();
          const step = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Navigation                                                        */
/* ------------------------------------------------------------------ */
function Navbar({
  onSelectProject,
}: {
  onSelectProject?: (id: string) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Industries", href: "#industries" },
    { label: "Contact", href: "#contact" },
  ];

  const handleProjectSelect = (id: string) => {
    onSelectProject?.(id);
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="YeHeng Logistics"
            className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-105 brightness-0 invert"
          />
          <span className="text-sm font-semibold tracking-wide text-foreground">
            YeHeng Logistics Pte Ltd
          </span>
        </a>

        {/* Desktop links — flush right */}
        <nav className="flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="hidden md:block px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-md hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
            {/* Projects dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden md:inline-flex px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-md hover:bg-white/5 items-center gap-1">
                  Projects
                  <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-card border-border w-64"
              >
                {projectsData.map((p) => (
                  <DropdownMenuItem
                    key={p.id}
                    onClick={() => handleProjectSelect(p.id)}
                    className="cursor-pointer py-3 focus:bg-amber-600/10 focus:text-amber-400"
                  >
                    <div>
                      <div className="text-sm font-medium">{p.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {p.category}
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground ml-1"
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">
              <span
                className={`block w-5 h-0.5 bg-current transition-transform duration-300 ${
                  mobileOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-current transition-opacity duration-300 ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-current transition-transform duration-300 ${
                  mobileOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="px-4 pb-4 pt-2 space-y-1 bg-background/95 backdrop-blur-xl border-t border-border">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors"
            >
              {l.label}
            </a>
          ))}
          {/* Mobile project sub-links */}
          <div className="pl-3 border-l-2 border-border ml-3 space-y-0.5 mt-2">
            <p className="px-3 py-1 text-[10px] font-semibold tracking-wider uppercase text-amber-500">
              Projects
            </p>
            {projectsData.map((p) => (
              <button
                key={p.id}
                onClick={() => handleProjectSelect(p.id)}
                className="block w-full text-left px-3 py-2 text-sm text-muted-foreground hover:text-amber-400 hover:bg-white/5 rounded-lg transition-colors"
              >
                {p.title}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero Section                                                      */
/* ------------------------------------------------------------------ */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="animate-fade-in-up animate-delay-200 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-600/30 bg-amber-600/5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-subtle-pulse" />
          <span className="text-xs font-medium tracking-wider uppercase text-amber-400">
            Singapore &amp; Beyond
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-in-up animate-delay-400 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]">
          <span className="block">Precision.</span>
          <span className="block">Control.</span>
          <span className="block gradient-text">Personal.</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up animate-delay-600 mt-6 sm:mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          High-Touch Logistics for Singapore &amp; Beyond. We are not an app
          — we are your external, dedicated logistics department.
        </p>

        {/* CTAs */}
        <div className="animate-fade-in-up animate-delay-800 mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-amber-600/25 hover:-translate-y-0.5"
          >
            Get a Logistics Assessment
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#about"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-medium text-muted-foreground hover:text-foreground border border-border hover:border-foreground/20 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            Learn More
            <ChevronDown className="w-4 h-4" />
          </a>
        </div>

        </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  About / Philosophy Section                                        */
/* ------------------------------------------------------------------ */
function About() {
  const ref = useReveal();

  return (
    <section id="about" ref={ref} className="relative py-24 sm:py-32">
      {/* Subtle divider line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-amber-600/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="reveal text-xs font-semibold tracking-[0.25em] uppercase text-amber-500 mb-4">
            The Concierge Standard
          </p>
          <h2 className="reveal reveal-delay-1 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            In an industry of automated replies,{" "}
            <span className="gradient-text">we pick up the phone.</span>
          </h2>
          <p className="reveal reveal-delay-2 mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
            Established logistics giants prioritize volume, sacrificing
            visibility and personalized communication. Your shipments become
            just another ticket in the system.
          </p>
          <p className="reveal reveal-delay-3 mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            YeHeng Logistics was founded to bring the{" "}
            <strong className="text-foreground font-semibold">
              Concierge concept
            </strong>{" "}
            to logistics. We combine dedicated internal assets with a vetted
            partner network for superior service quality.
          </p>
        </div>

        {/* Stats */}
        <div className="reveal reveal-delay-4 mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {[
            { value: 100, suffix: "%", label: "Control & Accountability" },
            { value: 24, suffix: "/7", label: "Monitoring & Support" },
            { value: 1, suffix: "", label: "Invoice, One Contact" },
            { value: 0, suffix: "", label: "Tickets in a Queue" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl border border-border bg-card/50"
            >
              <div className="text-3xl sm:text-4xl font-bold gradient-text">
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Hybrid Model Section                                              */
/* ------------------------------------------------------------------ */
function HybridModel() {
  const ref = useReveal();

  return (
    <section ref={ref} className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 right-0 w-1/2 h-1/2 bg-amber-600/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="reveal text-xs font-semibold tracking-[0.25em] uppercase text-amber-500 mb-4">
            How It Works
          </p>
          <h2 className="reveal reveal-delay-1 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            100% Control,{" "}
            <span className="gradient-text">Maximum Scale</span>
          </h2>
          <p className="reveal reveal-delay-2 mt-4 text-muted-foreground max-w-2xl mx-auto">
            Combining dedicated assets with a vetted partner network for
            superior service quality.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* Core Fleet */}
          <div className="reveal reveal-delay-1 card-glow group relative p-8 sm:p-10 rounded-2xl border border-border bg-card/50">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-12 h-12 rounded-xl bg-amber-600/10 flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">The Core Fleet</h3>
            <p className="text-muted-foreground leading-relaxed">
              For your most time-sensitive and critical movements, we deploy
              our internal team. This ensures{" "}
              <strong className="text-foreground">100% control</strong> and
              accountability over every shipment, every mile, every minute.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Direct Oversight", "SLA Guaranteed", "Priority Handling"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-amber-400 bg-amber-600/10 rounded-full"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Vetted Network */}
          <div className="reveal reveal-delay-2 card-glow group relative p-8 sm:p-10 rounded-2xl border border-border bg-card/50">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-12 h-12 rounded-xl bg-amber-600/10 flex items-center justify-center mb-6">
              <Globe className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-4">
              The Vetted Network
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              For scale and reach, we orchestrate Singapore&apos;s best freight
              forwarders,{" "}
              <strong className="text-foreground">managed entirely by us</strong>.
              You get one invoice, one point of contact, and guaranteed service
              quality.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "Vetted Partners",
                "Unified Invoice",
                "Scale on Demand",
              ].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-amber-400 bg-amber-600/10 rounded-full"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Concierge service highlight */}
        <div className="reveal reveal-delay-3 mt-8 p-6 sm:p-8 rounded-2xl border border-amber-600/20 bg-amber-600/5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-600/20 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h4 className="font-semibold text-lg">
              The Concierge Service: Radical Visibility
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Human-verified updates at every step. We spot and solve problems
              before you even know they exist.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Services Section                                                  */
/* ------------------------------------------------------------------ */
const services = [
  {
    icon: Truck,
    title: "Local Distribution",
    description:
      "Reliable and secure last-mile delivery across Singapore, ensuring your products reach customers safely and on time.",
    features: ["Same-day options", "Real-time tracking", "Proof of delivery"],
  },
  {
    icon: Route,
    title: "Cross-Border Trucking",
    description:
      "Seamless and compliant transport between Singapore and Malaysia, with full regulatory compliance and professional handling.",
    features: ["Customs clearance", "Regulatory compliant", "Scheduled departures"],
  },
  {
    icon: Globe,
    title: "Global Freight",
    description:
      "Managing your freight from origin to destination, regardless of size or complexity. Air, sea, and multimodal solutions.",
    features: ["Air & Ocean freight", "Door-to-door", "Multimodal routing"],
  },
  {
    icon: Warehouse,
    title: "Warehousing & Handling",
    description:
      "Secure storage facilities with professional inventory management, handling high-value and time-sensitive goods.",
    features: ["Climate controlled", "Inventory system", "Quality checks"],
  },
  {
    icon: Clock,
    title: "Concierge Visibility",
    description:
      "Human-verified updates at every checkpoint. Your dedicated logistics desk filters the noise and delivers actionable intelligence.",
    features: ["24/7 monitoring", "Proactive alerts", "Dedicated desk"],
  },
  {
    icon: Package,
    title: "Project & Event Logistics",
    description:
      "Precision coordination for events, exhibitions, and projects where timing is critical and failure is not an option.",
    features: ["Rigging & setup", "Time-critical", "On-site support"],
  },
];

function Services() {
  const ref = useReveal();

  return (
    <section id="services" ref={ref} className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="reveal text-xs font-semibold tracking-[0.25em] uppercase text-amber-500 mb-4">
            What We Do
          </p>
          <h2 className="reveal reveal-delay-1 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Land Transport &{" "}
            <span className="gradient-text">Last-Mile Excellence</span>
          </h2>
          <p className="reveal reveal-delay-2 mt-4 text-muted-foreground max-w-2xl mx-auto">
            Our drivers represent your brand at the delivery point. Every touch
            point is an extension of your reputation.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {services.map((s, i) => (
            <div
              key={s.title}
              className={`reveal reveal-delay-${Math.min(i + 1, 4)} card-glow group p-6 sm:p-7 rounded-2xl border border-border bg-card/50 cursor-default`}
            >
              <div className="w-11 h-11 rounded-xl bg-amber-600/10 group-hover:bg-amber-600/20 flex items-center justify-center mb-5 transition-colors duration-300">
                <s.icon className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {s.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {s.features.map((f) => (
                  <span
                    key={f}
                    className="text-[11px] font-medium text-muted-foreground bg-white/5 px-2.5 py-1 rounded-md"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Industries Section                                                */
/* ------------------------------------------------------------------ */
const industries = [
  {
    icon: Shield,
    title: "High-Value Retail",
    description:
      "Where security, careful handling, and brand reputation are paramount. Every shipment is treated with the precision it deserves.",
    highlight: "Security-first handling",
  },
  {
    icon: Clock,
    title: "Events & Exhibitions",
    description:
      'Where "late" means complete failure and missed opportunities. We deliver on time, every time — because the show must go on.',
    highlight: "Zero-tolerance for delays",
  },
  {
    icon: Package,
    title: "Marine & Urgent Spares",
    description:
      "Where every minute of delay costs significant money. Rapid response logistics that keep operations running and vessels moving.",
    highlight: "Minutes matter, we deliver",
  },
];

function Industries() {
  const ref = useReveal();

  return (
    <section id="industries" ref={ref} className="relative py-24 sm:py-32">
      {/* Background accent */}
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-amber-600/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="reveal text-xs font-semibold tracking-[0.25em] uppercase text-amber-500 mb-4">
            Industries We Serve
          </p>
          <h2 className="reveal reveal-delay-1 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Where Failure is{" "}
            <span className="gradient-text">Not an Option</span>
          </h2>
          <p className="reveal reveal-delay-2 mt-4 text-muted-foreground max-w-2xl mx-auto">
            Your dedicated logistics desk, filtering the noise and delivering
            solutions for mission-critical operations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {industries.map((ind, i) => (
            <div
              key={ind.title}
              className={`reveal reveal-delay-${i + 1} card-glow group relative p-8 rounded-2xl border border-border bg-card/50 overflow-hidden`}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-12 h-12 rounded-xl bg-amber-600/10 flex items-center justify-center mb-5">
                <ind.icon className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">{ind.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                {ind.description}
              </p>
              <div className="flex items-center gap-2 text-amber-500">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-subtle-pulse" />
                <span className="text-xs font-semibold tracking-wide uppercase">
                  {ind.highlight}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ROI banner */}
        <div className="reveal reveal-delay-4 mt-12 p-6 sm:p-8 rounded-2xl border border-border bg-card/30">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600/20 to-amber-600/5 flex items-center justify-center">
                <Users className="w-7 h-7 text-amber-500" />
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-1">The ROI</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                By ensuring on-time, secure, and proactively managed logistics,
                we <strong className="text-foreground">reduce your risk</strong>,
                save you management time, and{" "}
                <strong className="text-foreground">
                  protect your brand&apos;s reputation
                </strong>
                . Our clients see measurable improvements in delivery
                reliability, cost control, and operational peace of mind.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Case Studies / Projects                                           */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/*  Project data                                                       */
/* ------------------------------------------------------------------ */
type Project = {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  overview: string;
  challenges: string[];
  approach: string[];
  results: string[];
  tags: string[];
  client: string;
  year: string;
  duration: string;
};

const projects: Project[] = [
  {
    id: "singapore-grand-prix",
    title: "Singapore Grand Prix",
    category: "Events & Exhibitions",
    image: "/project-grandprix.png",
    description:
      "Coordinated time-sensitive delivery of specialized racing equipment for the Singapore Grand Prix, requiring precision logistics and 24/7 monitoring across multiple venues.",
    overview:
      "The Singapore Grand Prix is Asia's premier motorsport event, held on the demanding Marina Bay Street Circuit. The event requires flawless coordination of hundreds of shipments containing specialized racing equipment, team infrastructure, and hospitality assets — all within a tight, non-negotiable timeline. A single delayed shipment can compromise an entire race weekend.",
    challenges: [
      "Strict non-negotiable delivery windows aligned with track build schedule",
      "High-value, sensitive racing equipment requiring specialist handling protocols",
      "Multiple delivery points across a closed street circuit with restricted access",
      "24/7 coordination across international time zones with F1 team logistics managers",
      "Security clearance requirements for pit lane and paddock deliveries",
    ],
    approach: [
      "Dedicated project manager assigned as single point of contact for all teams",
      "Pre-event site survey and delivery route planning with circuit authorities",
      "Real-time GPS tracking with 15-minute proactive status updates",
      "Contingency vehicles pre-positioned at strategic locations around the circuit",
      "Security-vetted drivers with prior event clearance credentials",
    ],
    results: [
      "100% on-time delivery across all shipments — zero delays",
      "Coordinated 200+ individual movements over a 10-day build-up period",
      "Zero damage incidents on high-value racing equipment",
      "Recognised by event organisers for logistics excellence",
    ],
    tags: ["Precision Logistics", "24/7 Monitoring", "Time-Critical"],
    client: "F1 Teams & Event Organisers",
    year: "2024",
    duration: "10 days (build-up to race weekend)",
  },
  {
    id: "gem-concert-tour",
    title: "G.E.M. Concert Tour",
    category: "Entertainment",
    image: "/project-concert.png",
    description:
      "Managed first-mile logistics for G.E.M.'s Singapore concert tour, handling sensitive audio equipment, stage components, and time-critical setup requirements.",
    overview:
      "G.E.M.'s concert tour demands first-mile logistics of extraordinary precision. The shipment included sensitive audio equipment valued in the millions, custom stage components manufactured overseas, and time-critical rigging supplies. Every element had to arrive in sequence — sound before staging, staging before lighting — creating a dependency chain where one late truck cascades into a cancelled show.",
    challenges: [
      "Million-dollar audio equipment requiring climate-controlled transport",
      "Sequential delivery dependencies — sound, staging, lighting in strict order",
      "Venue loading dock constraints with limited time windows",
      "International freight coordination from multiple origin countries",
      "Fragile custom stage sets requiring white-glove handling",
    ],
    approach: [
      "Assigned a dedicated concierge logistics manager for the entire tour leg",
      "Created a detailed delivery Gantt chart with 30-minute precision windows",
      "Deployed climate-controlled vehicles for audio equipment transport",
      "Pre-staged equipment at a nearby holding warehouse for just-in-time delivery",
      "Provided real-time WhatsApp updates directly to the tour production manager",
    ],
    results: [
      "All shipments delivered on schedule — show went ahead without delay",
      "Zero equipment damage across all fragile and high-value items",
      "Tour production manager commended our proactive communication",
      "Reduced venue loading time by 20% through pre-staging strategy",
    ],
    tags: ["Sensitive Equipment", "First-Mile", "Stage Components"],
    client: "Tour Production Team",
    year: "2024",
    duration: "5 days (load-in to show day)",
  },
  {
    id: "sumec-container-operations",
    title: "Sumec Container Operations",
    category: "Marine & Industrial",
    image: "/project-container.png",
    description:
      "Container trucking operations for in-gauge and out-of-gauge (OOG) cargo in Singapore, covering import collection from port terminals, delivery to customer sites, and empty container returns.",
    overview:
      "Sumec required a reliable container trucking partner for both standard in-gauge and complex out-of-gauge (OOG) cargo movements across Singapore. This involved import collection from multiple port terminals (PSA, Jurong, Tuas), delivery to varied customer sites ranging from industrial parks to congested urban locations, and the often-overlooked process of empty container returns — all while maintaining full regulatory compliance.",
    challenges: [
      "Out-of-gauge cargo requiring special permits, pilot vehicles, and route surveys",
      "Multiple port terminals with different access protocols and operating hours",
      "Tight turnaround requirements to avoid demurrage and detention charges",
      "Coordinating empty container returns across depots with limited availability",
      "End-to-end compliance including weight limits, axle load regulations, and port rules",
    ],
    approach: [
      "Conducted a detailed end-to-end workflow review with safety and compliance assessment",
      "Assigned dedicated fleet for OOG movements with experienced heavy-load drivers",
      "Implemented a digital tracking dashboard for real-time container status visibility",
      "Pre-booked return slots at container depots to eliminate waiting time",
      "Weekly compliance audits and driver briefings on regulatory updates",
    ],
    results: [
      "Zero compliance incidents across all movements",
      "Reduced container turnaround time by 15% through pre-booking strategy",
      "Achieved 98% on-time delivery rate across 500+ container movements",
      "Client extended contract based on service quality and reliability",
    ],
    tags: ["OOG Cargo", "Port Operations", "Compliance Review"],
    client: "Sumec Group",
    year: "2024–2025",
    duration: "Ongoing contract",
  },
];

const projectsData = projects; // alias for passing to components

/* ------------------------------------------------------------------ */
/*  Project Detail Sheet                                               */
/* ------------------------------------------------------------------ */
function ProjectDetail({
  project,
  open,
  onOpenChange,
}: {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!project) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl bg-background border-border p-0 overflow-y-auto"
      >
        {/* Hero image */}
        <div className="relative h-56 sm:h-64 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-400 mb-2 block">
              {project.category}
            </span>
            <SheetTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
              {project.title}
            </SheetTitle>
          </div>
        </div>

        {/* Meta bar */}
        <div className="border-b border-border px-6 py-4 flex flex-wrap gap-x-6 gap-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-amber-500" />
            <span className="text-muted-foreground">Client:</span>
            <span className="font-medium">{project.client}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span className="text-muted-foreground">Year:</span>
            <span className="font-medium">{project.year}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-amber-500" />
            <span className="text-muted-foreground">Duration:</span>
            <span className="font-medium">{project.duration}</span>
          </div>
        </div>

        <SheetDescription className="sr-only">
          Project details for {project.title}
        </SheetDescription>

        {/* Content */}
        <div className="px-6 py-6 space-y-8">
          {/* Overview */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-amber-500 mb-3">
              <MapPinned className="w-4 h-4" />
              Overview
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {project.overview}
            </p>
          </div>

          {/* Challenges */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-amber-500 mb-3">
              <Target className="w-4 h-4" />
              Challenges
            </h4>
            <ul className="space-y-2.5">
              {project.challenges.map((c) => (
                <li
                  key={c}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60 shrink-0 mt-1.5" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Our Approach */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-amber-500 mb-3">
              <Route className="w-4 h-4" />
              Our Approach
            </h4>
            <ul className="space-y-2.5">
              {project.approach.map((a) => (
                <li
                  key={a}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  {a}
                </li>
              ))}
            </ul>
          </div>

          {/* Results */}
          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-amber-500 mb-3">
              <TrendingUp className="w-4 h-4" />
              Results
            </h4>
            <ul className="space-y-2.5">
              {project.results.map((r) => (
                <li
                  key={r}
                  className="flex items-start gap-3 text-sm text-foreground font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
            {project.tags.map((t) => (
              <span
                key={t}
                className="text-[11px] font-medium text-muted-foreground bg-white/5 px-3 py-1.5 rounded-lg border border-border"
              >
                {t}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="pt-2">
            <a
              href="#contact"
              onClick={() => onOpenChange(false)}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/20"
            >
              Discuss a Similar Project
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/*  Case Studies / Projects                                           */
/* ------------------------------------------------------------------ */
function Projects({
  onSelectProject,
}: {
  onSelectProject?: (id: string) => void;
}) {
  const ref = useReveal();

  return (
    <section id="projects" ref={ref} className="relative py-24 sm:py-32 bg-projects-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="reveal text-xs font-semibold tracking-[0.25em] uppercase text-amber-500 mb-4">
            Proven Performance
          </p>
          <h2 className="reveal reveal-delay-1 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Real-World{" "}
            <span className="gradient-text">Solutions</span>
          </h2>
          <p className="reveal reveal-delay-2 mt-4 text-muted-foreground max-w-2xl mx-auto">
            Moving beyond theory to deliver precision in high-stakes
            environments.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {projectsData.map((p, i) => (
            <button
              key={p.id}
              onClick={() => onSelectProject?.(p.id)}
              className={`reveal reveal-delay-${i + 1} card-glow group relative p-7 rounded-2xl border border-border bg-card/50 overflow-hidden flex flex-col text-left cursor-pointer w-full`}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-500 mb-3">
                {p.category}
              </span>
              <h3 className="text-lg font-bold mb-3">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {p.description}
              </p>
              <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-medium text-muted-foreground bg-white/5 px-2.5 py-1 rounded-md"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-500 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Contact Section                                                   */
/* ------------------------------------------------------------------ */
function Contact() {
  const ref = useReveal();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formState),
        });
        if (res.ok) {
          setSubmitted(true);
          setFormState({ name: "", email: "", company: "", phone: "", message: "" });
        }
      } catch {
        // Silently handle
      } finally {
        setSubmitting(false);
      }
    },
    [formState]
  );

  return (
    <section id="contact" ref={ref} className="relative py-24 sm:py-32">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="reveal text-xs font-semibold tracking-[0.25em] uppercase text-amber-500 mb-4">
            Next Step
          </p>
          <h2 className="reveal reveal-delay-1 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Switch to the{" "}
            <span className="gradient-text">Concierge Standard</span>
          </h2>
          <p className="reveal reveal-delay-2 mt-4 text-muted-foreground max-w-2xl mx-auto">
            Tired of chasing updates? Let&apos;s discuss your critical logistics
            needs and discover how YeHeng Logistics can transform your supply
            chain.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Form */}
          <div className="reveal reveal-delay-1 lg:col-span-3">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-5">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Message Sent</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                  Thank you for reaching out. Our team will get back to you
                  within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-sm text-amber-500 hover:text-amber-400 font-medium transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5 p-6 sm:p-8 rounded-2xl border border-border bg-card/50"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-muted-foreground"
                    >
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      placeholder="John Tan"
                      className="bg-white/5 border-border focus:border-amber-600/50 focus:ring-amber-600/20 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-muted-foreground"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      placeholder="john@company.com"
                      className="bg-white/5 border-border focus:border-amber-600/50 focus:ring-amber-600/20 h-11"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label
                      htmlFor="company"
                      className="text-sm font-medium text-muted-foreground"
                    >
                      Company
                    </label>
                    <Input
                      id="company"
                      name="company"
                      value={formState.company}
                      onChange={handleChange}
                      placeholder="Your company name"
                      className="bg-white/5 border-border focus:border-amber-600/50 focus:ring-amber-600/20 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="phone"
                      className="text-sm font-medium text-muted-foreground"
                    >
                      Phone
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formState.phone}
                      onChange={handleChange}
                      placeholder="+65 XXXX XXXX"
                      className="bg-white/5 border-border focus:border-amber-600/50 focus:ring-amber-600/20 h-11"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    How can we help?
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us about your logistics needs..."
                    rows={5}
                    className="bg-white/5 border-border focus:border-amber-600/50 focus:ring-amber-600/20 resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/20 disabled:opacity-60"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Request a Consultation
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div className="reveal reveal-delay-2 lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl border border-border bg-card/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Left column: Person & Phone */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-600/10 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Yeo Hui Qi</p>
                      <p className="text-sm text-muted-foreground">
                        General Manager
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-600/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Phone</p>
                      <a
                        href="tel:+6584981676"
                        className="text-sm text-muted-foreground hover:text-amber-500 transition-colors"
                      >
                        +65 8498 1676
                      </a>
                    </div>
                  </div>
                </div>
                {/* Right column: Email & Office */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-600/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Email</p>
                      <a
                        href="mailto:info@yeheng.com.sg"
                        className="text-sm text-muted-foreground hover:text-amber-500 transition-colors"
                      >
                        info@yeheng.com.sg
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-600/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Office</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        21 Toh Guan Road East
                        <br />
                        #09-10 Toh Guan Centre
                        <br />
                        Singapore 608609
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick value props */}
            <div className="p-6 rounded-2xl border border-amber-600/20 bg-amber-600/5">
              <h4 className="font-semibold text-sm mb-4">Why choose YeHeng?</h4>
              <ul className="space-y-3">
                {[
                  "Human-verified, proactive updates",
                  "One point of contact, one invoice",
                  "Dedicated fleet for critical shipments",
                  "24/7 monitoring & emergency support",
                  "Singapore & cross-border expertise",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                            */
/* ------------------------------------------------------------------ */
function Footer() {
  return (
    <footer className="border-t border-border py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <img
              src="/sla-logo.png"
              alt="Singapore Logistics Association"
              className="h-7 sm:h-8 object-contain brightness-0 invert opacity-60"
            />
            <img
              src="/bizsafe-logo.png"
              alt="bizSAFE STAR"
              className="h-7 sm:h-8 object-contain brightness-0 invert opacity-60"
            />
          </div>
          <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
            Ye Heng Logistic Pte Ltd is a Member of Singapore Logistics Association
            (SLA). All business transactions are done in accordance to SLA Standard
            Trading Conditions. A Singapore Logistics Association Standard Trading
            Conditions copy is available on request.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */
export default function HomePage() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectedProject = selectedProjectId
    ? projectsData.find((p) => p.id === selectedProjectId) ?? null
    : null;

  const handleSelectProject = useCallback((id: string) => {
    setSelectedProjectId(id);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSelectProject={handleSelectProject} />
      <main className="flex-1">
        <Hero />
        <About />
        <HybridModel />
        <Services />
        <Industries />
        <Projects onSelectProject={handleSelectProject} />
        <Contact />
      </main>
      <Footer />
      <ProjectDetail
        project={selectedProject}
        open={!!selectedProjectId}
        onOpenChange={(open) => {
          if (!open) setSelectedProjectId(null);
        }}
      />
    </div>
  );
}