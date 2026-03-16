const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", "public");
// Auto-detect all *_long.jpg files so new images are included automatically
const longImages = fs.existsSync(publicDir)
  ? fs.readdirSync(publicDir).filter((f) => f.endsWith("_long.jpg"))
  : [];

(async () => {
  for (const file of longImages) {
    const inputPath = path.join(publicDir, file);
    if (!fs.existsSync(inputPath)) {
      console.log(`Skipping ${file} (not found)`);
      continue;
    }
    const tempPath = path.join(publicDir, file + ".tmp");
    try {
      await sharp(inputPath)
        .jpeg({ quality: 100, progressive: true })
        .toFile(tempPath);
      fs.renameSync(tempPath, inputPath);
      console.log(`Converted ${file} to progressive JPEG`);
    } catch (err) {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      console.error(`Failed ${file}:`, err.message);
    }
  }
  console.log("Done.");
})();
