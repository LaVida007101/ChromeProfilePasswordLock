let isBlocked = true; 
let popupId = null;

// Minimize chrome except popup
function blockWindows() {
  if (!isBlocked) return;

  chrome.windows.getAll({}, (windows) => {
    windows.forEach((win) => {
      if (win.id !== popupId) {
        chrome.windows.update(win.id, { state: "minimized" });
      }
    });
  });

  setTimeout(blockWindows, 10); // Repeat blocking every 10ms
}

// Restore chrome windows
function restoreWindows() {
  chrome.windows.getAll({}, (windows) => {
    windows.forEach((win) => {
      if (win.id !== popupId) {
        chrome.windows.update(win.id, { state: "normal" }, () => {
          chrome.windows.update(win.id, { focused: true });
        });
      }
    });
  });
}

// Open popup prompt on startup
chrome.runtime.onStartup.addListener(() => {
  isBlocked = true; 
  blockWindows();

  // Create popup prompt
  chrome.windows.create(
    {
      url: chrome.runtime.getURL("popup.html"),
      type: "popup",
      focused: true,
      width: 400,
      height: 300,
    },
    (popupWindow) => {
      popupId = popupWindow.id;

      // Listen for unblock request from popup
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "unblock") {
          isBlocked = false; 
          restoreWindows(); 

          chrome.windows.remove(popupId, () => {
            sendResponse({ status: "unblocked" });
          });
        }
      });
    }
  );
});