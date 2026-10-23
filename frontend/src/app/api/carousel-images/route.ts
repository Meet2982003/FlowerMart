import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SUPPORTED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".gif",
  ".svg",
]);

export async function GET() {
  try {
    const carouselDir = path.join(process.cwd(), "public", "assets", "carousel");

    if (!fs.existsSync(carouselDir)) {
      fs.mkdirSync(carouselDir, { recursive: true });
    }

    const files = await fs.promises.readdir(carouselDir);

    // Check for optional metadata.json for custom titles, descriptions, and tags
    let metadata: Record<string, { title?: string; description?: string; des?: string; tag?: string; link?: string }> = {};
    const metaFilePath = path.join(carouselDir, "metadata.json");
    if (fs.existsSync(metaFilePath)) {
      try {
        const raw = await fs.promises.readFile(metaFilePath, "utf-8");
        metadata = JSON.parse(raw);
      } catch (e) {
        console.error("Error reading metadata.json:", e);
      }
    }

    const imageFiles = files
      .filter((file) => {
        // Exclude hidden files or system files and json config
        if (file.startsWith(".") || file.toLowerCase() === "metadata.json") return false;
        const ext = path.extname(file).toLowerCase();
        return SUPPORTED_EXTENSIONS.has(ext);
      })
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

    const slides = imageFiles.map((filename, index) => {
      const nameWithoutExt = path.parse(filename).name;

      // Look up custom metadata by full filename, filename without extension, or 1-based index
      const customMeta = metadata[filename] || metadata[nameWithoutExt] || metadata[String(index + 1)] || {};

      const cleanTitle = customMeta.title || nameWithoutExt
        .replace(/^[\d\s-_]+/, "")
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim() || `Gallery Photo ${index + 1}`;

      const description = customMeta.description || customMeta.des || "Delivered fresh from our sustainable floral collection.";
      const tag = customMeta.tag || `COLLECTION ${String(index + 1).padStart(2, "0")}`;
      const link = customMeta.link || "#inspiration";

      return {
        id: index + 1,
        filename,
        image: `/assets/carousel/${filename}`,
        tag,
        title: cleanTitle,
        subtitle: description,
        link,
      };
    });

    return NextResponse.json({
      success: true,
      count: slides.length,
      slides,
    });
  } catch (error) {
    console.error("Error reading carousel directory:", error);
    return NextResponse.json({ success: false, slides: [] }, { status: 500 });
  }
}
