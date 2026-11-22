export const gym = {
  name: "NS FITNESS CLUB",
  logoPath: "/ns-logo-placeholder.svg",
  phone: "+91 7291072578",
  whatsapp: "7291072578",
  address: "Plot 34 C, KNOWLEDGE PARK-3,NEAR IIMT GROUP OF COLLEGES GREATER NOIDA",
  email: "Nsfclub26@gmail.com",
  openingHours: "Mon - Sat: 6:00 AM - 10:00 PM",
  social: {
    instagram: "https://www.instagram.com/ns_fitness_club26/",
    facebook: "https://facebook.com/"
  },
  contactApi: "/api/contact"
};

export type MembershipPlan = {
  name: string;
  duration: string;
  price: string;
  description: string;
  benefits: string[];
  badge?: string;
};

export const membershipPlans: MembershipPlan[] = [
  {
    name: "1 Month Membership",
    duration: "1 month",
    price: "₹1,000",
    description: "A flexible way to get started with your training routine.",
    benefits: ["1 month of gym access", "Strength and cardio equipment", "Train at your own pace"]
  },
  {
    name: "3 Months Membership",
    duration: "3 months",
    price: "₹2,500",
    description: "Build consistency with a quarter of focused training.",
    benefits: ["3 months of gym access", "Strength and cardio equipment", "Time to build a steady routine"]
  },
  {
    name: "1 Year Membership",
    duration: "12 months",
    price: "₹8,000",
    description: "A full year to stay focused on your fitness goals.",
    benefits: ["12 months of gym access", "Strength and cardio equipment", "Best value for long-term training"],
    badge: "Best value"
  },
  {
    name: "1 Year + Trainer Membership",
    duration: "12 months + personal trainer",
    price: "₹12,000",
    description: "Long-term gym access with personal trainer support included.",
    benefits: ["12 months of gym access", "Personal trainer support included", "Structured guidance and progress tracking"]
  }
];

export type ContactEnquiry = {
  fullName: string;
  phoneNumber: string;
  email: string;
  interestedProgram: string;
  message: string;
};

type ContactApiResponse = {
  message?: unknown;
};

export async function submitContactEnquiry(enquiry: ContactEnquiry): Promise<void> {
  const response = await fetch(gym.contactApi, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(enquiry)
  });

  let result: ContactApiResponse = {};
  try {
    result = await response.json() as ContactApiResponse;
  } catch {
    // Use the generic message below when the server response is not JSON.
  }

  if (!response.ok) {
    throw new Error(
      typeof result.message === "string"
        ? result.message
        : "We couldn't submit your enquiry. Please try again."
    );
  }
}

