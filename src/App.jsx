import { useState, useEffect } from 'react';
import styled, {createGlobalStyle} from 'styled-components';

function App() {
  const [cleanedUrl, setCleanedUrl] = useState(null);

  useEffect(() => {
    (async () => {
      const url = await initializeExtension();
      setCleanedUrl(url);
    })();
  }, []);

  return (
    <>
      <GlobalStyle/>
      <Container>
        <UrlContainer id="cleanedUrl">
          {cleanedUrl}
        </UrlContainer>
        <CenteredDiv>
          <CopyButton id="copyUrlBtn" onClick={() => copyUrlThenClosePopup(cleanedUrl)}>
            <img id="icon" src="copy_url_icon_128.png" alt="Copy URL"/>
            Copy URL to Clipboard
          </CopyButton>
        </CenteredDiv>
      </Container>
    </>
  );
}

const initializeExtension = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return cleanUrl(tab.url);
};


const cleanUrl = (url) => {
    // Remove any Adobe's PDF viewer wrapper
  const removeChromeExtensionWrapper = (url) => {
    const adobePrefix = "chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/";
    if (url.startsWith(adobePrefix)) {
      return url.replace(adobePrefix, "");
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

  let cleaned = url;
  cleaned = removeChromeExtensionWrapper(cleaned);
  cleaned = removeTrackingParams(url);
  return cleaned;
}


const copyUrlThenClosePopup = (url) => {
  navigator.clipboard.writeText(url).then(
    () => window.close(),
    (err) => console.error("Failed to copy URL: ", err)
  );
};


const GlobalStyle = createGlobalStyle`
  :root {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }

  body {
    margin: 0;
    display: flex;
    place-items: center;
  }
`;

const Container = styled.div`
  padding: 2rem;
  text-align: center;
  max-width: 60ch;
  margin: 0 auto;
`;
const UrlContainer = styled.div`
  margin: 10px auto;
  text-align: center;
  word-wrap: break-word;
`;

const CenteredDiv = styled.div`
  text-align: center;
`;

const CopyButton = styled.button`
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #f0f0f0;
  cursor: pointer;
  transition: border-color 0.25s;

  &:hover {
    border-color: #646cff;
  background-color: #f9f9f9;
  }

  &:focus,
  &:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
`;


export default App;
