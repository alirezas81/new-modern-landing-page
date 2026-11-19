"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, Menu, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type BottleProps = {
  name: string;
  detail: string;
  kind?: "amber" | "clear" | "white";
  size?: "large" | "small" | "mini";
  className?: string;
};

function Bottle({ name, detail, kind = "clear", size = "large", className = "" }: BottleProps) {
  return (
    <div className={`bottle bottle--${kind} bottle--${size} ${className}`} aria-label={`${name} product bottle`} role="img">
      <div className="bottle-cap"><span /></div>
      <div className="bottle-neck" />
      <div className="bottle-body">
        <div className="bottle-label">
          <div className="bottle-logo">THE<br />ORDINARY.</div>
          <span className="bottle-rule" />
          <p>{name}</p>
          <small>{detail}</small>
          <span className="bottle-rule bottle-rule--short" />
          <em>Clinical formulations<br />with integrity</em>
          <b>30 ml / 1 fl oz</b>
        </div>
        <span className="glass-shine" />
      </div>
      <div className="bottle-shadow" />
    </div>
  );
}

function Molecule({ className = "" }: { className?: string }) {
  return (
    <svg className={`molecule ${className}`} viewBox="0 0 220 180" fill="none" aria-hidden="true">
      <path d="M31 97 77 49l60 21 44-35M77 49l-7 78 67-57 10 79m-70-22 56 22 48-44" />
      <circle cx="31" cy="97" r="7" /><circle cx="77" cy="49" r="9" /><circle cx="137" cy="70" r="6" />
      <circle cx="181" cy="35" r="8" /><circle cx="70" cy="127" r="7" /><circle cx="147" cy="149" r="8" /><circle cx="147" cy="149" r="2" />
    </svg>
  );
}

const products = [
  { number: "01", family: "BARRIER SUPPORT", ingredient: "NIACINAMIDE", amount: "10%", name: "Niacinamide 10% + Zinc 1%", subtitle: "High-strength vitamin and mineral blemish formula", detail: "FOR CLARITY, NOT COMPLEXITY", type: "clear" as const, tone: "product-panel--chalk" },
  { number: "02", family: "DEEP HYDRATION", ingredient: "HYALURONIC ACID", amount: "2%", name: "Hyaluronic Acid 2% + B5", subtitle: "Multi-depth hydration support serum", detail: "A DRINK OF WATER, IN A DROP", type: "clear" as const, tone: "product-panel--stone" },
  { number: "03", family: "SURFACE RENEWAL", ingredient: "GLYCOLIC ACID", amount: "7%", name: "Glycolic Acid 7% Exfoliating Toner", subtitle: "Daily exfoliating and radiance solution", detail: "GENTLE BY DESIGN", type: "amber" as const, tone: "product-panel--clay" },
];

