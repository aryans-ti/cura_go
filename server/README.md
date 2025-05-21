# AI Chatbot Backend (Google Gemini API)

A secure Express backend for an AI chatbot that uses Google Gemini's API to generate responses.

## Setup

1. Create a `.env` file in the `server` directory with the following content:

```
# Google Gemini API key
GEMINI_API_KEY=your_api_key_here

# Port for the server (default: 3001)
PORT=3001
```

2. Replace `your_api_key_here` with your actual Google Gemini API key.

## Installation

Install the required dependencies:

```bash
npm install
```

## Running the Server

Start the development server with:

```bash
npm run server:dev
```

For production, build and start the server:

```bash
npm run server:build
npm run server:start
```

## API Endpoints

### POST /chat

Send a message to the chatbot.

**Request Body:**

```json
{
  "message": "Hello, how are you?"
}
```

**Response:**

```json
{
  "message": "I'm doing well, thank you for asking! How can I assist you today?",
  "source": "ai"
}
```

### GET /health

Health check endpoint.

**Response:**

```json
{
  "status": "ok"
}
```

## Features

- TypeScript implementation
- Secure API key handling with dotenv
- Request validation with Zod
- Rate limit handling with retry logic
- Response caching for improved performance
- Security with Helmet and CORS middleware
- Fallback responses when API is unavailable 