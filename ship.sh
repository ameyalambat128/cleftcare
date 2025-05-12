#!/bin/bash

set -e  # Exit on error

# === CONFIGURATION ===
FOLDER_ID="1KqdZ9IRDmuxt2DJFcFEbRpw3SwgqKwYN"

# === STEP 1: Prebuild ===
echo "🛠️ Running prebuild..."
bun prebuild --clean --platform android

# === STEP 2: Build APK ===
echo "🏗️ Building Android APK..."
cd android
./gradlew assembleRelease
cd ..

# === STEP 3: Get version from app.json ===
echo "🔍 Getting version from app.json..."
VERSION=$(jq -r '.expo.version' app.json)

# === STEP 4: Rename APK in-place ===
APK_DIR="android/app/build/outputs/apk/release"
APK_PATH="${APK_DIR}/app-release.apk"
RENAMED_APK="cleftCare-${VERSION}.apk"
RENAMED_PATH="${APK_DIR}/${RENAMED_APK}"

cp "$APK_PATH" "$RENAMED_PATH"
echo "📦 APK copied and renamed to $RENAMED_PATH"

# === STEP 5: Upload to Google Drive ===
echo "☁️ Uploading to Google Drive..."
LOG_FILE=$(mktemp)

gdrive files upload --parent "$FOLDER_ID" --print-only-id "$RENAMED_PATH" 2>&1 | tee "$LOG_FILE"
UPLOAD_OUTPUT=$(cat "$LOG_FILE")

if [[ "$UPLOAD_OUTPUT" == *"Gdrive requires permissions"* ]]; then
    echo "🔐 Authentication required!"
    echo "$UPLOAD_OUTPUT"
    rm "$LOG_FILE"
    exit 1
elif [[ "$UPLOAD_OUTPUT" == *"Error"* ]]; then
    echo "❌ Error uploading to Google Drive:"
    echo "$UPLOAD_OUTPUT"
    rm "$LOG_FILE"
    exit 1
else
    FILE_ID=$(echo "$UPLOAD_OUTPUT" | tail -n1 | xargs)
    echo "✅ Uploaded successfully with File ID: $FILE_ID"
fi

rm "$LOG_FILE"

# # === STEP 6: Make file shareable ===
echo "🔗 Retrieving shareable link..."
DOWNLOAD_LINK=$(gdrive files info "$FILE_ID" | grep 'ViewUrl' | awk '{print $2}')
echo "🔗 Shareable Link: $DOWNLOAD_LINK"

# === STEP 7: Copy to Clipboard with formatting and version ===
echo "Latest Version ($VERSION) - $DOWNLOAD_LINK" | pbcopy
echo "📋 Formatted link with version copied to clipboard!"