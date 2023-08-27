document.addEventListener("DOMContentLoaded", () => {
  const copyUrlBtn = document.getElementById("copyUrlBtn");

  copyUrlBtn.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = tab.url;

    navigator.clipboard.writeText(url).then(
      () => {
        console.log("URL copied to clipboard");
      },
      (err) => {
        console.error("Failed to copy URL: ", err);
      }
    );
  });
});
