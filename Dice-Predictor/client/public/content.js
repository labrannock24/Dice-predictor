// This script runs on the web page (e.g., the game site)
// It listens for game events and sends them to the popup/background script

console.log('[AutoBet ML] Content script loaded and ready.');

// Simulate finding game elements
const findGameElements = () => {
  // Generic selectors for demonstration
  const resultElement = document.querySelector('.recent-result') || document.querySelector('.game-history');
  const balanceElement = document.querySelector('.user-balance');
  
  if (resultElement) {
    console.log('[AutoBet ML] Game history detected:', resultElement.innerText);
  }
};

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "PING") {
    sendResponse({ status: "CONNECTED", url: window.location.href });
  } else if (request.action === "GET_PAGE_DATA") {
    // In a real scenario, this would scrape the specific DOM elements
    sendResponse({
      title: document.title,
      hasGameDetected: !!document.querySelector('canvas') || !!document.querySelector('.game-container')
    });
  }
});

// Run a periodic check (simulation of observing the game loop)
setInterval(findGameElements, 5000);
