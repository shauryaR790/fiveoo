import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import ffmpegPath from "ffmpeg-static";

const input = process.argv[2];
const output = process.argv[3];
const mode = process.argv[4] ?? "premium";

if (!input || !output) {
  console.error("Usage: node scripts/encode-video.mjs <input> <output> [copy|premium]");
  process.exit(1);
}

mkdirSync(dirname(output), { recursive: true });

const args =
  mode === "copy"
    ? ["-y", "-i", input, "-an", "-c:v", "copy", "-movflags", "+faststart", output]
    : [
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
        "15",
        "-preset",
        "slow",
        "-movflags",
        "+faststart",
        "-vf",
        "scale=3840:2160:flags=lanczos+accurate_rnd+full_chroma_int",
        output,
      ];

console.log(`Encoding (${mode}) ${input} -> ${output}`);
execSync(`"${ffmpegPath}" ${args.map((a) => `"${a}"`).join(" ")}`, {
  stdio: "inherit",
});
