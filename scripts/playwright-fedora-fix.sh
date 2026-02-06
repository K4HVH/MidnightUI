#!/usr/bin/env bash
#
# Playwright Fedora Compatibility Fix
#
# Playwright's bundled WebKit is built on Ubuntu and requires libraries
# that either don't exist or have different versions on Fedora:
#   - ICU 74 (Fedora ships 76/77, and ICU uses versioned symbols)
#   - libjpeg.so.8 (Fedora ships libjpeg.so.62 with different ABI)
#   - libjxl.so.0.8 (Fedora ships 0.11, symlink-compatible)
#
# This script:
#   1. Downloads the required Ubuntu libraries
#   2. Places them in a compat directory
#   3. Patches WebKit's MiniBrowser wrapper scripts to load them
#
# Safe to re-run after Playwright browser updates.
#
set -euo pipefail

COMPAT_DIR="$HOME/.cache/ms-playwright/fedora-compat"
PW_CACHE="$HOME/.cache/ms-playwright"
UBUNTU_MIRROR="http://archive.ubuntu.com/ubuntu/pool/main"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC} $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*" >&2; }

# --- Pre-checks ---

if [[ ! -d "$PW_CACHE" ]]; then
    error "Playwright browser cache not found at $PW_CACHE"
    echo "  Run 'bunx playwright install' first, then re-run this script."
    exit 1
fi

if ! command -v wget &>/dev/null; then
    error "'wget' is required but not installed. Install with: sudo dnf install wget"
    exit 1
fi

if ! command -v ar &>/dev/null; then
    error "'ar' is required but not installed. Install with: sudo dnf install binutils"
    exit 1
fi

if ! command -v zstd &>/dev/null; then
    error "'zstd' is required but not installed. Install with: sudo dnf install zstd"
    exit 1
fi

# --- Step 1: Create compat directory ---

info "Creating compat directory at $COMPAT_DIR"
mkdir -p "$COMPAT_DIR"

TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

# --- Step 2: Download and extract ICU 74 ---

if [[ -f "$COMPAT_DIR/libicudata.so.74.2" ]]; then
    info "ICU 74 libraries already present, skipping download"
else
    info "Downloading ICU 74 from Ubuntu..."

    # Find the latest libicu74 package URL
    ICU_URL=$(wget -q "$UBUNTU_MIRROR/i/icu/" -O - \
        | grep -oP 'href="libicu74_[^"]*amd64\.deb"' \
        | tail -1 \
        | grep -oP '"[^"]*"' \
        | tr -d '"')

    if [[ -z "$ICU_URL" ]]; then
        error "Could not find libicu74 package on Ubuntu mirror"
        exit 1
    fi

    wget -q --show-progress "$UBUNTU_MIRROR/i/icu/$ICU_URL" -O "$TMPDIR/libicu74.deb"

    info "Extracting ICU 74 libraries..."
    cd "$TMPDIR"
    ar x libicu74.deb data.tar.zst
    zstd -dq data.tar.zst -o data.tar -f
    tar xf data.tar --wildcards '*/libicudata.so*' '*/libicui18n.so*' '*/libicuuc.so*'

    cp usr/lib/x86_64-linux-gnu/libicudata.so.74.2 "$COMPAT_DIR/"
    cp usr/lib/x86_64-linux-gnu/libicui18n.so.74.2 "$COMPAT_DIR/"
    cp usr/lib/x86_64-linux-gnu/libicuuc.so.74.2 "$COMPAT_DIR/"
    ln -sf libicudata.so.74.2 "$COMPAT_DIR/libicudata.so.74"
    ln -sf libicui18n.so.74.2 "$COMPAT_DIR/libicui18n.so.74"
    ln -sf libicuuc.so.74.2 "$COMPAT_DIR/libicuuc.so.74"

    info "ICU 74 installed"
fi

# --- Step 3: Download and extract libjpeg-turbo8 ---

