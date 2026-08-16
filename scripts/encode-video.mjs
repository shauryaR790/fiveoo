import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import ffmpegPath from "ffmpeg-static";

const input = process.argv[2];
const output = process.argv[3];

if (!input || !output) {
  console.error("Usage: node scripts/encode-video.mjs <input> <output>");
  process.exit(1);
}

mkdirSync(dirname(output), { recursive: true });

const args = [
  "-y",
  "-i",
  input,
  "-an",
  "-c:v",
  "libx264",
  "-profile:v",
  "high",
  "-pix_fmt",
  "yuv420p",
  "-crf",
  "16",
  "-preset",
  "slow",
  "-movflags",
  "+faststart",
  "-vf",
  "scale=2560:1440:flags=lanczos+accurate_rnd+full_chroma_int,unsharp=5:5:0.35:5:5:0.0",
  output,
];

console.log(`Encoding ${input} -> ${output}`);
execSync(`"${ffmpegPath}" ${args.map((a) => `"${a}"`).join(" ")}`, {
  stdio: "inherit",
});
