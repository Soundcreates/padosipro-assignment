#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if [[ -z "${JAVA_HOME:-}" ]]; then
  if [[ -x /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home/bin/java ]]; then
    export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"
  elif [[ -x "/Applications/Android Studio.app/Contents/jbr/Contents/Home/bin/java" ]]; then
    export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
  fi
fi

export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"

if [[ -z "${ANDROID_NDK_HOME:-}" ]]; then
  NDK_DIR="$(ls -1d "$ANDROID_HOME"/ndk/* 2>/dev/null | sort -V | tail -1 || true)"
  if [[ -n "${NDK_DIR:-}" ]]; then
    export ANDROID_NDK_HOME="$NDK_DIR"
  fi
fi

export PATH="${JAVA_HOME:+$JAVA_HOME/bin:}$ANDROID_HOME/platform-tools:$PATH"

if [[ -z "${JAVA_HOME:-}" || ! -x "$JAVA_HOME/bin/java" ]]; then
  echo "Java not found. Install with: brew install openjdk@17"
  exit 1
fi

if [[ ! -d "$ANDROID_HOME" ]]; then
  echo "Android SDK not found at ANDROID_HOME=$ANDROID_HOME"
  exit 1
fi

echo "Using JAVA_HOME=$JAVA_HOME"
"$JAVA_HOME/bin/java" -version
echo "Using ANDROID_HOME=$ANDROID_HOME"
[[ -n "${ANDROID_NDK_HOME:-}" ]] && echo "Using ANDROID_NDK_HOME=$ANDROID_NDK_HOME"

npx eas-cli build -p android --profile preview --local "$@"
