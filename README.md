# Gemini AI Clone

A clean, user-friendly Gemini AI clone website that allows users to interact with the Gemini 2.5 Pro API. This project mimics Google's Gemini interface while providing API-powered responses without requiring user logins.

## Features

### 🎨 Modern UI/UX

- **Gemini-inspired design** with authentic color scheme and styling
- **Dark/Light theme toggle** for comfortable viewing
- **Responsive design** that works on desktop, tablet, and mobile
- **Smooth animations** and transitions

### 🤖 AI Integration

- **Direct Gemini API integration** using your API key
- **Streaming responses** support (if API allows)
- **Markdown formatting** for rich text responses
- **Error handling** and fallback messages

### 💬 Chat Interface

- **Real-time messaging** with user and AI avatars
- **Message actions** (copy, like, dislike)
- **Chat history** stored locally
- **Auto-resizing input** for long messages
- **Character counter** (4000 character limit)

### 🔧 Advanced Features

- **Multimodal support** (text and image upload preparation)
- **Voice input** using Web Speech API
- **Quick action prompts** for common tasks
- **Local storage** for API key and chat history
- **Keyboard shortcuts** (Ctrl+N for new chat)

### 🚀 Quick Actions

- Deep Research
- Image Analysis
- Video Analysis

## Setup Instructions

### 1. Get a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key for Gemini
3. Copy the API key for later use

### 2. Clone and Setup

```bash
# Clone this repository
git clone <your-repo-url>
cd gemini_api_clone

# No additional installation required - pure HTML/CSS/JavaScript!
```

### 3. Run the Application

```bash
# Option 1: Use a simple HTTP server
python -m http.server 8000

# Option 2: Use Node.js http-server (if you have Node.js)
npx http-server

# Option 3: Use Live Server extension in VS Code
# Right-click on index.html and select "Open with Live Server"
```

### 4. Configure API Key

1. Open the application in your browser
2. Click the key icon in the header
3. Enter your Gemini API key
4. Click "Save Key" - it will be stored locally in your browser

## File Structure

```
gemini_api_clone/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and theming
├── script.js           # JavaScript functionality and API integration
└── README.md           # This file
```

## Usage

### Basic Chat

1. Enter your message in the input box
2. Press Enter or click the send button
3. View AI responses with proper formatting
4. Copy, like, or dislike responses

### Voice Input

1. Click the microphone icon
2. Speak your message
3. The text will be automatically filled in the input

### File Upload (Coming Soon)

1. Click the paperclip icon
2. Select images or videos
3. Send with your message for analysis

### Quick Actions

- Use sidebar buttons for pre-defined prompts
- Click example cards on the welcome screen
- Access recent chat history from the sidebar

## Customization

### Theme Colors

Edit the CSS variables in `styles.css`:

```css
:root {
  --primary-color: #1a73e8;
  --secondary-color: #34a853;
  --accent-color: #ea4335;
  /* ... other variables */
}
```

### API Configuration

Modify the API endpoint and parameters in `script.js`:

```javascript
const apiUrl =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
```

### Branding

- Change the logo and title in `index.html`
- Update the footer attribution
- Modify the welcome screen content

## Security Notes

- ✅ **API Key Security**: Keys are stored only in browser localStorage
- ✅ **No Server Required**: Pure client-side application
- ✅ **HTTPS Recommended**: Use HTTPS for production deployment
- ⚠️ **API Key Exposure**: Client-side storage means keys are visible to users

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## Features Roadmap

- [ ] **Conversation Export** (JSON, TXT, PDF)
- [ ] **Image Generation** (if Gemini supports it)
- [ ] **File Upload Support** for multimodal interactions
- [ ] **Plugin System** for custom actions
- [ ] **Conversation Search** functionality
- [ ] **Multiple API Provider** support

## Troubleshooting

### API Key Issues

- Ensure your API key is valid and has proper permissions
- Check if you've exceeded your API quota
- Verify the API endpoint URL is correct

### CORS Issues

- Host the files on a web server (not file://)
- Use http-server, Live Server, or similar tools
- Ensure your domain is allowed in API settings

### Performance Issues

- Clear browser cache and localStorage
- Check browser console for JavaScript errors
- Ensure you're using a modern browser

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Credits

- **UI Design**: Inspired by Google's Gemini interface
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Google Sans)
- **Developer**: Nagesh Sonawane
- **API**: Google Gemini AI

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review browser console for errors
3. Ensure API key is properly configured
4. Create an issue on GitHub

---

**Powered by Gemini API and Developed by Nagesh Sonawane**
