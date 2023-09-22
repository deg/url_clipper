import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [cleanedUrl, setCleanedUrl] = useState(null);

  useEffect(() => {
    (async () => {
      const url = await initializeExtension();
      setCleanedUrl(url);
    })();
  }, []);

  return (
    <div style={{ maxWidth: "60ch", margin: "auto" }}>
      <div id="cleanedUrl"
           style={{ margin: "10px auto", textAlign: "center", wordWrap: "break-word" }}>
        {cleanedUrl}
      </div>
      <div style={{ textAlign: "center" }}>
        <button id="copyUrlBtn" onClick={()=>copyFilteredUrlToClipboard(cleanedUrl)}>
          <img id="icon" src="copy_url_icon_128.png" alt="Copy URL"/>
          Copy URL to Clipboard
        </button>
      </div>
    </div>
  );
}

const initializeExtension = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab.url;
  let cleanedUrl = removeChromeExtensionWrapper(url);
  cleanedUrl = removeTrackingParams(url);
  return cleanedUrl;
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


export default App;
