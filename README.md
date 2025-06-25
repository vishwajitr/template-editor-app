# Template Editor App

A standalone React application for editing template JSON configurations through an intuitive web interface.

## Features

- **JSON Input**: Paste template JSON content directly into a textarea
- **Visual Editor**: Edit templates in a user-friendly table interface
- **Dual Template Support**: Handle both Keyword Block Templates and SERP Block Templates
- **Domain-based Navigation**: Organize templates by domains with sidebar navigation
- **Live Changes Detection**: See when modifications have been made
- **Output View**: Preview modified JSON with syntax highlighting
- **Copy to Clipboard**: Easy export of edited JSON content
- **Add/Edit/Delete**: Full CRUD operations for templates

## Getting Started

### Installation

1. Make sure Node.js (v14 or higher) is installed.
2. Install dependencies:
   ```
   npm install
   ```

### Development

To run the app in development mode:

```
npm start
```

This will start the React development server on http://localhost:3000

### Production Build

To create a production build:

```
npm run build
```

## Using the Template Editor

### Step 1: Input JSON
1. Start the application
2. Paste your template JSON content into the textarea
3. Click "Load JSON for Editing" to parse and validate the JSON

### Step 2: Edit Templates
1. Use the tabbed interface to switch between "Template Editor" and "Output JSON"
2. In the Template Editor:
   - Select between "Keyword Templates" or "SERP Templates"
   - Choose a domain from the sidebar
   - Edit template values directly in the table
   - Click "Add Template" to create new templates
   - Click "Delete" to remove templates

### Step 3: View Changes
1. Switch to the "Output JSON" tab to see your modifications
2. The tab title will show "(Modified)" when changes are detected
3. Copy the final JSON to clipboard for use in your application

## Data Structure

The application expects JSON with two main sections:

### KEYWORD_BLOCK_TEMPLATES

Contains ad templates organized by domain:
```json
{
  "KEYWORD_BLOCK_TEMPLATES": {
    "example.com": [
      {
        "TEMPLATE_NAME": "Mobile Banner",
        "TEMPLATE_KEY": "mobile_banner_300x250",
        "WIDTH": 300,
        "HEIGHT": 250,
        "DEVICE": "Mobile"
      }
    ]
  }
}
```

Each template contains:
- **TEMPLATE_NAME** - Human-readable name
- **TEMPLATE_KEY** - Unique identifier
- **WIDTH** - Ad width in pixels
- **HEIGHT** - Ad height in pixels  
- **DEVICE** - Target device (Mobile, Desktop, or Tablet)

### SERP_BLOCK_TEMPLATES

Contains search result page templates organized by domain:
```json
{
  "SERP_BLOCK_TEMPLATES": {
    "example.com": [
      {
        "TEMPLATE_NAME": "Search Result Template",
        "TEMPLATE_KEY": "serp_mobile_template",
        "DEVICE": "Mobile",
        "KEYWORD": ".keyword-selector",
        "TITLE": ".title-selector",
        "DESCRIPTION": ".description-selector", 
        "URL": ".url-selector",
        "ADLINK": ".adlink-selector"
      }
    ]
  }
}
```

Each template contains:
- **TEMPLATE_NAME** - Human-readable name
- **TEMPLATE_KEY** - Unique identifier
- **DEVICE** - Target device (Mobile, Desktop, or Tablet)
- **KEYWORD** - CSS selector for keyword element
- **TITLE** - CSS selector for title element
- **DESCRIPTION** - CSS selector for description element
- **URL** - CSS selector for URL element
- **ADLINK** - CSS selector for ad link element

## Features in Detail

### JSON Validation
- Automatic validation when loading JSON
- Clear error messages for invalid JSON
- Required section validation

### Change Detection
- Visual indicators when changes are made
- Modified tab titles and badges
- Compare original vs modified JSON

### Responsive Design
- Mobile-friendly interface
- Responsive tables and forms
- Touch-friendly controls

### User Experience
- Monospace font for JSON areas
- Syntax highlighting in output
- Intuitive navigation
- Confirmation dialogs for destructive actions 