import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractFlyerCategory } from "./utils";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface ExtractedFlyerData {
  title: string;
  description: string;
  date?: string;
  time?: string;
  location?: string;
  address?: string;
  contact?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  ctaButtons?: {
    primary?: { text: string; action: string };
    secondary?: { text: string; action: string };
  };
  images?: string[];
  category?: string;
  price?: string;
  organizer?: string;
  tags?: string[];
}

export async function extractFlyerData(
  imageBuffer: Buffer,
  mimeType: string
): Promise<ExtractedFlyerData> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Analyze this flyer image and extract all relevant information in a structured format. 
      Please provide the following information if available:
      
      1. Title/Headline
      2. Description/Details
      3. Date and Time
      4. Location/Address
      5. Contact information (email, phone, website)
      6. Social media links
      7. Call-to-action buttons or instructions
      8. Price information
      9. Organizer/Company name
      10. Any other relevant details
      
      Format the response as a JSON object with clear field names.
      If information is not available, use null for that field.
      
      For call-to-action buttons, suggest appropriate actions like:
      - "RSVP" for events
      - "Buy Now" for products
      - "Apply Now" for jobs
      - "Learn More" for general information
      - "Contact Us" for contact
      
      Also categorize this flyer as one of: Event, Promo, Job, Newsletter
    `;

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON from the response
    let extractedData: ExtractedFlyerData;
    try {
      // Clean the response text to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      // Fallback to basic extraction
      extractedData = {
        title: "Extracted Flyer",
        description: text.substring(0, 200) + "...",
        category: "Event",
      };
    }

    // Auto-categorize if not provided
    if (!extractedData.category) {
      const fullText = `${extractedData.title} ${extractedData.description}`;
      extractedData.category = extractFlyerCategory(fullText);
    }

    // Set default CTA buttons based on category
    if (!extractedData.ctaButtons) {
      extractedData.ctaButtons = getDefaultCTAButtons(extractedData.category);
    }

    return extractedData;
  } catch (error) {
    console.error("Error extracting flyer data:", error);
    throw new Error("Failed to extract flyer data");
  }
}

function getDefaultCTAButtons(category?: string) {
  switch (category) {
    case "Event":
      return {
        primary: { text: "RSVP", action: "rsvp" },
        secondary: { text: "Learn More", action: "info" },
      };
    case "Promo":
      return {
        primary: { text: "Buy Now", action: "buy" },
        secondary: { text: "View Details", action: "details" },
      };
    case "Job":
      return {
        primary: { text: "Apply Now", action: "apply" },
        secondary: { text: "Learn More", action: "info" },
      };
    case "Newsletter":
      return {
        primary: { text: "Subscribe", action: "subscribe" },
        secondary: { text: "Read More", action: "read" },
      };
    default:
      return {
        primary: { text: "Contact Us", action: "contact" },
        secondary: { text: "Learn More", action: "info" },
      };
  }
}

export async function generateFlyerSummary(
  extractedData: ExtractedFlyerData
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Create a concise, engaging summary for a flyer based on this extracted data:
      ${JSON.stringify(extractedData, null, 2)}
      
      The summary should be:
      - 1-2 sentences maximum
      - Highlight the most important information
      - Be engaging and action-oriented
      - Include date/time and location if available
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error generating flyer summary:", error);
    return (
      extractedData.description || "Check out this flyer for more details!"
    );
  }
}
