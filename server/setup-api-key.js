#!/usr/bin/env node

/**
 * Script to help set up the Gemini API key securely
 * 
 * Run this script with: node setup-api-key.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Define the path to the .env file in the server directory
const envPath = path.join(__dirname, '.env');

console.log('\n📋 Gemini API Key Setup Wizard 📋\n');
console.log('This script will help you set up your Gemini API key securely.');
console.log('Your API key will be stored in a local .env file and never committed to version control.\n');

// Check if .env file already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  A .env file already exists in the server directory.');
  rl.question('Do you want to overwrite it? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      promptForApiKey();
    } else {
      console.log('\n✅ Setup cancelled. Your existing .env file remains unchanged.');
      rl.close();
    }
  });
} else {
  promptForApiKey();
}

function promptForApiKey() {
  rl.question('\nEnter your Gemini API key (it will not be displayed): ', (apiKey) => {
    if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_api_key_here')) {
      console.log('\n❌ Invalid API key. Please provide a valid key.');
      return promptForApiKey();
    }
    
    rl.question('\nSpecify the default Gemini model to use (default: gemini-1.5-flash): ', (defaultModel) => {
      const model = defaultModel.trim() || 'gemini-1.5-flash';
      
      // Create the .env file content
      const envContent = `# Server configuration
PORT=4001
NODE_ENV=development

# Gemini API Configuration
GEMINI_API_KEY=${apiKey}
GEMINI_DEFAULT_MODEL=${model}
GEMINI_FALLBACK_MODEL=gemini-1.5-pro
GEMINI_API_TIMEOUT=30000
`;
      
      // Write the .env file
      try {
        fs.writeFileSync(envPath, envContent);
        console.log('\n✅ .env file created successfully!');
        console.log(`📁 Location: ${envPath}`);
        console.log('\n⚠️  IMPORTANT: Never commit this file to version control');
        console.log('🔒 Your API key is now securely stored in the .env file');
        rl.close();
      } catch (error) {
        console.error('\n❌ Error creating .env file:', error.message);
        rl.close();
      }
    });
  });
}

// Add warning when closing
rl.on('close', () => {
  console.log('\n🔐 Remember to add server/.env to your .gitignore file if it\'s not already there!');
  console.log('👋 Goodbye!\n');
  process.exit(0);
}); 