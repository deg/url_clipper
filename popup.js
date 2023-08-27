const initializeExtension = () => {
  const copyUrlBtn = document.getElementById("copyUrlBtn");
  copyUrlBtn.addEventListener("click", copyFilteredUrlToClipboard);
};

const copyFilteredUrlToClipboard = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let url = tab.url;

  url = removeChromeExtensionWrapper(url);
  url = removeTrackingParams(url);

  navigator.clipboard.writeText(url).then(
    () => console.log("Filtered URL copied to clipboard"),
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

