#!/usr/bin/env bash
set -euo pipefail

# Downloads prebuilt @ffmpeg/ffmpeg dist files (core-mt and core) into public/ffmpeg
# This script is conservative and will not overwrite existing files unless --force is provided.

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$ROOT_DIR/public/ffmpeg"
mkdir -p "$OUT_DIR"

FORCE=0
if [ "${1:-}" = "--force" ]; then
  FORCE=1
fi

download_if_missing() {
  local url="$1"
  local out="$2"
  if [ -f "$out" ] && [ "$FORCE" -ne 1 ]; then
    echo "[fetch-ffmpeg] Skipping existing: $out"
    return
  fi
  echo "[fetch-ffmpeg] Downloading $url -> $out"
  curl -fsSL "$url" -o "$out"
}

# Known release matching package.json dependency
VERSION="0.12.15"

# Attempt to copy files from node_modules if present for reliability
NM_BASE="$ROOT_DIR/node_modules/@ffmpeg/core-mt/dist/umd"
if [ -d "$NM_BASE" ]; then
  echo "[fetch-ffmpeg] Found core-mt in node_modules, copying to public/ffmpeg"
  cp -n "$NM_BASE/ffmpeg-core-mt.js" "$OUT_DIR/" 2>/dev/null || true
  cp -n "$NM_BASE/ffmpeg-core-mt.wasm" "$OUT_DIR/" 2>/dev/null || true
  cp -n "$NM_BASE/ffmpeg-core-mt.worker.js" "$OUT_DIR/" 2>/dev/null || true
fi

# Also try to download canonical UMD builds from unpkg CDN
BASE_MT="https://unpkg.com/@ffmpeg/core-mt@${VERSION}/dist/umd"
BASE="https://unpkg.com/@ffmpeg/core@${VERSION}/dist/umd"

download_if_missing "$BASE_MT/ffmpeg-core-mt.js" "$OUT_DIR/ffmpeg-core-mt.js"
download_if_missing "$BASE_MT/ffmpeg-core-mt.wasm" "$OUT_DIR/ffmpeg-core-mt.wasm"
download_if_missing "$BASE_MT/ffmpeg-core-mt.worker.js" "$OUT_DIR/ffmpeg-core-mt.worker.js"

download_if_missing "$BASE/ffmpeg-core.js" "$OUT_DIR/ffmpeg-core.js"
download_if_missing "$BASE/ffmpeg-core.wasm" "$OUT_DIR/ffmpeg-core.wasm"
download_if_missing "$BASE/ffmpeg-core.worker.js" "$OUT_DIR/ffmpeg-core.worker.js"

echo "[fetch-ffmpeg] Done. Files are in $OUT_DIR"