export default function OrdinaryExperience() {
  const root = useRef<HTMLElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({ duration: reduceMotion ? 0 : 1.15, smoothWheel: !reduceMotion, wheelMultiplier: 0.85 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    let motionMM: ReturnType<typeof gsap.matchMedia> | undefined;
    let productMM: ReturnType<typeof gsap.matchMedia> | undefined;

    const ctx = gsap.context(() => {
      motionMM = gsap.matchMedia();
      const mm = motionMM;
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
        heroTl
          .from(".hero-word", { yPercent: 115, rotate: 2, duration: 1.2, stagger: 0.13, delay: 0.2 }, 0)
          .from(".hero-bottle", { y: 180, x: 50, rotateY: -28, rotateZ: 8, scale: 0.82, opacity: 0, duration: 1.65, ease: "power4.out" }, 0.25)
          .from(".hero-note", { opacity: 0, y: 14, duration: 0.65, stagger: 0.1 }, 0.8)
          .from(".hero-index, .hero-scroll", { opacity: 0, duration: 0.6 }, 1.1);
        gsap.to(".hero-bottle", { y: -28, rotateZ: -1.5, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 } });
        gsap.to(".hero-grid", { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 } });

        gsap.timeline({ scrollTrigger: { trigger: ".science", start: "top top", end: "+=150%", pin: true, scrub: 1 } })
          .fromTo(".science-line", { clipPath: "inset(100% 0 0 0)", y: 25 }, { clipPath: "inset(0% 0 0 0)", y: 0, stagger: 0.24, duration: 1, ease: "none" }, 0)
          .fromTo(".science-orbit", { scale: 0.55, rotate: -38, opacity: 0 }, { scale: 1, rotate: 8, opacity: 1, duration: 1.4, ease: "none" }, 0.15)
          .fromTo(".science-caption", { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.8)
          .to(".science-orbit", { rotate: 40, scale: 1.13, duration: 1.1, ease: "none" }, 1.1);

        productMM = gsap.matchMedia();
        productMM.add("(min-width: 641px)", () => {
          const track = root.current?.querySelector<HTMLElement>(".product-track");
          if (!track) return;
          const horizontal = gsap.timeline({ scrollTrigger: { trigger: ".product-showcase", start: "top top", end: () => `+=${window.innerWidth * 2.15}`, pin: true, scrub: 1, invalidateOnRefresh: true } });
          horizontal.to(track, { xPercent: -66.6667, duration: 2.4, ease: "none" }, 0);
          gsap.utils.toArray<HTMLElement>(".product-panel").forEach((panel, index) => {
            const bottle = panel.querySelector(".product-bottle");
            const title = panel.querySelector(".product-product-name");
            if (bottle) horizontal.fromTo(bottle, { y: 90, rotateY: -22, opacity: 0.2 }, { y: 0, rotateY: 0, opacity: 1, duration: 0.55, ease: "power2.out" }, index * 0.82 + 0.18);
            if (title) horizontal.fromTo(title, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.32 }, index * 0.82 + 0.42);
          });
        });

        gsap.to(".ingredient-photo", { yPercent: -17, scale: 1.08, ease: "none", scrollTrigger: { trigger: ".ingredients", start: "top bottom", end: "bottom top", scrub: 1 } });
        gsap.to(".ingredient-orbit", { rotate: 135, scale: 1.12, ease: "none", scrollTrigger: { trigger: ".ingredients", start: "top bottom", end: "bottom top", scrub: 1 } });
        gsap.utils.toArray<HTMLElement>(".ingredient-word").forEach((word, i) => {
          gsap.fromTo(word, { y: 55, opacity: 0.16 }, { y: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: word, start: "top 85%", end: "top 44%", scrub: 0.7 } });
          gsap.to(word, { x: i % 2 ? -24 : 24, ease: "none", scrollTrigger: { trigger: ".ingredients", start: "top bottom", end: "bottom top", scrub: 1 } });
        });
        gsap.timeline({ scrollTrigger: { trigger: ".statement", start: "top 75%", end: "bottom 40%", scrub: 1 } })
          .fromTo(".statement-line", { yPercent: 45, opacity: 0.15 }, { yPercent: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: "none" }, 0)
          .fromTo(".statement-bottle", { y: 160, rotate: 14, opacity: 0 }, { y: 0, rotate: -5, opacity: 1, duration: 1.1, ease: "none" }, 0.2)
          .to(".statement-word--last", { x: 55, duration: 1, ease: "none" }, 0.55);
        gsap.utils.toArray<HTMLElement>(".routine-card").forEach((card, i) => {
          gsap.fromTo(card, { y: 60, opacity: 0, rotate: i === 1 ? 0 : i === 0 ? -2 : 2 }, { y: 0, opacity: 1, rotate: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 86%" } });
        });
        gsap.fromTo(".final-product", { y: 120, rotate: 12, opacity: 0 }, { y: 0, rotate: -4, opacity: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: ".closing", start: "top 72%" } });
        gsap.to(".closing-orbit", { rotate: 180, ease: "none", scrollTrigger: { trigger: ".closing", start: "top bottom", end: "bottom bottom", scrub: 1 } });

        const cleanups: Array<() => void> = [];
        const cursorEl = cursor.current;
        if (window.matchMedia("(pointer: fine)").matches) {
          if (cursorEl) {
            gsap.set(cursorEl, { xPercent: -50, yPercent: -50 });
            const move = (event: PointerEvent) => gsap.to(cursorEl, { x: event.clientX, y: event.clientY, duration: 0.4, ease: "power3.out", overwrite: true });
            window.addEventListener("pointermove", move);
            cleanups.push(() => window.removeEventListener("pointermove", move));
          }
          gsap.utils.toArray<HTMLElement>(".closing-cta, .nav-cta").forEach((button) => {
            const xTo = gsap.quickTo(button, "x", { duration: 0.35, ease: "power3.out" });
            const yTo = gsap.quickTo(button, "y", { duration: 0.35, ease: "power3.out" });
            const magnet = (event: PointerEvent) => {
              const bounds = button.getBoundingClientRect();
              xTo((event.clientX - bounds.left - bounds.width / 2) * 0.12);
              yTo((event.clientY - bounds.top - bounds.height / 2) * 0.16);
            };
            const reset = () => { xTo(0); yTo(0); };
            button.addEventListener("pointermove", magnet);
            button.addEventListener("pointerleave", reset);
            cleanups.push(() => {
              button.removeEventListener("pointermove", magnet);
              button.removeEventListener("pointerleave", reset);
            });
          });
        }
        return () => cleanups.forEach((cleanup) => cleanup());
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".hero-word, .hero-note, .hero-bottle", { clearProps: "all" });
      });
    }, root);

    return () => {
      productMM?.revert();
      motionMM?.revert();
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main ref={root} className="experience">
      <div ref={cursor} className="custom-cursor" aria-hidden="true"><span>SCROLL</span></div>
      <header className="site-header">
        <a href="#top" className="wordmark" aria-label="The Ordinary home">THE<br />ORDINARY.</a>
        <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
          <a href="#science" onClick={closeMenu}>OUR APPROACH</a>
          <a href="#products" onClick={closeMenu}>FORMULATIONS</a>
          <a href="#routine" onClick={closeMenu}>YOUR ROUTINE</a>
          <a href="#closing" className="nav-cta" onClick={closeMenu}>DISCOVER <ArrowUpRight size={13} /></a>
        </nav>
        <button className="menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <section id="top" className="hero" aria-labelledby="hero-title">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-topline"><span>CLINICAL FORMULATIONS<br />WITH INTEGRITY</span><span className="hero-index">EST. MMXVI &nbsp; / &nbsp; 43°39&apos;N 79°23&apos;W</span></div>
        <div className="hero-title-wrap">
          <h1 id="hero-title"><span className="hero-line"><span className="hero-word">SKINCARE,</span></span><span className="hero-line hero-line--second"><span className="hero-word">DECODED<span className="full-stop">.</span></span></span></h1>
        </div>
        <div className="hero-bottle-wrap">
          <div className="hero-bottle"><Bottle name="Niacinamide 10%" detail="ZINC 1%" /></div>
          <span className="hero-bottle-index">FORMULA Nº 01</span>
        </div>
        <div className="hero-note hero-note--left"><span className="note-dot" />A STUDY IN<br />LESS, NOT MORE</div>
        <div className="hero-note hero-note--right"><span>ACTIVE INGREDIENTS</span><b>10.0%</b><small>NIACINAMIDE</small></div>
        <a className="hero-scroll" href="#science"><span>SCROLL TO EXPLORE</span><ArrowDown size={15} strokeWidth={1.2} /></a>
        <span className="hero-sidecode">01 &nbsp; / &nbsp; FORM FOLLOWS FUNCTION</span>
      </section>

      <section id="science" className="science" aria-labelledby="science-title">
        <div className="science-top"><span>01 — THE METHOD</span><span>LESS, BUT BETTER</span></div>
        <div className="science-copy">
          <p className="eyebrow">GOOD SKIN ISN&apos;T A MYSTERY.</p>
          <h2 id="science-title"><span className="science-line">NOT MORE.</span><span className="science-line">JUST WHAT</span><span className="science-line">MATTERS<span className="full-stop">.</span></span></h2>
          <p className="science-caption">We believe in the power of purposeful ingredients.<br />Clear formulas. Honest prices. Nothing to hide.</p>
        </div>
        <div className="science-orbit-wrap" aria-hidden="true">
          <div className="orbit-ring orbit-ring--one" /><div className="orbit-ring orbit-ring--two" />
          <div className="orbit-core"><span>O</span></div>
          <span className="orbit-label orbit-label--a">01 / ACTIVE</span><span className="orbit-label orbit-label--b">PURE<br />POTENCY</span>
          <Molecule className="science-molecule" />
        </div>
        <span className="science-foot">FORMULATED FOR SKIN. BACKED BY SCIENCE.</span>
      </section>

      <section id="products" className="product-showcase" aria-label="Three essential formulations">
        <div className="product-track">
          {products.map((product, i) => (
            <article className={`product-panel ${product.tone}`} key={product.number}>
              <div className="product-panel-head"><span>THE ORDINARY. &nbsp; / &nbsp; ESSENTIALS</span><span>{product.number} — 03</span></div>
              <div className="product-copy">
                <span className="eyebrow">{product.family}</span>
                <h2 className="product-ingredient">{product.ingredient}<br /><b>{product.amount}</b></h2>
                <p className="product-detail">{product.detail}</p>
                <p className="product-product-name">{product.name}<small>{product.subtitle}</small></p>
              </div>
              <div className="product-bottle"><Bottle name={product.name} detail={product.amount} kind={product.type} /></div>
              <span className="product-vertical">THE ESSENTIALS — {product.number}</span>
              <span className="product-coordinate">CLINICAL / DAILY / DIRECT</span>
              <div className="product-progress"><span style={{ width: `${((i + 1) / 3) * 100}%` }} /></div>
            </article>
          ))}
        </div>
        <div className="showcase-counter"><span>SCROLL TO MEET YOUR FORMULA</span><span>01 — 03</span></div>
      </section>

      <section className="ingredients" aria-labelledby="ingredients-title">
        <div className="ingredient-photo" role="img" aria-label="Macro study of a serum droplet and clear fluid"><Image src="/ingredient-study.jpg" alt="" fill sizes="100vw" className="ingredient-image" /></div>
        <div className="ingredient-wash" />
        <div className="ingredients-header"><span>02 — THE ACTIVES</span><span>FOUR WAYS TO UNDERSTAND YOUR SKIN</span></div>
        <div className="ingredient-orbit" aria-hidden="true"><div className="ingredient-orbit-ring" /><Molecule /><span>MOLECULAR<br />STRUCTURE 01</span></div>
        <div className="ingredients-content">
          <p className="eyebrow">NOT INGREDIENTS FOR INGREDIENT&apos;S SAKE</p>
          <h2 id="ingredients-title"><span className="ingredient-word">NIACINAMIDE</span><span className="ingredient-word">HYALURONIC</span><span className="ingredient-word ingredient-word--indent">GLYCOLIC</span><span className="ingredient-word">SALICYLIC</span></h2>
          <p className="ingredients-foot">Every ingredient has a reason.<br />Every percentage, a purpose.</p>
        </div>
        <div className="ingredient-index"><span>01</span><span>02</span><span>03</span><span>04</span></div>
      </section>

      <section className="statement" aria-labelledby="statement-title">
        <div className="statement-top"><span>03 — THE POINT OF VIEW</span><span>SIMPLICITY IS A SCIENCE</span></div>
        <div className="statement-content">
          <h2 id="statement-title"><span className="statement-line">SKINCARE</span><span className="statement-line statement-word--last">WITHOUT</span><span className="statement-line">THE NOISE<span className="full-stop">.</span></span></h2>
          <div className="statement-bottle"><Bottle name="Hyaluronic Acid 2%" detail="+ B5" size="small" /></div>
          <p className="statement-aside">JUST WHAT YOUR SKIN NEEDS.<br />NOTHING IT DOESN&apos;T.</p>
        </div>
        <span className="statement-coord">A MORE CONSIDERED APPROACH / Nº 003</span>
      </section>

      <section id="routine" className="routine" aria-labelledby="routine-title">
        <div className="routine-head"><div><span className="eyebrow">A SIMPLE PLACE TO BEGIN</span><h2 id="routine-title">THREE STEPS.<br /><span>YOUR SKIN,</span> YOUR WAY.</h2></div><p>Good skincare doesn&apos;t need a twelve-step routine.<br />Start with the essentials. Build only what you need.</p></div>
        <div className="routine-grid">
          <article className="routine-card routine-card--one"><div className="routine-card-top"><span>01</span><span>AM / PM</span></div><div className="routine-visual"><div className="routine-halo" /><Bottle name="Squalane Cleanser" detail="GENTLE CLEANSING" size="small" kind="white" /></div><div className="routine-info"><h3>Cleanse<span>↗</span></h3><p>Start with a clean slate. A gentle, non-stripping first step.</p><small>FOUNDATION / DAILY</small></div></article>
          <article className="routine-card routine-card--two"><div className="routine-card-top"><span>02</span><span>AM / PM</span></div><div className="routine-visual"><div className="routine-halo" /><Bottle name="Niacinamide 10%" detail="ZINC 1%" size="small" /></div><div className="routine-info"><h3>Treat<span>↗</span></h3><p>Target what matters to you with an active that earns its place.</p><small>THE ACTIVE / SKIN CONCERN</small></div></article>
          <article className="routine-card routine-card--three"><div className="routine-card-top"><span>03</span><span>AM / PM</span></div><div className="routine-visual"><div className="routine-halo" /><Bottle name="Natural Moisturizing" detail="FACTORS + HA" size="small" kind="white" /></div><div className="routine-info"><h3>Moisturize<span>↗</span></h3><p>Support your skin barrier and keep the good things in.</p><small>THE LAST LAYER / DAILY</small></div></article>
        </div>
        <a className="text-link" href="#closing">BUILD YOUR ROUTINE <ArrowUpRight size={15} /></a>
      </section>

      <section id="closing" className="closing" aria-labelledby="closing-title">
        <div className="closing-orbit" aria-hidden="true"><span /><span /><span /></div>
        <div className="closing-top"><span>THE ORDINARY. &nbsp; / &nbsp; TORONTO, CANADA</span><span>FORMULATED WITH INTENTION</span></div>
        <div className="closing-content"><div className="closing-product final-product"><Bottle name="The Daily Set" detail="SKIN ESSENTIALS" /></div><p className="eyebrow">START WITH WHAT MATTERS</p><h2 id="closing-title">UNDERSTAND<br />YOUR SKIN<span className="full-stop">.</span></h2><a href="#products" className="closing-cta">EXPLORE THE COLLECTION <ArrowUpRight size={16} /></a></div>
        <footer className="site-footer"><a href="#top" className="footer-mark">THE<br />ORDINARY.</a><span>CLINICAL FORMULATIONS<br />WITH INTEGRITY</span><nav aria-label="Footer"><a href="#science">OUR APPROACH</a><a href="#products">THE COLLECTION</a><a href="#routine">BUILD A ROUTINE</a><a href="https://theordinary.com" target="_blank" rel="noreferrer">THEORDINARY.COM <ArrowUpRight size={12} /></a></nav><span className="copyright">© THE ORDINARY. 2025</span></footer>
      </section>
      <div className="mobile-progress" aria-hidden="true"><span /></div>
    </main>
  );
}
