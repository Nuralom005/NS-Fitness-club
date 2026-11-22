"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { ArrowRight, Quote, Star, X } from "lucide-react";

type Review = {
  id: string;
  memberName: string;
  program: string;
  rating: number;
  text: string;
  createdAt: string;
  sampleAge?: string;
  isSample?: boolean;
};

type ReviewFormErrors = Partial<Record<"memberName" | "program" | "rating" | "text", string>>;

const storageKey = "ns-fitness-club-member-reviews-v1";
const reviewPrograms = [
  "Strength Training",
  "Personal Training",
  "Weight Management",
  "Cardio Training",
  "Functional Training",
  "Group Training"
];

const sampleReviews: Review[] = [
  {
    id: "sample-review-1",
    memberName: "Aarav S.",
    program: "Strength Training",
    rating: 5,
    text: "The equipment is well maintained and the atmosphere keeps me focused. I have built a training routine I can stick to.",
    createdAt: "2026-11-20T10:00:00.000Z",
    sampleAge: "2 days ago",
    isSample: true
  },
  {
    id: "sample-review-2",
    memberName: "Simran K.",
    program: "Personal Training",
    rating: 5,
    text: "The trainer helped me feel comfortable with a new routine and gave me clear guidance throughout each session.",
    createdAt: "2026-11-17T10:00:00.000Z",
    sampleAge: "5 days ago",
    isSample: true
  },
  {
    id: "sample-review-3",
    memberName: "Rohan M.",
    program: "Weight Management",
    rating: 4,
    text: "A welcoming gym with a good range of equipment. The team has helped me stay consistent with my fitness goals.",
    createdAt: "2026-11-13T10:00:00.000Z",
    sampleAge: "1 week ago",
    isSample: true
  },
  {
    id: "sample-review-4",
    memberName: "Neha G.",
    program: "Group Training",
    rating: 5,
    text: "Group sessions are energetic and motivating. It is a friendly place to train and make steady progress.",
    createdAt: "2026-11-10T10:00:00.000Z",
    sampleAge: "2 weeks ago",
    isSample: true
  }
];

function isStoredReview(value: unknown): value is Review {
  if (typeof value !== "object" || value === null) return false;
  const review = value as Partial<Review>;
  return typeof review.id === "string"
    && typeof review.memberName === "string"
    && typeof review.program === "string"
    && reviewPrograms.includes(review.program)
    && typeof review.rating === "number"
    && review.rating >= 1
    && review.rating <= 5
    && typeof review.text === "string"
    && review.text.length <= 300
    && typeof review.createdAt === "string"
    && Number.isFinite(Date.parse(review.createdAt));
}

function relativeDate(date: string) {
  const elapsed = Math.max(0, Date.now() - Date.parse(date));
  const hours = Math.floor(elapsed / (60 * 60 * 1000));
  const days = Math.floor(hours / 24);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (hours < 1) return "Just now";
  if (hours < 24) return formatter.format(-hours, "hour");
  if (days < 30) return formatter.format(-days, "day");
  const months = Math.floor(days / 30);
  if (months < 12) return formatter.format(-months, "month");
  return formatter.format(-Math.floor(days / 365), "year");
}

