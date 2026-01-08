// src/app/api/upload/route.js

import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

// Ensure directory exists
async function ensureDir(dir) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    // Directory already exists, ignore
  }
}

// Get category and folder based on MIME type
function getCategoryAndFolder(mimeType) {
  if (mimeType.startsWith("image/")) {
    return { category: "image", folder: "image" };
  } else if (mimeType.startsWith("video/")) {
    return { category: "video", folder: "video" };
  } else {
    return { category: "doc", folder: "docs" };
  }
}

// Validate file type
function isAllowedFileType(mimeType) {
  const allowed = [
    "image/",
    "video/",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",
  ];

  return allowed.some((type) => mimeType.startsWith(type));
}

export async function POST(req) {
  try {
    // Verify JWT token
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.substring(7);

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const userId = payload.userId;

    // Parse FormData
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file with type and size
    if (!isAllowedFileType(file.type)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
    }

    // Check file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 100MB limit" }, { status: 400 });
    }

    // Get category and folder
    const { category, folder } = getCategoryAndFolder(file.type);

    // Create upload path
    const MEDIA_DIR = path.join(process.cwd(), "media");
    const uploadPath = path.join(MEDIA_DIR, folder);
    await ensureDir(uploadPath);

    // Generate unique filename
    const ext = path.extname(file.name);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const filePath = path.join(uploadPath, uniqueName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Save user metadata to database
    const media = await prisma.media.create({
      data: {
        userId,
        originalName: file.name,
        fileName: uniqueName,
        filePath: filePath,
        mimeType: file.type,
        size: file.size,
        category,
      },
    });

    return NextResponse.json({ 
      message: "File uploaded successfully", 
      media 
    }, { status: 201 });

  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ 
      error: err.message || "Upload failed" 
    }, { status: 500 });
  }
}