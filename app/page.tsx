"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  ArrowRight, ChevronDown, Dumbbell, HeartPulse, Instagram, Facebook,
  Menu, X, MapPin, Phone, Mail, Clock, MessageCircle, Star,
  Check, Activity, Users, TrendingUp, Target, Zap
} from "lucide-react";
import { gym, submitContactEnquiry } from "@/lib/gym";

const programs = [
  { name: "Strength Training", description: "Build strength and develop muscle with structured resistance training.", image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=900&q=85" },
  { name: "Personal Training", description: "Individual guidance and focused training support.", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=85" },
  { name: "Weight Management", description: "Structured fitness programs supporting individual fitness goals.", image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=900&q=85" },
  { name: "Cardio Training", description: "Improve endurance and cardiovascular fitness.", image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=900&q=85" },
  { name: "Functional Training", description: "Improve movement, balance, and overall fitness.", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=85" },
  { name: "Group Training", description: "Train together, stay consistent, and move as a community.", image: "https://images.unsplash.com/photo-1518609571773-39b7d303a87b?auto=format&fit=crop&w=900&q=85" }
];

const navItems = ["Home", "About Us", "Programs", "Facilities", "Trainers", "Membership", "Contact"];
const sectionIds = ["home", "about", "programs", "facilities", "trainers", "membership", "contact"];

type FormValues = {
  fullName: string;
  phoneNumber: string;
  email: string;
  interestedProgram: string;
  message: string;
};

function isValidIndianMobileNumber(value: string) {
  if (!/^\+?[\d\s().-]+$/.test(value)) return false;

  let digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);

  return /^[6-9]\d{9}$/.test(digits);
}

function Logo() {
  return (
    <a href="#home" aria-label="NS Fitness Club home" className="logo">
      <Image src={gym.logoPath} width={180} height={54} alt="NS Fitness Club" priority />
    </a>
  );
}

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [testimonial, setTestimonial] = useState(0);
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const onSubmit = async (values: FormValues) => {
    setFormError("");
    setFormStatus("loading");
    try {
      await submitContactEnquiry(values);
      reset();
      setFormStatus("success");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "We couldn't submit your enquiry. Please try again.");
      setFormStatus("error");
    }
  };

  const testimonials = [
    { name: "Sample Member", text: "The NS Fitness Club environment keeps me focused and motivated every week.", role: "Sample testimonial" },
    { name: "Community Member", text: "A focused, welcoming space with the equipment and support I need to train consistently.", role: "Sample testimonial" }
  ];

  return (
    <main>
      <nav className={scrolled ? "nav nav-scrolled" : "nav"}>
        <Logo />
        <div className="nav-links">
          {navItems.map((item, index) => (
            <button key={item} onClick={() => scrollTo(sectionIds[index])}>{item}</button>
          ))}
        </div>
        <button className="nav-cta" onClick={() => scrollTo("membership")}>Join Now <ArrowRight size={15} /></button>
        <button className="menu-button" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X /> : <Menu />}
        </button>
        {menuOpen && (
          <div className="mobile-menu">
            {navItems.map((item, index) => (
              <button key={item} onClick={() => scrollTo(sectionIds[index])}>{item}</button>
            ))}
          </div>
        )}
      </nav>

      <section id="home" className="hero">
        <Image
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2200&q=90"
          alt="Athletes training in a premium gym"
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />
        <div className="hero-overlay" />
        <motion.div className="hero-content" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="eyebrow">NS FITNESS CLUB</p>
          <h1>Build your<br /><span>strongest self.</span></h1>
          <p className="hero-subtitle">More than a gym. A community built on strength, discipline, and transformation.</p>
          <div className="hero-actions">
            <button className="button button-gold" onClick={() => scrollTo("membership")}>Explore membership</button>
            <button className="button button-outline" onClick={() => scrollTo("contact")}>Start your fitness journey</button>
          </div>
        </motion.div>
        <button className="scroll-indicator" aria-label="Scroll to about" onClick={() => scrollTo("about")}>
          <span>Scroll</span><ChevronDown size={18} />
        </button>
      </section>

      <section id="about" className="section about-section">
        <motion.div className="about-image" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <Image src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=85" alt="Modern strength training gym" fill sizes="(max-width: 900px) 100vw, 50vw" />
        </motion.div>
        <motion.div className="about-copy" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <p className="eyebrow">About NS Fitness Club</p>
          <h2>We don&apos;t just build muscles.<br /><span>We build confidence.</span></h2>
          <p>NS Fitness Club is a fitness destination focused on strength, discipline, consistency, personal transformation, and community.</p>
          <p>Every detail is designed to help you train with purpose—from structured workouts to a motivating environment that keeps you moving forward.</p>
          <button className="text-link" onClick={() => scrollTo("programs")}>Discover our approach <ArrowRight size={18} /></button>
        </motion.div>
      </section>

      <section id="programs" className="section programs-section">
        <div className="section-heading">
          <div><p className="eyebrow">Training programs</p><h2>Train for your <span>next level.</span></h2></div>
          <p>Purpose-built training options for every stage of your fitness journey.</p>
        </div>
        <div className="program-grid">
          {programs.map((program, index) => (
            <motion.article className="program-card" key={program.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}>
              <Image src={program.image} alt={`${program.name} at NS Fitness Club`} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" />
              <div className="program-shade" />
              <div className="program-copy">
                <span>0{index + 1}</span>
                <h3>{program.name}</h3>
                <p>{program.description}</p>
                <button onClick={() => scrollTo("contact")}>Explore program <ArrowRight size={16} /></button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="facilities" className="section facilities-section">
        <div className="section-heading">
          <div><p className="eyebrow">Facilities &amp; equipment</p><h2>Built for <span>performance.</span></h2></div>
        </div>
        <div className="facility-grid">
          {[
            ["Strength Equipment", "https://images.unsplash.com/photo-1533681473957-a7f8b2c9e0de?auto=format&fit=crop&w=1200&q=85", "large"],
            ["Cardio Equipment", "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=900&q=85", ""],
            ["Free Weights", "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?auto=format&fit=crop&w=900&q=85", ""],
            ["Training Zones", "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=900&q=85", ""]
          ].map(([name, image, size]) => (
            <article className={`facility-card ${size}`} key={name}>
              <Image src={image} alt={name} fill sizes="(max-width: 700px) 100vw, 50vw" />
              <div className="facility-overlay"><h3>{name}</h3><ArrowRight size={20} /></div>
            </article>
          ))}
        </div>
      </section>

      <section id="trainers" className="section trainers-section">
        <div className="section-heading centered">
          <p className="eyebrow">Personal trainers</p>
          <h2>Train with purpose.<br /><span>Achieve with confidence.</span></h2>
        </div>
        <div className="trainer-grid">
          {[1, 2, 3].map((item) => (
            <article className="trainer-card" key={item}>
              <div className="trainer-image">
                <Image
                  src={item === 1 ? "https://images.unsplash.com/photo-1567013127542-490d757e6349?auto=format&fit=crop&w=900&q=85" : item === 2 ? "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=900&q=85" : "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=85"}
                  alt="Editable trainer profile placeholder"
                  fill
                  sizes="(max-width: 700px) 100vw, 33vw"
                />
              </div>
              <h3>Trainer Name {item}</h3>
              <p className="trainer-role">Specialization placeholder</p>
              <p>Replace with the trainer&apos;s genuine biography and qualifications.</p>
            </article>
          ))}
        </div>
      </section>

      <section id="membership" className="section membership-section">
        <div className="membership-intro">
          <p className="eyebrow">Membership</p>
          <h2>Your fitness journey.<br /><span>Your benefits.</span></h2>
        </div>
        <div className="benefit-grid">
          {[
            { Icon: Dumbbell, title: "Equipment Access", copy: "Training access with available gym equipment." },
            { Icon: Target, title: "Professional Support", copy: "Guidance from a supportive team." },
            { Icon: Activity, title: "Structured Guidance", copy: "A clear direction for your fitness goals." },
            { Icon: Users, title: "Community", copy: "A motivating environment and fitness community." },
            { Icon: Zap, title: "Personal Training", copy: "Individual training options tailored to your needs." },
            { Icon: TrendingUp, title: "Progress Tracking", copy: "Monitor and review your fitness progress." }
          ].map(({ Icon, title, copy }) => (
            <motion.article className="benefit-card" key={title} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <Icon size={30} />
              <h3>{title}</h3>
              <p>{copy}</p>
            </motion.article>
          ))}
        </div>
        <button className="button button-gold membership-cta" onClick={() => scrollTo("contact")}>Discover membership</button>
      </section>

      <section className="why-section">
        <div className="why-copy">
          <p className="eyebrow">Why NS Fitness Club</p>
          <h2>More than a place<br />to train.</h2>
        </div>
        <div className="why-list">
          {["Quality fitness equipment", "Motivating environment", "Supportive trainers", "Fitness-focused community", "Training for every level"].map((item, index) => (
            <div key={item}><span>0{index + 1}</span><h3>{item}</h3><Check /></div>
          ))}
        </div>
      </section>

      <section className="section testimonial-section">
        <div className="testimonial-heading">
          <p className="eyebrow">Member stories</p>
          <h2>Real motivation.<br /><span>Shared progress.</span></h2>
        </div>
        <div className="testimonial-card">
          <div className="stars">{[1,2,3,4,5].map((star) => <Star key={star} size={17} fill="currentColor" />)}</div>
          <blockquote>&ldquo;{testimonials[testimonial].text}&rdquo;</blockquote>
          <p><strong>{testimonials[testimonial].name}</strong><br /><span>{testimonials[testimonial].role}</span></p>
          <div className="testimonial-controls">
            <button aria-label="Previous testimonial" onClick={() => setTestimonial(testimonial === 0 ? testimonials.length - 1 : testimonial - 1)}>←</button>
            <button aria-label="Next testimonial" onClick={() => setTestimonial((testimonial + 1) % testimonials.length)}>→</button>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <Image src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=2200&q=85" alt="Athlete working out" fill sizes="100vw" />
        <div className="cta-overlay" />
        <div className="cta-copy">
          <p className="eyebrow">Your next chapter</p>
          <h2>Your transformation<br /><span>starts here.</span></h2>
          <p>Take the first step toward a stronger, healthier version of yourself.</p>
          <button className="button button-gold" onClick={() => scrollTo("contact")}>Join NS Fitness Club</button>
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div className="contact-details">
          <p className="eyebrow">Visit &amp; contact</p>
          <h2>Start your<br /><span>fitness journey.</span></h2>
          <div className="detail-row"><MapPin /><div><strong>Address</strong><p>{gym.address}</p></div></div>
          <div className="detail-row"><Phone /><div><strong>Phone</strong><p>{gym.phone}</p></div></div>
          <div className="detail-row"><Mail /><div><strong>Email</strong><p>{gym.email}</p></div></div>
          <div className="detail-row"><Clock /><div><strong>Opening hours</strong><p>{gym.openingHours}</p></div></div>
          <a className="whatsapp-button" href={`https://wa.me/${gym.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Chat on WhatsApp</a>
        </div>
        <div className="contact-form-wrap">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-grid">
              <label>Full name<input autoComplete="name" {...register("fullName", { required: "Please enter your name", minLength: { value: 2, message: "Name must be at least 2 characters" }, maxLength: { value: 100, message: "Name must be 100 characters or fewer" } })} placeholder="Your name" />{errors.fullName && <span>{errors.fullName.message}</span>}</label>
              <label>Phone number<input type="tel" autoComplete="tel" {...register("phoneNumber", { required: "Please enter your phone number", validate: (value) => isValidIndianMobileNumber(value) || "Enter a valid 10-digit Indian mobile number" })} placeholder="+91 98765 43210" />{errors.phoneNumber && <span>{errors.phoneNumber.message}</span>}</label>
              <label>Email<input type="email" {...register("email", { required: "Please enter your email", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" } })} placeholder="you@example.com" />{errors.email && <span>{errors.email.message}</span>}</label>
              <label>Interested program<select {...register("interestedProgram", { required: "Please select a program" })}><option value="">Select a program</option>{programs.map((program) => <option key={program.name}>{program.name}</option>)}</select>{errors.interestedProgram && <span>{errors.interestedProgram.message}</span>}</label>
              <label className="full-field">Message<textarea {...register("message", { required: "Please add a message", minLength: { value: 10, message: "Please provide at least 10 characters of detail" }, maxLength: { value: 2000, message: "Message must be 2,000 characters or fewer" } })} placeholder="Tell us about your fitness goals" />{errors.message && <span>{errors.message.message}</span>}</label>
            </div>
            <button className="button button-gold form-button" type="submit" disabled={formStatus === "loading"}>
              {formStatus === "loading" ? "Sending..." : "Send Enquiry"} <ArrowRight size={17} />
            </button>
            {formStatus === "success" && <p className="form-message success" role="status">Thank you. Your enquiry has been submitted.</p>}
            {formStatus === "error" && <p className="form-message error" role="alert">{formError}</p>}
          </form>
        </div>
      </section>

      <footer>
        <div className="footer-brand"><Logo /><p>A premium fitness community built around strength, discipline, and consistent progress.</p></div>
        <div><h3>Explore</h3>{navItems.slice(0, 5).map((item, index) => <button key={item} onClick={() => scrollTo(sectionIds[index])}>{item}</button>)}</div>
        <div><h3>Contact</h3><p>{gym.address}</p><p>{gym.phone}</p><p>{gym.email}</p></div>
        <div className="footer-social"><h3>Follow</h3><a href={gym.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram /></a><a href={gym.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook /></a><a href={`https://wa.me/${gym.whatsapp}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle /></a></div>
        <div className="footer-bottom"><p>© {new Date().getFullYear()} NS Fitness Club. All rights reserved.</p></div>
      </footer>
    </main>
  );
}

