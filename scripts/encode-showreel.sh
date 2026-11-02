#!/usr/bin/env bash
# Encodes showreel renders for /videos: short muted preview loop, full web version, poster.
# Usage: bash scripts/encode-showreel.sh
set -e
SRC="E:/Videos/Showreels/video-projects"
OUT="$(dirname "$0")/../public/videos"
mkdir -p "$OUT"

# id | source | preview start (s)
LIST="
risebeyond-3d|risebeyond-3d/renders/risebeyond-3d.mp4|2
evglab-scalez|evglab-scalez/renders/evglab-scalez.mp4|0
brewai-logo|brewai-logo-film-916/renders/brewai-logo-film-916-v2.mp4|0
evglab-pendel|evglab-pendel/renders/evglab-pendel.mp4|0
brewai-glass|brewai-glass-916/renders/brewai-glass-9x16.mp4|4
tidely|tidely-saas/renders/tidely-saas.mp4|10
veyra|veyra-saas/renders/veyra-saas.mp4|4
dn-impact|dn-impact-916/renders/dn-impact-916.mp4|3
radebeul|radebeul-versichern/renders/radebeul-versichern-v2.mp4|2
vm-zierer|vm-zierer/renders/vm-zierer.mp4|6
holzbau-ried|holzbau-ried/renders/holzbau-ried.mp4|4
gold-noir|gold-noir-demo/renders/gold-noir-demo.mp4|2
evglab-reel|evglab-reel-916/renders/evglab-reel-9x16.mp4|0
evglab-cut|evglab-cut/renders/evglab-cut.mp4|0
brewai-film|brewai-film-916/renders/brewai-film-9x16.mp4|0
evglab-flyover|evglab-flyover/renders/evglab-flyover-music.mp4|0
"

echo "$LIST" | while IFS='|' read -r id src start; do
  [ -z "$id" ] && continue
  in="$SRC/$src"
  # 720 px on the short side for the full file, 540 for the preview loop
  full_scale="scale='if(gt(iw,ih),-2,720)':'if(gt(iw,ih),720,-2)'"
  prev_scale="scale='if(gt(iw,ih),-2,540)':'if(gt(iw,ih),540,-2)'"
  ffmpeg -nostdin -v error -y -ss "$start" -t 6 -i "$in" -an -vf "$prev_scale,fps=30" \
    -c:v libx264 -crf 30 -preset slow -pix_fmt yuv420p -movflags +faststart "$OUT/$id-preview.mp4"
  ffmpeg -nostdin -v error -y -i "$in" -vf "$full_scale" \
    -c:v libx264 -crf 25 -preset slow -pix_fmt yuv420p -movflags +faststart \
    -c:a aac -b:a 128k "$OUT/$id.mp4"
  ffmpeg -nostdin -v error -y -ss "$((start + 2))" -i "$in" -frames:v 1 -vf "$prev_scale" \
    -c:v libwebp -quality 78 "$OUT/$id.webp"
  echo "$id done"
done
