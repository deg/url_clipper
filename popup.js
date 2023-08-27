// Main function to initialize the extension
const initializeExtension = () => {
  const copyUrlBtn = document.getElementById("copyUrlBtn");
  copyUrlBtn.addEventListener("click", copyFilteredUrlToClipboard);
};

// Copy filtered URL to clipboard
const copyFilteredUrlToClipboard = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let url = tab.url;

  url = removeTrackingParams(url);
  url = transformChromeExtensionURL(url);

  navigator.clipboard.writeText(url).then(
    () => console.log("Filtered URL copied to clipboard"),
    (err) => console.error("Failed to copy URL: ", err)
  );
};

// Initialize the extension when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeExtension);

// Helper Functions

// Remove tracking parameters from the URL
const removeTrackingParams = (url) => {
  const parsedUrl = new URL(url);
  const params = parsedUrl.searchParams;
  const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

  trackingParams.forEach((param) => params.delete(param));

  return parsedUrl.toString();
};

// Transform Chrome extension URLs
const transformChromeExtensionURL = (url) => {
  const chromeExtensionPattern = /^chrome-extension:\/\/[^/]+\//;
  return chromeExtensionPattern.test(url) ? url.replace(chromeExtensionPattern, '') : url;
};
