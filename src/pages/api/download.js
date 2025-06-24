import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { file } = req.query;
  const filePath = path.join(process.cwd(), "../../../uploads", file);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File not found" });

  res.setHeader("Content-Type", "font/ttf");
  res.setHeader("Content-Disposition", `attachment; filename=${file}`);
  fs.createReadStream(filePath).pipe(res);
}
