window.addEventListener("message", (event) => {
  if (event.source !== window || !event.data.type) {
    return;
  }
  if (event.data.type === "REQUEST_BROWSER_TIME") {
    const startTime = event.data.payload.startTime;
    const endTime = event.data.payload.endTime;
    chrome.storage.local.get("timeSpentData", (result) => {
      const browserActivity = result.timeSpentData.filter(
        (activity) =>
          activity.startTime >= startTime && activity.endTime <= endTime
      );
      window.postMessage({ type: "BROWSER_TIME", data: browserActivity }, "*");
    });
  }
});
