# Jobpilot Resume Assistant - Chrome Extension

A Chrome extension that extracts job descriptions from LinkedIn and Naukri job listings and helps match your resume with job requirements.

## Features

- 🔍 **Automatic Job Description Extraction**: Automatically extracts job descriptions when you visit LinkedIn or Naukri job pages
- 💾 **Local Storage**: Saves job descriptions in Chrome's local storage for later use
- 🎯 **Resume Matching**: Sends job descriptions to a backend API to get resume match scores
- 📊 **Visual Score Display**: Shows match scores with color-coded results
- 📄 **Resume Download**: Provides direct download links to updated resumes

## Installation

1. **Download the Extension Files**
   - Ensure you have all the required files in a folder:
     - `manifest.json`
     - `content.js`
     - `popup.html`
     - `popup.js`
     - `icon.png`

2. **Load the Extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top right)
   - Click "Load unpacked"
   - Select the folder containing the extension files
   - The extension should now appear in your extensions list

3. **Pin the Extension** (Optional)
   - Click the puzzle piece icon in Chrome's toolbar
   - Find "Jobpilot Resume Assistant" and click the pin icon

## Usage

1. **Extract Job Descriptions**
   - Visit any LinkedIn job listing page (e.g., `https://linkedin.com/jobs/view/12345`)
   - Visit any Naukri job listing page (e.g., `https://naukri.com/job-listings/xyz`)
   - The extension will automatically extract the job description and save it

2. **Get Resume Match**
   - Click the Jobpilot Resume Assistant extension icon
   - The popup will show the extracted job description
   - Click "Get Resume Match" to analyze your resume
   - View your match score and download the updated resume

## API Configuration

The extension is configured to send requests to: `https://your-backend.com/api/match`

**Expected API Request:**
```json
{
  "jd": "job description text here..."
}
```

**Expected API Response:**
```json
{
  "score": 85,
  "resume_url": "https://example.com/resume.pdf"
}
```

To use with your own backend:
1. Update the API URL in `popup.js` (line 63)
2. Ensure your backend accepts POST requests with the expected JSON format
3. Ensure your backend returns responses in the expected format

## File Structure

```
jobpilot-resume-assistant/
├── manifest.json          # Extension manifest (v3)
├── content.js             # Content script for job description extraction
├── popup.html            # Extension popup UI
├── popup.js              # Popup logic and API communication
├── icon.png              # Extension icon
└── README.md             # This file
```

## Permissions

The extension requires the following permissions:
- `scripting`: To inject content scripts
- `activeTab`: To access the current tab's content
- `storage`: To save job descriptions locally
- Host permissions for `*.linkedin.com` and `*.naukri.com`

## Supported Websites

- **LinkedIn**: Job listing pages (`https://*.linkedin.com/jobs/view/*`)
- **Naukri**: Job listing pages (`https://*.naukri.com/job-listings/*`)

## Development

To modify the extension:

1. Make changes to the relevant files
2. Go to `chrome://extensions/`
3. Click the refresh icon for "Jobpilot Resume Assistant"
4. Test your changes

## Troubleshooting

**Job description not extracted:**
- Ensure you're on a supported job listing page
- Check the browser console for any errors
- The page structure might have changed; update the selectors in `content.js`

**API errors:**
- Check that your backend is running and accessible
- Verify the API URL in `popup.js`
- Check the browser's network tab for request details

**Extension not loading:**
- Ensure all files are present in the extension folder
- Check for syntax errors in the manifest.json
- Verify permissions are correctly set

## Browser Support

- Chrome (Manifest V3)
- Chromium-based browsers (Edge, Brave, etc.)

## License

This project is open source. Feel free to modify and distribute as needed.