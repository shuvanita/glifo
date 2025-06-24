
import formidable from "formidable";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

// Disable Next's default body parser for file uploads
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  console.log("📬 Received API call:", req.method);
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  // Ensure uploads folder exists
  const uploadsDir = path.join(process.cwd(), "../../../uploads");
  fs.mkdirSync(uploadsDir, { recursive: true });

  // Parse form data
  const form = formidable({ uploadDir: uploadsDir, keepExtensions: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("❗ Upload parsing failed:", err);
      return res.status(500).json({ error: "Upload parsing failed" });
    }

    const fileObj = Array.isArray(files.handwriting)
      ? files.handwriting[0]
      : files.handwriting;
    if (!fileObj) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const inputPath = fileObj.filepath;
    const outputPath = inputPath.replace(path.extname(inputPath), ".ttf");

    // Use virtualenv Python
    const pythonExe = path.join(process.cwd(), ".venv/bin/python");
    const scriptPath = path.join(process.cwd(), "scripts/generate_font.py");
    const cmd = `"${pythonExe}" "${scriptPath}" "${inputPath}" "${outputPath}"`;
    console.log("🐍 Running font generation:", cmd);

    exec(cmd, (pyErr, stdout, stderr) => {
      if (pyErr) {
        console.error("❗ Python script error:", stderr);
        return res.status(500).json({ error: "Font generation failed" });
      }

      console.log(stdout);
      const fontUrl = `/api/download?file=${path.basename(outputPath)}`;
      return res.status(200).json({ message: "Font generated!", fontUrl });
    });
  });
}