function reviewId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function MemberReviews() {
  const [submittedReviews, setSubmittedReviews] = useState<Review[]>([]);
  const [hasLoadedReviews, setHasLoadedReviews] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [program, setProgram] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [errors, setErrors] = useState<ReviewFormErrors>({});
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let savedReviews: Review[] = [];
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) savedReviews = parsed.filter(isStoredReview);
      }
    } catch {
      // Keep the seeded reviews available if local storage is blocked or invalid.
    }
    setSubmittedReviews(savedReviews);
    setHasLoadedReviews(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedReviews) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(submittedReviews));
    } catch {
      // The review still appears for this session if storage is unavailable.
    }
  }, [hasLoadedReviews, submittedReviews]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 4500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const reviews = useMemo(() => [...submittedReviews, ...sampleReviews], [submittedReviews]);
  const averageRating = reviews.length
    ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
    : 0;
  const visibleRating = hoverRating || rating;

  const handleRatingKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentRating: number) => {
    if (!["ArrowRight", "ArrowUp", "ArrowLeft", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextRating = currentRating;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") nextRating = Math.min(5, currentRating + 1);
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") nextRating = Math.max(1, currentRating - 1);
    if (event.key === "Home") nextRating = 1;
    if (event.key === "End") nextRating = 5;
    setRating(nextRating);
    setErrors((current) => ({ ...current, rating: undefined }));
    document.getElementById(`review-rating-${nextRating}`)?.focus();
  };

  const submitReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: ReviewFormErrors = {};
    const cleanName = memberName.trim();
    const cleanText = reviewText.trim();

    if (cleanName.length < 2) nextErrors.memberName = "Enter your name (at least 2 characters).";
    if (!reviewPrograms.includes(program)) nextErrors.program = "Select a program or membership.";
    if (rating < 1 || rating > 5) nextErrors.rating = "Choose a star rating.";
    if (cleanText.length < 10) nextErrors.text = "Write at least 10 characters about your experience.";
    else if (cleanText.length > 300) nextErrors.text = "Reviews can be up to 300 characters.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const nextReview: Review = {
      id: reviewId(),
      memberName: cleanName,
      program,
      rating,
      text: cleanText,
      createdAt: new Date().toISOString()
    };
    const nextReviews = [nextReview, ...submittedReviews];
    setSubmittedReviews(nextReviews);
    setMemberName("");
    setProgram("");
    setRating(0);
    setReviewText("");
    setFormOpen(false);

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextReviews));
      setNotice("Thanks for sharing your experience. Your review has been saved on this device.");
    } catch {
      setNotice("Thanks for sharing your experience. Your review is visible for this session.");
    }
  };

  return (
    <section className="section reviews-section" aria-labelledby="member-reviews-title">
      <div className="reviews-heading">
        <p className="eyebrow">Member stories &amp; reviews</p>
        <h2 id="member-reviews-title">Real motivation.<br /><span>Shared progress.</span></h2>
        <p>Experiences from the NS Fitness Club community in Greater Noida.</p>
      </div>

      <div className="review-summary-bar">
        <div className="review-summary-rating">
          <div className="review-summary-stars" role="img" aria-label={`${averageRating.toFixed(1)} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={18} fill="currentColor" aria-hidden="true" />)}
          </div>
          <p><strong>{averageRating.toFixed(1)}</strong><span> / 5.0</span></p>
          <span className="review-count" aria-live="polite" aria-atomic="true">{reviews.length} {reviews.length === 1 ? "review" : "reviews"}</span>
        </div>
        <button
          className="button button-gold write-review-button"
          type="button"
          aria-expanded={formOpen}
          aria-controls="member-review-form"
          onClick={() => setFormOpen((open) => !open)}
        >
          {formOpen ? "Close Form" : "Write a Review"} {formOpen ? <X size={16} aria-hidden="true" /> : <ArrowRight size={16} aria-hidden="true" />}
        </button>
      </div>

      {notice && <p className="review-toast" role="status">{notice}</p>}

      <div id="member-review-form" className="review-form-panel" hidden={!formOpen}>
        <div className="review-form-heading">
          <div>
            <p className="eyebrow">Your experience matters</p>
            <h3>Write a member review</h3>
          </div>
          <button className="review-form-close" type="button" aria-label="Close review form" onClick={() => setFormOpen(false)}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <form className="review-form" onSubmit={submitReview} noValidate>
          <label className="review-form-field">
            <span>Member name</span>
            <input value={memberName} onChange={(event) => setMemberName(event.target.value)} maxLength={60} autoComplete="name" aria-invalid={Boolean(errors.memberName)} aria-describedby={errors.memberName ? "review-name-error" : undefined} placeholder="Your name" />
            {errors.memberName && <small id="review-name-error" className="review-field-error">{errors.memberName}</small>}
          </label>
          <label className="review-form-field">
            <span>Program / membership</span>
            <select value={program} onChange={(event) => setProgram(event.target.value)} aria-invalid={Boolean(errors.program)} aria-describedby={errors.program ? "review-program-error" : undefined}>
              <option value="">Select a program</option>
              {reviewPrograms.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            {errors.program && <small id="review-program-error" className="review-field-error">{errors.program}</small>}
          </label>
          <fieldset className="review-rating-field">
            <legend>Your rating</legend>
            <div className="review-rating-selector" role="radiogroup" aria-label="Choose a rating from 1 to 5 stars" aria-describedby={errors.rating ? "review-rating-error" : undefined}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  id={`review-rating-${star}`}
                  key={star}
                  type="button"
                  className={`review-rating-star${star <= visibleRating ? " selected" : ""}`}
                  role="radio"
                  aria-checked={rating === star}
                  aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
                  tabIndex={rating === star || (rating === 0 && star === 1) ? 0 : -1}
                  onClick={() => { setRating(star); setErrors((current) => ({ ...current, rating: undefined })); }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onFocus={() => setHoverRating(star)}
                  onBlur={() => setHoverRating(0)}
                  onKeyDown={(event) => handleRatingKeyDown(event, star)}
                >
                  <Star size={32} fill={star <= visibleRating ? "currentColor" : "none"} aria-hidden="true" />
                </button>
              ))}
            </div>
            {errors.rating && <small id="review-rating-error" className="review-field-error">{errors.rating}</small>}
          </fieldset>
          <label className="review-form-field review-form-full">
            <span>Review</span>
            <textarea value={reviewText} onChange={(event) => setReviewText(event.target.value.slice(0, 300))} maxLength={300} rows={4} aria-invalid={Boolean(errors.text)} aria-describedby={errors.text ? "review-text-error review-character-count" : "review-character-count"} placeholder="Share a few words about your experience at the club" />
            <span className="review-character-count" id="review-character-count">{reviewText.length}/300 characters</span>
            {errors.text && <small id="review-text-error" className="review-field-error">{errors.text}</small>}
          </label>
          <div className="review-form-actions review-form-full">
            <p>Reviews are saved in this browser on this device.</p>
            <button className="button button-gold post-review-button" type="submit">Post Review <ArrowRight size={16} aria-hidden="true" /></button>
          </div>
        </form>
      </div>

      <div className="member-review-grid">
        {reviews.map((review) => (
          <article className="member-review-card" key={review.id}>
            <div className="member-review-card-top">
              <div className="member-review-stars" role="img" aria-label={`${review.rating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((star) => <Star key={star} size={15} fill={star <= review.rating ? "currentColor" : "none"} aria-hidden="true" />)}
              </div>
              <Quote className="member-review-quote" size={27} fill="currentColor" aria-hidden="true" />
            </div>
            {review.isSample && <span className="member-review-sample">Sample review</span>}
            <blockquote>{review.text}</blockquote>
            <div className="member-review-meta">
              <div className="member-review-avatar" aria-hidden="true">{review.memberName.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</div>
              <div className="member-review-author">
                <strong>{review.memberName}</strong>
                <span>Greater Noida · {review.sampleAge || relativeDate(review.createdAt)}</span>
              </div>
            </div>
            <span className="member-review-program">{review.program}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

