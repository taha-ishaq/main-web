// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Base upload directory
// const MEDIA_DIR = path.join(process.cwd(), "media");

// // Ensure folders exist
// const ensureDir = (dir) => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// };

// // Decide folder based on file type
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     let folder = "doc";

//     if (file.mimetype.startsWith("image/")) {
//       folder = "image";
//     } else if (file.mimetype.startsWith("video/")) {
//       folder = "video";
//     }

//     const uploadPath = path.join(MEDIA_DIR, folder);
//     ensureDir(uploadPath);

//     cb(null, uploadPath);
//   },

//   filename: (req, file, cb) => {
//     const uniqueName =
//       Date.now() + "-" + Math.round(Math.random() * 1e9);

//     cb(null, `${uniqueName}${path.extname(file.originalname)}`);
//   },
// });

// // Optional file filter
// const fileFilter = (req, file, cb) => {
//   const allowed = [
//     "image/",
//     "video/",
//     "application/pdf",
//     "application/msword",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   ];

//   const isAllowed = allowed.some((type) =>
//     file.mimetype.startsWith(type)
//   );

//   if (!isAllowed) {
//     return cb(new Error("File type not allowed"), false);
//   }

//   cb(null, true);
// };

// export const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 100 * 1024 * 1024, // 100MB
//   },
// });
