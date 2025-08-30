# Charltons Law News Client

A Python client for scraping news and newsletter data from the Charltons Law website using BeautifulSoup.

## Features

- Fetch Hong Kong legal and regulatory newsletters from Charltons Law
- Filter news by specific dates
- Extract full content from newsletter URLs
- Robust error handling and logging
- Follows the same pattern as other news clients (SFC, HKMA, etc.)

## Installation

Install required dependencies:

```bash
pip install -r requirements.txt
```

Or install system packages:

```bash
sudo apt install python3-requests python3-bs4
```

## Usage

### Basic Usage

```python
from client.charltonslaw_news_client import CharltonsLawNewsClient

# Create client instance
client = CharltonsLawNewsClient()

# Fetch all news
news_items = client.fetch_news()

# Fetch news for specific date
news_items = client.fetch_news(date="2025-08-19")

# Fetch full content from a URL
content = client.fetch_content("https://www.charltonslaw.com/news/newsletters/hong-kong-law-3/")
```

### Response Format

The `fetch_news()` method returns a list of dictionaries with the following structure:

```python
{
    "title": "Newsletter title",
    "issueDate": "2025-08-19",  # YYYY-MM-DD format
    "url": "https://www.charltonslaw.com/...",
    "content_preview": "Preview text..."
}
```

## Testing

Run the test script to verify functionality:

```bash
python3 test_charltonslaw_client.py
```

## Implementation Details

- Uses BeautifulSoup for HTML parsing
- Implements regex patterns to extract newsletter titles and dates
- Handles both live website parsing and fallback data
- Includes comprehensive error handling and logging
- Compatible with the existing news client architecture

## Source Website

The client scrapes data from: https://www.charltonslaw.com/news/newsletters/hong-kong-law-3/

This page contains Hong Kong legal and regulatory newsletters with information about:
- SFC (Securities and Futures Commission) updates
- HKMA (Hong Kong Monetary Authority) guidelines
- HKEX (Hong Kong Exchange) listing rules
- Virtual asset regulations
- Stablecoin regulations
- And other Hong Kong financial regulatory updates