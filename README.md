# Baby OS 👶

**The Operating System for your Newborn.**

Baby OS is a personalized, privacy-first dashboard that tracks your baby's sleep, feeds, and health, powered entirely by a shared [Craft](https://craft.do) document.

## Features
- **Privacy First**: You own your data. It lives in your private Craft document.
- **Real-time Dashboard**: Displays sleep windows, feed totals, and diaper changes.
- **Smart Alerts**: Highlights wake windows and daily goals based on your settings.
- **Single File**: The entire app is a single HTML file—no servers, no subscriptions.
- **Family Friendly**: A calm, pastel design that looks great on any device.

## How to Use
1. **Duplicate the Template**: Copy the [Baby OS Template](https://docs.mikail.zip/LZf9m2MeFth7Pr) to your Craft account.
2. **Download the Dashboard**: Get the latest `baby-os.html` from the [Releases](https://github.com/mikailkraft/baby-os/releases) or the `public` folder in this repo.
3. **Open**: Double-click `baby-os.html` in your browser.
4. **Connect**: Enter the API URL for your Craft document (found in the "Settings" block of the template).

## Apple Shortcuts
Streamline logging with these iOS Shortcuts:
- [Log Nap](#)
- [Log Feed](#)
- [Log Diaper](#)
- [Log Appointment](#)
- [Schedule Handoff](#)
- [Weekly Review](#)

## Development
This project is built with React, TypeScript, and Vite.

### Build
To build the single-file dashboard:
```bash
npm run build
```
The output will be in `dist/index.html`.

### Configuration
The app uses `vite-plugin-singlefile` to inline all assets.

## About
Created by [Mikail](https://github.com/mikailkraft).
