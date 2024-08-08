let startTime = null;
let totalTimeSpent = 0;
let currentUrl = "";
let currentTitle = "";

function startTimer(url, title) {
  startTime = Date.now();
  currentUrl = url;
  currentTitle = title;
}

function stopTimer() {
  if (startTime) {
    totalTimeSpent += Date.now() - startTime;
    startTime = null;
    // Enregistrer le temps passé sur l'URL actuelle
    if (totalTimeSpent > 1000) {
      storeTimeSpent(currentUrl, totalTimeSpent);
    }
    totalTimeSpent = 0; // Réinitialiser pour la prochaine utilisation
  }
}

function storeTimeSpent(pageUrl, timeSpent) {
  chrome.storage.local.get("timeSpentData", (result) => {
    const timeSpentData = result.timeSpentData || [];
    timeSpentData.push({
      pageUrl: pageUrl,
      timeSpent: timeSpent,
      title: currentTitle,
      startTime: Date.now() - timeSpent,
      endTime: Date.now(),
    });
    chrome.storage.local.set({ timeSpentData });
  });
}

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Le navigateur a perdu le focus
    isBrowserFocused = false;
    stopTimer();
  } else {
    // Le navigateur a reçu le focus
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        isBrowserFocused = true;
        startTimer(tabs[0].url, tabs[0].title);
      }
    });
  }
});

// Écouter les changements d'onglet
chrome.tabs.onActivated.addListener((activeInfo) => {
  stopTimer(); // Arrêter le timer sur l'ancien onglet
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    startTimer(tab.url, tab.title); // Démarrer le timer sur le nouvel onglet
  });
});

// Écouter les mises à jour d'onglet (pour les changements d'URL dans le même onglet)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    stopTimer(); // Arrêter le timer car l'URL a changé
    startTimer(changeInfo.url, changeInfo.title); // Démarrer le timer avec la nouvelle URL
  }
});
