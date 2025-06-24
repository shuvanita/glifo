import { useState } from "react";

export default function UploadBox() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [status, setStatus] = useState("");
  const [fontUrl, setFontUrl] = useState("");

  const onFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setFileName(f ? f.name : "No file chosen");
    setFontUrl("");
    console.log("🔁 File changed:", f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("✅ handleSubmit is working, file:", file);

    if (!file) {
      console.log("⚠️ No file selected.");
      setStatus("❗ Please choose a file before uploading.");
      return;
    }

    setStatus("📤 Uploading...");
    console.log("📤 Preparing formData…");

    const formData = new FormData();
    formData.append("handwriting", file);
    console.log("📤 Sending POST to /api/upload…");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      console.log("📬 Fetch returned:", res.status, res.statusText);

      let json = {};
      try {
        json = await res.json();
        console.log("📦 Response JSON:", json);
      } catch (parseErr) {
        console.error("❗ JSON parse error:", parseErr);
      }

      if (res.ok && json?.fontUrl) {
        setStatus("✅ Upload & font generation successful!");
        setFontUrl(json.fontUrl);
      } else if (res.ok) {
        setStatus("✅ Upload successful! (no fontUrl yet)");
        console.log("ℹ️ Missing fontUrl, server response:", json);
      } else {
        setStatus("❌ Upload failed: " + (json?.error || res.statusText));
      }
    } catch (err) {
      console.error("❌ Network error:", err);
      setStatus("❌ Network error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">Upload Handwriting Template</h2>
      <div className="flex items-center space-x-4">
        <input
          type="file"
          id="file-upload"
          name="handwriting"
          accept="image/*,application/pdf"
          onChange={onFileChange}
          className="hidden"
        />
        <label
          htmlFor="file-upload"
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700"
        >
          Choose file
        </label>
        <span className="text-gray-700">{fileName}</span>
      </div>
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Upload
      </button>
      {status && <p className="mt-2 text-center">{status}</p>}
      {fontUrl && (
        <a
          href={fontUrl}
          className="text-blue-600 underline block text-center mt-2"
          download
        >
          🧷 Download your font
        </a>
      )}
    </form>
  );
}
