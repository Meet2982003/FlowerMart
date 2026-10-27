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

interface ImageItem {
  id: string;
  index: number;
  filename: string;
  url: string;
  name: string;
  des: string;
}

interface CustomFolderMeta {
  title?: string;
  description?: string;
  des?: string;
  tag?: string;
  link?: string;
  coverImage?: string;
  category?: string;
}

function formatFolderName(name: string): string {
  const lower = name.toLowerCase().trim();
  if (lower === "decorated cars" || lower === "decorated-cars" || lower === "decorated_cars") {
    return "Decorated Cars";
  }
  if (lower === "mundup" || lower === "mandap") {
    return "Royal Mandap Decorations";
  }
  if (lower === "parties" || lower === "party") {
    return "Celebration & Party Decor";
  }
  if (lower === "engagement") {
    return "Engagement Floral Styling";
  }
  return name
    .replace(/^[\d\s-_]+/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function getDefaultDescription(folderName: string): string {
  const lower = folderName.toLowerCase().trim();
  if (lower.includes("car")) {
    return "Bespoke bridal car decor, floral hood arrangements, and luxury wedding fleet styling handcrafted with fresh premium blooms.";
  }
  if (lower.includes("mandap") || lower.includes("mundup")) {
    return "Grand ceremonial mandaps, cascading floral pillars, and sacred floral canopies designed for unforgettable wedding vows.";
  }
  if (lower.includes("part")) {
    return "Dramatic banquet centerpieces, fairy-light floral chandeliers, and enchanting event installations for gala evenings.";
  }
  if (lower.includes("engage")) {
    return "Romantic pastel ring-ceremony stages, delicate floral arches, and ethereal photo-backdrops.";
  }
  return "Bespoke floral styling designed with international grade blooms for extraordinary luxury events.";
}

export async function GET() {
  try {
    const carouselDir = path.join(process.cwd(), "public", "assets", "carousel");

    if (!fs.existsSync(carouselDir)) {
      fs.mkdirSync(carouselDir, { recursive: true });
    }

    // Read metadata.json if available
    let metadata: Record<string, CustomFolderMeta> = {};
    const metaFilePath = path.join(carouselDir, "metadata.json");
    if (fs.existsSync(metaFilePath)) {
      try {
        const raw = await fs.promises.readFile(metaFilePath, "utf-8");
        metadata = JSON.parse(raw);
      } catch (e) {
        console.error("Error reading metadata.json:", e);
      }
    }

    const entries = await fs.promises.readdir(carouselDir, { withFileTypes: true });

    // 1. Process subdirectories (e.g., "decorated cars", "mundup", "parties", "engagement")
    const folderEntries = entries.filter(
      (e) => e.isDirectory() && !e.name.startsWith(".")
    );

    const folderSlides = [];

    for (let i = 0; i < folderEntries.length; i++) {
      const folder = folderEntries[i];
      const folderPath = path.join(carouselDir, folder.name);

      const subFiles = await fs.promises.readdir(folderPath);
      const imageFiles = subFiles
        .filter((file) => {
          if (file.startsWith(".")) return false;
          const ext = path.extname(file).toLowerCase();
          return SUPPORTED_EXTENSIONS.has(ext);
        })
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

      if (imageFiles.length === 0) continue;

      // Metadata lookup for this folder
      const customMeta: CustomFolderMeta =
        metadata[folder.name] ||
        metadata[folder.name.toLowerCase()] ||
        metadata[folder.name.replace(/[-_]+/g, " ")] ||
        {};

      const cleanTitle = customMeta.title || formatFolderName(folder.name);
      const description = customMeta.description || customMeta.des || getDefaultDescription(folder.name);
      const tag =
        customMeta.tag ||
        `${cleanTitle.toUpperCase()} • ${imageFiles.length} PHOTOS`;
      const link = customMeta.link || `#gallery`;

      // Select cover image: custom override if present in images, else the 1st image
      let coverImage = imageFiles[0];
      if (customMeta.coverImage && imageFiles.includes(customMeta.coverImage)) {
        coverImage = customMeta.coverImage;
      }

      const coverImageUrl = `/assets/carousel/${encodeURIComponent(folder.name)}/${encodeURIComponent(coverImage)}`;

      // Put cover image first in the list
      const orderedFiles = [
        coverImage,
        ...imageFiles.filter((f) => f !== coverImage),
      ];

      const allImages: ImageItem[] = orderedFiles.map((imgFilename, idx) => {
        const imgParsed = path.parse(imgFilename);
        const imgMeta = metadata[imgFilename] || metadata[imgParsed.name] || {};
        return {
          id: `${folder.name}-${idx + 1}`,
          index: idx + 1,
          filename: imgFilename,
          url: `/assets/carousel/${encodeURIComponent(folder.name)}/${encodeURIComponent(imgFilename)}`,
          name: imgMeta.title || `${cleanTitle} #${idx + 1}`,
          des: imgMeta.description || imgMeta.des || "",
        };
      });

      folderSlides.push({
        id: `folder-${i + 1}`,
        folder: folder.name,
        isFolder: true,
        photosCount: allImages.length,
        filename: coverImage,
        image: coverImageUrl,
        tag,
        title: cleanTitle,
        name: cleanTitle,
        subtitle: description,
        des: description,
        link,
        allImages,
      });
    }

    // 2. Process loose standalone image files directly in public/assets/carousel/
    const looseFiles = entries.filter((e) => {
      if (e.isDirectory() || e.name.startsWith(".") || e.name.toLowerCase() === "metadata.json") return false;
      const ext = path.extname(e.name).toLowerCase();
      return SUPPORTED_EXTENSIONS.has(ext);
    });

    const looseSlides = looseFiles.map((file, index) => {
      const nameWithoutExt = path.parse(file.name).name;
      const customMeta: CustomFolderMeta =
        metadata[file.name] || metadata[nameWithoutExt] || {};

      const cleanTitle =
        customMeta.title ||
        nameWithoutExt
          .replace(/^[\d\s-_]+/, "")
          .replace(/[-_]+/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
          .trim() ||
        `Floral Special ${index + 1}`;

      const description =
        customMeta.description ||
        customMeta.des ||
        "Delivered fresh from our sustainable floral collection.";
      const tag = customMeta.tag || `COLLECTION ${String(index + 1).padStart(2, "0")}`;
      const link = customMeta.link || "#gallery";
      const imageUrl = `/assets/carousel/${encodeURIComponent(file.name)}`;

      return {
        id: `file-${index + 1}`,
        folder: "",
        isFolder: false,
        photosCount: 1,
        filename: file.name,
        image: imageUrl,
        tag,
        title: cleanTitle,
        name: cleanTitle,
        subtitle: description,
        des: description,
        link,
        allImages: [
          {
            id: `file-${index + 1}-1`,
            index: 1,
            filename: file.name,
            url: imageUrl,
            name: cleanTitle,
            des: description,
          },
        ],
      };
    });

    // Subfolder collections come first, then loose files
    const allSlides = [...folderSlides, ...looseSlides];

    return NextResponse.json({
      success: true,
      count: allSlides.length,
      categoriesCount: folderSlides.length,
      slides: allSlides,
    });
  } catch (error) {
    console.error("Error reading carousel directory:", error);
    return NextResponse.json({ success: false, slides: [] }, { status: 500 });
  }
}
