// Configuration file for Gemini AI Clone
// You can modify these settings to customize the application

const CONFIG = {
    // API Configuration
    API: {
        BASE_URL: 'https://generativelanguage.googleapis.com/v1beta',
        MODEL: 'gemini-pro',
        TIMEOUT: 30000, // 30 seconds
        MAX_RETRIES: 3
    },

    // Generation Parameters
    GENERATION: {
        TEMPERATURE: 0.7,
        TOP_K: 40,
        TOP_P: 0.95,
        MAX_OUTPUT_TOKENS: 1024,
        CANDIDATE_COUNT: 1
    },

    // Safety Settings
    SAFETY_SETTINGS: [
        {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
    ],

    // UI Configuration
    UI: {
        MAX_MESSAGE_LENGTH: 4000,
        AUTO_SCROLL: true,
        TYPING_INDICATOR: true,
        THEME_PERSISTENCE: true,
        CHAT_HISTORY_LIMIT: 50
    },

    // Feature Flags
    FEATURES: {
        VOICE_INPUT: true,
        FILE_UPLOAD: false, // Will be enabled when API supports it
        STREAMING: false,   // Will be enabled when API supports it
        EXPORT_CHAT: true,
        SEARCH_HISTORY: true
    },

    // Quick Action Prompts
    QUICK_ACTIONS: {
        RESEARCH: "Conduct a deep research on the latest developments in artificial intelligence and provide a comprehensive summary with sources and key insights.",
        IMAGE_ANALYSIS: "Please analyze the image I'm about to upload and provide detailed insights about its content, context, and any relevant information you can extract.",
        VIDEO_ANALYSIS: "Help me analyze a video file and extract key information including main topics, important moments, and actionable insights.",
        CODE_REVIEW: "Review the code I'll share and provide suggestions for improvements, best practices, and potential issues.",
        WRITING_HELP: "Help me improve my writing by providing suggestions for clarity, grammar, style, and overall effectiveness."
    },

    // Example Prompts for Welcome Screen
    EXAMPLE_PROMPTS: [
        {
            text: "Explain quantum computing in simple terms",
            icon: "fas fa-atom",
            category: "science"
        },
        {
            text: "Write a creative story about space exploration",
            icon: "fas fa-rocket",
            category: "creative"
        },
        {
            text: "Help me plan a healthy meal for the week",
            icon: "fas fa-utensils",
            category: "lifestyle"
        },
        {
            text: "Explain the latest trends in AI technology",
            icon: "fas fa-brain",
            category: "technology"
        }
    ],

    // Storage Keys
    STORAGE_KEYS: {
        API_KEY: 'AIzaSyAfvE0NwEvqq5GDhqgwmf23TzjC2ECeROA',
        THEME: 'theme',
        CHAT_HISTORY: 'chat_history',
        USER_PREFERENCES: 'user_preferences'
    },

    // Error Messages
    ERRORS: {
        NO_API_KEY: 'Please enter your Gemini API key to continue.',
        API_ERROR: 'Sorry, I encountered an error while processing your request. Please try again.',
        NETWORK_ERROR: 'Network error. Please check your internet connection.',
        QUOTA_EXCEEDED: 'API quota exceeded. Please try again later.',
        INVALID_KEY: 'Invalid API key. Please check your key and try again.'
    },

    // Success Messages
    MESSAGES: {
        API_KEY_SAVED: 'API key saved successfully!',
        MESSAGE_COPIED: 'Message copied to clipboard!',
        EXPORT_SUCCESS: 'Chat exported successfully!',
        SETTINGS_SAVED: 'Settings saved successfully!'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// Make available globally
window.CONFIG = CONFIG;
