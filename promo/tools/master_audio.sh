#!/usr/bin/env bash
# Two-pass loudness mastering of a rendered MP4 (video stream copied untouched).
# Usage: tools/master_audio.sh in.mp4 out.mp4 [target LUFS, default -14]
set -euo pipefail
in="$1"; out="$2"; target="${3:--14}"
stats=$(ffmpeg -hide_banner -i "$in" -af "loudnorm=I=${target}:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
get() { echo "$stats" | grep "\"$1\"" | sed -E 's/.*: "([^"]+)".*/\1/'; }
ffmpeg -hide_banner -v error -y -i "$in" -c:v copy \
  -af "loudnorm=I=${target}:TP=-1.5:LRA=11:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true" \
  -c:a aac -b:a 256k -ar 48000 "$out"
echo "mastered -> $out"
