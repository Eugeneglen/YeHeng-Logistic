"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Package,
  Route,
  Warehouse,
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
function Navbar() {
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
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ];

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
          <div className="w-9 h-9 rounded-lg bg-amber-600 flex items-center justify-center font-bold text-white text-sm tracking-tight transition-transform duration-300 group-hover:scale-105">
            YH
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-wide text-foreground">
              YeHeng
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              Logistics
            </span>
          </div>
        </a>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-md hover:bg-white/5"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA + Mobile */}
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-600/20"
          >
            Get Started
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
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
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-80" : "max-h-0"
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
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2.5 text-sm font-medium text-amber-500 hover:text-amber-400"
          >
            Get Started →
          </a>
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
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/hero-bg.png"
          alt="Singapore port aerial view"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
      </div>

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

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in-up animate-delay-800">
          <div className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-amber-500 animate-bounce" />
          </div>
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
const projects = [
  {
    title: "Singapore Grand Prix",
    category: "Events & Exhibitions",
    description:
      "Coordinated time-sensitive delivery of specialized racing equipment for the Singapore Grand Prix, requiring precision logistics and 24/7 monitoring across multiple venues.",
    tags: ["Precision Logistics", "24/7 Monitoring", "Time-Critical"],
  },
  {
    title: "G.E.M. Concert Tour",
    category: "Entertainment",
    description:
      "Managed first-mile logistics for G.E.M.'s Singapore concert tour, handling sensitive audio equipment, stage components, and time-critical setup requirements.",
    tags: ["Sensitive Equipment", "First-Mile", "Stage Components"],
  },
  {
    title: "Sumec Container Operations",
    category: "Marine & Industrial",
    description:
      "Container trucking operations for in-gauge and out-of-gauge (OOG) cargo in Singapore, covering import collection from port terminals, delivery to customer sites, and empty container returns.",
    tags: ["OOG Cargo", "Port Operations", "Compliance Review"],
  },
];

function Projects() {
  const ref = useReveal();

  return (
    <section id="projects" ref={ref} className="relative py-24 sm:py-32">
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
          {projects.map((p, i) => (
            <div
              key={p.title}
              className={`reveal reveal-delay-${i + 1} card-glow group relative p-7 rounded-2xl border border-border bg-card/50 overflow-hidden flex flex-col`}
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
              <div className="mt-5 pt-5 border-t border-border flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] font-medium text-muted-foreground bg-white/5 px-2.5 py-1 rounded-md"
                  >
                    {t}
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
/*  Contact Section                                                   */
/* ------------------------------------------------------------------ */
function Contact() {
  const ref = useReveal();
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
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
          setFormState({ name: "", email: "", company: "", message: "" });
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
            <div className="p-6 rounded-2xl border border-border bg-card/50 space-y-6">
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
    <footer className="border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center font-bold text-white text-xs">
              YH
            </div>
            <div>
              <span className="text-sm font-semibold">YeHeng Logistics Pte Ltd</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Precision. Control. Personal. &mdash; Singapore 2025
          </p>
          <div className="flex items-center gap-4 text-muted-foreground">
            <a href="#about" className="text-xs hover:text-foreground transition-colors">
              About
            </a>
            <a href="#services" className="text-xs hover:text-foreground transition-colors">
              Services
            </a>
            <a href="#contact" className="text-xs hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <HybridModel />
        <Services />
        <Industries />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}