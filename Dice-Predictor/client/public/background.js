// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('[AutoBet ML] Extension installed.');
});

// Manage connections or long-running state here
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'LOG_EVENT') {
    console.log('[AutoBet ML Event]', message.payload);
  }
});
