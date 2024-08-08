document.addEventListener("DOMContentLoaded", init);

function init() {
  document.getElementById("clear-data").addEventListener("click", () => {
    chrome.storage.local.clear();
    chrome.runtime.reload();
  });
}
