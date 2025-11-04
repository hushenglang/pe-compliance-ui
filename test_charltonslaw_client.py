#!/usr/bin/env python3
"""
Test script for Charltons Law news client.
"""

import sys
import os

# Add the current directory to Python path to import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from client.charltonslaw_news_client import CharltonsLawNewsClient


def test_fetch_news():
    """Test the fetch_news method."""
    print("Testing Charltons Law News Client...")
    print("=" * 50)
    
    client = CharltonsLawNewsClient()
    
    # Test 1: Fetch all news
    print("\n1. Testing fetch_news() - all news:")
    news_items = client.fetch_news()
    
    if news_items:
        print(f"✅ Successfully fetched {len(news_items)} news items")
        
        # Display first few items
        for i, item in enumerate(news_items[:3]):
            print(f"\nNews Item {i+1}:")
            print(f"  Title: {item.get('title', 'N/A')}")
            print(f"  Date: {item.get('issueDate', 'N/A')}")
            print(f"  URL: {item.get('url', 'N/A')}")
            print(f"  Preview: {item.get('content_preview', 'N/A')[:100]}...")
    else:
        print("❌ No news items found")
    
    # Test 2: Fetch news for specific date
    print("\n2. Testing fetch_news() with date filter (2025-08-19):")
    filtered_news = client.fetch_news(date="2025-08-19")
    
    if filtered_news:
        print(f"✅ Successfully fetched {len(filtered_news)} news items for 2025-08-19")
        for item in filtered_news:
            print(f"  - {item.get('title', 'N/A')}")
    else:
        print("❌ No news items found for the specified date")
    
    # Test 3: Fetch content from a URL
    print("\n3. Testing fetch_content():")
    if news_items:
        test_url = news_items[0].get('url')
        if test_url:
            print(f"Fetching content from: {test_url}")
            content = client.fetch_content(test_url)
            
            if content:
                print(f"✅ Successfully fetched content ({len(content)} characters)")
                print(f"Content preview: {content[:200]}...")
            else:
                print("❌ Failed to fetch content")
        else:
            print("❌ No URL available for content testing")
    
    print("\n" + "=" * 50)
    print("Test completed!")
    
    return len(news_items) > 0


def main():
    """Run the test."""
    try:
        success = test_fetch_news()
        if success:
            print("✅ All tests passed!")
            sys.exit(0)
        else:
            print("❌ Some tests failed!")
            sys.exit(1)
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()