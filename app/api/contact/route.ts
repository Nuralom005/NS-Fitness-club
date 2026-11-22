import { NextResponse } from "next/server";
import { gym, type ContactEnquiry } from "@/lib/gym";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function invalid(message: string) {
  return NextResponse.json({ message }, { status: 400 });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateEnquiry(value: unknown): { enquiry?: ContactEnquiry; error?: string } {
  if (!isRecord(value)) return { error: "Please submit valid contact details." };

  const fullName = typeof value.fullName === "string" ? value.fullName.trim() : "";
  const phoneNumber = typeof value.phoneNumber === "string" ? value.phoneNumber.trim() : "";
  const email = typeof value.email === "string" ? value.email.trim() : "";
  const interestedProgram = typeof value.interestedProgram === "string" ? value.interestedProgram.trim() : "";
  const message = typeof value.message === "string" ? value.message.trim() : "";

  if (fullName.length < 2) return { error: "Please enter your full name (at least 2 characters)." };
  if (fullName.length > 100 || /[\u0000-\u001f\u007f]/.test(fullName)) {
    return { error: "Name must be 100 characters or fewer and contain no line breaks." };
  }

  if (!phoneNumber) return { error: "Please enter your phone number." };
  if (phoneNumber.length > 25 || !/^\+?[\d\s().-]+$/.test(phoneNumber)) {
    return { error: "Enter a valid Indian mobile number, such as +91 98765 43210." };
  }
  let phoneDigits = phoneNumber.replace(/\D/g, "");
  if (phoneDigits.length === 12 && phoneDigits.startsWith("91")) phoneDigits = phoneDigits.slice(2);
  if (phoneDigits.length === 11 && phoneDigits.startsWith("0")) phoneDigits = phoneDigits.slice(1);
  if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
    return { error: "Enter a valid 10-digit Indian mobile number, optionally with the +91 country code." };
  }

  if (!email) return { error: "Please enter your email address." };
  if (email.length > 254 || !emailPattern.test(email)) return { error: "Enter a valid email address." };

  if (!interestedProgram) return { error: "Please select an interested program." };
  if (interestedProgram.length > 100 || /[\u0000-\u001f\u007f]/.test(interestedProgram)) {
    return { error: "Please select a valid program." };
  }

  if (!message) return { error: "Please add a message about your fitness goals." };
  if (message.length < 10) return { error: "Please provide at least 10 characters of detail in your message." };
  if (message.length > 2000) return { error: "Message must be 2,000 characters or fewer." };

  return { enquiry: { fullName, phoneNumber, email, interestedProgram, message } };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return invalid("Please submit a valid JSON contact form.");
  }

  const { enquiry, error } = validateEnquiry(body);
  if (!enquiry) return invalid(error ?? "Please check your contact details and try again.");

  const receivedAt = new Date().toISOString();
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    console.info("[contact] enquiry logged", JSON.stringify({ receivedAt, ...enquiry }));
    return NextResponse.json({ message: "Your enquiry has been received." });
  }

  try {
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [gym.email],
        reply_to: enquiry.email,
        subject: `Website enquiry from ${enquiry.fullName}`,
        text: [
          `Name: ${enquiry.fullName}`,
          `Phone: ${enquiry.phoneNumber}`,
          `Email: ${enquiry.email}`,
          `Interested program: ${enquiry.interestedProgram}`,
          "",
          "Message:",
          enquiry.message
        ].join("\n")
      })
    });

    if (!emailResponse.ok) {
      const providerError = await emailResponse.text();
      console.error("[contact] email delivery failed", JSON.stringify({ receivedAt, enquiry, status: emailResponse.status, providerError }));
      return NextResponse.json(
        { message: "We couldn't send your enquiry right now. Please try again or contact the club directly." },
        { status: 502 }
      );
    }
  } catch (deliveryError) {
    console.error("[contact] email delivery failed", JSON.stringify({ receivedAt, enquiry, error: String(deliveryError) }));
    return NextResponse.json(
      { message: "We couldn't send your enquiry right now. Please try again or contact the club directly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ message: "Your enquiry has been sent successfully." });
}

