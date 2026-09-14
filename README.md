# Buddy System Cards

## Publish with GitHub Pages

1. Create a GitHub repository and upload the contents of this folder.
2. In **Settings -> Pages**, choose **Deploy from a branch**, select `main` and
   `/ (root)`, then save.
3. Open the generated Pages URL.

The app still works offline using browser storage. To share one database
between devices, configure Google Drive sync below.

## Configure Google Drive storage

1. Open [script.google.com](https://script.google.com), create a project, and
   paste the contents of `apps-script/Code.gs`.
2. Replace `CHANGE_THIS_TO_A_LONG_RANDOM_TOKEN` with a long random value.
3. Deploy **Deploy -> New deployment -> Web app**, execute as **Me**, and allow
   access to **Anyone with the link**. Copy the `/exec` URL.
4. Put the deployment URL in `cloud-config.js`:

   ```js
   window.BSC_CLOUD_CONFIG = {
     url: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec'
   };
   ```

5. Commit and push `cloud-config.js` to GitHub Pages, then open **Settings** in
   the app and enter the token. The token is saved only in that browser's
   local storage; do not commit a real token to a public repository.

The first device with existing data uploads it. Later devices download that
database during startup. The app keeps a local cache and queues changes while
offline. The Apps Script account's Google Drive owns the database file.

> This is a small shared registry, not a high-concurrency database. Avoid
> editing the same record on multiple devices at exactly the same time.

## Build the Android app

The `app/` folder is a native Android Studio project that packages the same
Buddy System interface. It includes Android camera permission handling and
image-file selection for QR scanning.

### Build locally

1. Open this folder in Android Studio.
2. Let Android Studio install Android SDK 35 and Gradle dependencies.
3. Select the `app` configuration and run it on a device or emulator.
4. For an APK, use **Build -> Build Bundle(s) / APK(s) -> Build APK(s)**.

### Build on GitHub

The `Build Android app` workflow builds a debug APK on every push to `main`.
Download it from the workflow run's **Artifacts** section. For Play Store
distribution, create a signed release build in Android Studio and keep the
signing key outside the repository.
