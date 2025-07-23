import QRCode from "qrcode";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export interface QRCodeOptions {
  size?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
  type?: "png" | "svg";
}

export async function generateQRCode(
  url: string,
  options: QRCodeOptions = {}
): Promise<string> {
  try {
    const {
      size = 300,
      margin = 4,
      color = { dark: "#000000", light: "#FFFFFF" },
      errorCorrectionLevel = "M",
      type = "png",
    } = options;

    const qrOptions = {
      width: size,
      margin,
      color,
      errorCorrectionLevel,
      type: type as "png" | "svg",
    };

    if (type === "svg") {
      return await QRCode.toString(url, { ...qrOptions, type: "svg" });
    } else {
      return await QRCode.toDataURL(url, qrOptions);
    }
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
}

export async function saveQRCodeToFile(
  url: string,
  filename: string,
  options: QRCodeOptions = {}
): Promise<string> {
  try {
    const {
      size = 300,
      margin = 4,
      color = { dark: "#000000", light: "#FFFFFF" },
      errorCorrectionLevel = "M",
    } = options;

    // Ensure the public/qr directory exists
    const qrDir = join(process.cwd(), "public", "qr");
    await mkdir(qrDir, { recursive: true });

    const filePath = join(qrDir, `${filename}.png`);
    const relativePath = `/qr/${filename}.png`;

    const qrOptions = {
      width: size,
      margin,
      color,
      errorCorrectionLevel,
    };

    // Generate QR code buffer
    const qrBuffer = await QRCode.toBuffer(url, qrOptions);

    // Save to file
    await writeFile(filePath, qrBuffer);

    return relativePath;
  } catch (error) {
    console.error("Error saving QR code to file:", error);
    throw new Error("Failed to save QR code");
  }
}

export async function generateCustomQRCode(
  url: string,
  customization: {
    logo?: string;
    backgroundColor?: string;
    foregroundColor?: string;
    cornerRadius?: number;
    style?: "square" | "rounded" | "dot";
  } = {}
): Promise<string> {
  try {
    const {
      backgroundColor = "#FFFFFF",
      foregroundColor = "#000000",
      style = "square",
    } = customization;

    const qrOptions = {
      width: 300,
      margin: 4,
      color: {
        dark: foregroundColor,
        light: backgroundColor,
      },
      errorCorrectionLevel: "H" as const, // High error correction for logos
    };

    // Generate basic QR code
    const qrDataUrl = await QRCode.toDataURL(url, qrOptions);

    // For now, return the basic QR code
    // In a full implementation, you would use a library like 'qrcode-with-logos'
    // or implement custom drawing logic for logos and styling
    return qrDataUrl;
  } catch (error) {
    console.error("Error generating custom QR code:", error);
    throw new Error("Failed to generate custom QR code");
  }
}

export function validateQRCodeUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function getQRCodeAnalytics(qrId: string) {
  // This would integrate with your analytics system
  // For now, return mock data
  return {
    scans: 0,
    uniqueScans: 0,
    locations: [],
    devices: [],
    browsers: [],
    scanHistory: [],
  };
}