if [[ -f "$COMPAT_DIR/libjpeg.so.8.2.2" ]]; then
    info "libjpeg.so.8 already present, skipping download"
else
    info "Downloading libjpeg-turbo8 from Ubuntu..."

    JPEG_URL=$(wget -q "$UBUNTU_MIRROR/libj/libjpeg-turbo/" -O - \
        | grep -oP 'href="libjpeg-turbo8_[^"]*amd64\.deb"' \
        | tail -1 \
        | grep -oP '"[^"]*"' \
        | tr -d '"')

    if [[ -z "$JPEG_URL" ]]; then
        error "Could not find libjpeg-turbo8 package on Ubuntu mirror"
        exit 1
    fi

    wget -q --show-progress "$UBUNTU_MIRROR/libj/libjpeg-turbo/$JPEG_URL" -O "$TMPDIR/libjpeg-turbo8.deb"

    info "Extracting libjpeg.so.8..."
    cd "$TMPDIR"
    ar x libjpeg-turbo8.deb data.tar.zst
    zstd -dq data.tar.zst -o data.tar -f
    tar xf data.tar --wildcards '*/libjpeg.so*'

    cp usr/lib/x86_64-linux-gnu/libjpeg.so.8.2.2 "$COMPAT_DIR/"
    ln -sf libjpeg.so.8.2.2 "$COMPAT_DIR/libjpeg.so.8"

    info "libjpeg.so.8 installed"
fi

# --- Step 4: Create libjxl symlink ---

if [[ -f "$COMPAT_DIR/libjxl.so.0.8" ]]; then
    info "libjxl.so.0.8 symlink already present"
else
    SYSTEM_LIBJXL=$(find /lib64 /usr/lib64 -name "libjxl.so.0.*" -not -name "*.0" 2>/dev/null | head -1)
    if [[ -n "$SYSTEM_LIBJXL" ]]; then
        ln -sf "$SYSTEM_LIBJXL" "$COMPAT_DIR/libjxl.so.0.8"
        info "Symlinked libjxl.so.0.8 -> $SYSTEM_LIBJXL"
    else
        warn "libjxl not found on system - JPEG XL support may not work"
    fi
fi

# --- Step 5: Patch WebKit MiniBrowser wrappers ---

COMPAT_LD_ENTRY="\${HOME}/.cache/ms-playwright/fedora-compat"
PATCHED=0

for WEBKIT_DIR in "$PW_CACHE"/webkit-*/; do
    [[ -d "$WEBKIT_DIR" ]] || continue

    for VARIANT in minibrowser-gtk minibrowser-wpe; do
        WRAPPER="$WEBKIT_DIR$VARIANT/MiniBrowser"
        [[ -f "$WRAPPER" ]] || continue

        if grep -q "fedora-compat" "$WRAPPER"; then
            info "Already patched: $VARIANT ($(basename "$WEBKIT_DIR"))"
        else
            # Patch the LD_LIBRARY_PATH line to prepend our compat dir
            sed -i "s|export LD_LIBRARY_PATH=\"\${MYDIR}|export LD_LIBRARY_PATH=\"$COMPAT_LD_ENTRY:\${MYDIR}|" "$WRAPPER"

            if grep -q "fedora-compat" "$WRAPPER"; then
                info "Patched: $VARIANT ($(basename "$WEBKIT_DIR"))"
                PATCHED=$((PATCHED + 1))
            else
                warn "Failed to patch: $WRAPPER"
            fi
        fi
    done
done

# --- Summary ---

echo ""
info "Fedora Playwright compat fix applied!"
echo ""
echo "  Compat libs:  $COMPAT_DIR"
echo "  Wrappers patched: $PATCHED"
echo ""
echo "  Make sure playwright.config.ts includes:"
echo "    process.env.PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS ??= '1';"
echo ""
echo "  Re-run this script after 'bunx playwright install' upgrades browsers."
