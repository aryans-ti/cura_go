# Secure API Key Setup Guide

This document explains how to properly secure your Gemini API key for the CuraGo application.

## Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Log in with your Google account
3. Create a new API key
4. Copy the API key to a secure location (you'll only see it once)

## Setting Up Environment Variables

The application loads API keys from environment variables using a `.env` file, which is not committed to version control for security reasons.

### Option 1: Create a .env File (Recommended for Development)

1. Create a file named `.env` in the `server` directory
2. Add the following content, replacing `your_api_key_here` with your actual Gemini API key:

```
# Server configuration
PORT=4001
NODE_ENV=development

# Gemini API Configuration
GEMINI_API_KEY=your_api_key_here
GEMINI_DEFAULT_MODEL=gemini-1.5-flash
GEMINI_FALLBACK_MODEL=gemini-1.5-pro
GEMINI_API_TIMEOUT=30000
```

### Option 2: Setting Environment Variables in Your Hosting Environment

For production deployments, set these environment variables in your hosting environment (e.g., Vercel, Netlify, Heroku, etc.) rather than using a .env file.

## Security Best Practices

1. **Never commit your API keys to version control**
2. **Never log your API key** - The application is designed to only log whether an API key is found, not the actual key
3. **Restrict your API key** - In Google AI Studio, set appropriate usage limits and restrictions
4. **Rotate your keys periodically** - Create new keys and deprecate old ones regularly
5. **Use environment-specific keys** - Use different API keys for development, staging, and production

## Troubleshooting

If you see "Using fallback response (Gemini API not available)" in the logs, it means:

1. Your `.env` file is missing
2. The `GEMINI_API_KEY` variable is not set
3. The API key is invalid

Check that your API key is properly set up and that the `.env` file is in the correct location.

## Rate Limits

The application includes built-in protections for API rate limits including:
- Request timeouts
- Multiple model fallbacks
- Exponential backoff retries

If you see "Rate limit hit, waiting before retry..." in the logs, the application is handling rate limiting automatically. 