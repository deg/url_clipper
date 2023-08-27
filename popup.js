const initializeExtension = () => {
  const copyUrlBtn = document.getElementById("copyUrlBtn");
  copyUrlBtn.addEventListener("click", copyFilteredUrlToClipboard);
};

const copyFilteredUrlToClipboard = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let url = tab.url;

  url = transformChromeExtensionURL(url);
  url = removeTrackingParams(url);

  navigator.clipboard.writeText(url).then(
    () => console.log("Filtered URL copied to clipboard"),
    (err) => console.error("Failed to copy URL: ", err)
  );
};


// Remove tracking parameters from the URL
const TRACKING_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const removeTrackingParams = (url) => {
  const parsedUrl = new URL(url);
  const params = parsedUrl.searchParams;
  TRACKING_PARAMS.forEach((param) => params.delete(param));
  return parsedUrl.toString();
};


// Remove any Chrome Extension wrapper (primariy for Adobe's PDF viewer)
const transformChromeExtensionURL = (url) => {
  const chromeExtensionPattern = /^chrome-extension:\/\/[^/]+\//;
  return chromeExtensionPattern.test(url) ? url.replace(chromeExtensionPattern, '') : url;
};


// Initialize the extension when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeExtension);

