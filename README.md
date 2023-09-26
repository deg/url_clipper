# Copy URL to Clipboard Chrome Extension

## Description

This extension allows users to copy the current tab's URL to the clipboard after
removing tracking parameters and other noise, providing a cleaner and more concise URL.


## How to Use

1. Click on the extension icon in the Chrome toolbar.
2. The cleaned URL of the current tab will be displayed in the popup.
3. Click on the "Copy URL to Clipboard" button to copy the cleaned URL.
4. The URL is now copied to your clipboard and can be pasted wherever needed.


## Features
- Removes tracking parameters commonly used for marketing purposes, such as `utm_source`, `utm_medium`, etc.
- Cleans URLs that are wrapped by Adobe's PDF viewer.
- Provides a simple and user-friendly interface to copy the cleaned URL with a single click.


## Development Details

The core logic of the extension is written using React and styled-components. It uses
the Chrome Extension API to fetch the current tab's URL, processes it to remove unwanted
parameters, and then displays the cleaned URL to the user.


### Dev build

- `yarn build-extension`

### Dev installaton

- Go to chrome://extensions
- Enable Developer Mode (top-right corner)
- Load Unpacked (top-left corner) this directory
- Click the extensions chrome extension (jigsaw icon) and pin this extension


## Contact

David Goldfarb / deg@degel.com