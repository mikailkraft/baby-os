# How to Replicate: Baby OS

Baby OS is a high-performance parenting system built on Craft. It combines the Craft API, iOS Shortcuts, and the Model Context Protocol (MCP) to create a seamless, non-proprietary data dashboard for new parents.

Follow these steps to set up your own Baby OS.

---

## 1. The Brain: Duplicate the Template
First, you need the structured document where all your data will live.
- **Action:** Open this link and tap **Duplicate** in the top right: [Baby OS Craft Template](https://docs.mikail.zip/LZf9m2MeFth7Pr)
- This template contains the specific collections and pages that the Dashboard and Shortcuts expect.

---

## 2. The Dashboard: Launch the Interface
The Dashboard is a high-fidelity web app that reads directly from your Craft document.
- **Action:** Navigate to the [Baby OS Dashboard](https://baby-os.mikail.me) (or your hosted version).
- **Setup:** It will ask for your Craft document URL and API token.
- **Privacy Note:** Your data never leaves your device; the dashboard talks directly to the Craft API from your browser.

---

## 3. The Fast-Track: Install iOS Shortcuts
To log events in seconds (even at 3 AM), use these pre-built iOS Shortcuts. They write data directly to the collections in your Craft document.

- [🌙 Record Nap](https://www.icloud.com/shortcuts/8230347433554469ac2fc78db3b94153)
- [🍼 Log Feed](https://www.icloud.com/shortcuts/bae1c8289b974f7ba334380ac1919580)
- [🧷 Log Diaper](https://www.icloud.com/shortcuts/7255023a6fdf4e73b0d7dcd37f5339e8)
- [🩺 Doctor Visit](https://www.icloud.com/shortcuts/7760098de7254dc78cb424d48d198fd7)
- [🤝 Handoff](https://www.icloud.com/shortcuts/36dab8a54cd44bbca9bff76ccb2a39d9)
- [📅 Daily Summary](https://www.icloud.com/shortcuts/94267b322dc3467dbc9e699ccd14f7ad)

---

## 4. The Intelligence: Connect to MCP
Unlock AI-powered insights by connecting your Craft document to Claude using the Model Context Protocol (MCP).
- **Action:** Install the [Craft MCP Server](https://github.com/craft-do/mcp-server).
- **Setup:** Add the connection in Claude (via the "Imagine" tab or config file).
- **Power Move:** Ask Claude: *"Based on my sleep logs in Craft, what is the optimal wake window for my baby today?"*

---

## Technical Architecture
- **Storage:** Craft collections (No external database).
- **Ingestion:** iOS Shortcuts + Craft Connect API.
- **Visualization:** React-based Dashboard using Craft API.
- **Intelligence:** Model Context Protocol + Claude.

*Built for the Craft Winter Challenge.*
