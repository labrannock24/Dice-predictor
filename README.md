[README.md](https://github.com/user-attachments/files/24093659/README.md)
# AutoBet ML Visualizer

This project simulates a Machine Learning Betting Bot interface. It demonstrates how such a bot might visualize data, track patterns, and execute betting strategies.

**NOTE: This is a frontend simulation only. It does not interact with real gambling sites or use real money.**

## Features
- **Live Pattern Analysis**: Visualizes "detected" patterns in dice rolls.
- **ML Confidence Metrics**: Displays the "bot's" confidence in the next roll.
- **Dynamic Bet Sizing**: Simulates the Martingale or Kelly Criterion strategies.
- **Real-time Graphing**: Charts balance history and roll outcomes.

## How to Run (Web Mode)
1.  Ensure you have Node.js installed.
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`
4.  Open the local URL in your browser.

## How to Install as Chrome Extension
1.  Run `npm run build` to generate the production files.
2.  Open Chrome and go to `chrome://extensions/`.
3.  Enable **Developer mode** (toggle in the top right).
4.  Click **Load unpacked**.
5.  Select the `dist/public` folder in this project directory.
6.  The "AutoBet ML" icon will appear in your toolbar. Click it to open the dashboard.

## Instructions
1.  **Configure Strategy**: Use the "Control Panel" on the right to set your Base Bet and Risk Level.
2.  **Start Simulation**: Click "ACTIVATE BOT" to begin the simulation.
3.  **Monitor**: Watch the "Live Analysis" graph and "Console Log" as the bot "learns" and places bets.
4.  **Stop**: Click "DEACTIVATE" to pause the simulation.

## Technology Stack
- React
- Tailwind CSS (Cyberpunk Theme)
- Recharts (Data Visualization)
- Framer Motion (Animations)
