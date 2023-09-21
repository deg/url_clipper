const initializeExtension = async () => {
  const copyUrlBtn = document.getElementById("copyUrlBtn");
  const cleanedUrlDiv = document.getElementById("cleanedUrl");
  copyUrlBtn.addEventListener("click", () => copyFilteredUrlToClipboard(cleanedUrlDiv));
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab.url;

  let cleanedUrl = removeChromeExtensionWrapper(url);
  cleanedUrl = removeTrackingParams(url);
  cleanedUrlDiv.innerText = cleanedUrl;

  copyUrlBtn.addEventListener("click", () => copyFilteredUrlToClipboard(cleanedUrl));
};

const copyFilteredUrlToClipboard = (cleanedUrl) => {
  navigator.clipboard.writeText(cleanedUrl).then(
    () => window.close(),
    (err) => console.error("Failed to copy URL: ", err)
  );
};


// Remove any Adobe's PDF viewer wrapper
const removeChromeExtensionWrapper = (url) => {
  if (url.startsWith("chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/")) {
    return url.replace("chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/", "");
  }
  return url;
};


// Remove tracking parameters from the URL
const TRACKING_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const GOOGLE_DOCS_PARAMS = ['pli'];
const NOISE_PARAMS = [...TRACKING_PARAMS, ...GOOGLE_DOCS_PARAMS];
const removeTrackingParams = (url) => {
  const parsedUrl = new URL(url);
  const params = parsedUrl.searchParams;
  NOISE_PARAMS.forEach((param) => params.delete(param));
  return parsedUrl.toString();
};


// Initialize the extension when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initializeExtension);
