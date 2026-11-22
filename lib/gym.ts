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

