class GeminiAIClone {
    constructor() {
        this.config = window.CONFIG || {};
        // Set default API key
        const defaultApiKey = 'AIzaSyAfvE0NwEvqq5GDhqgwmf23TzjC2ECeROA';
        const storageKey = this.config.STORAGE_KEYS?.API_KEY || 'gemini_api_key';

        this.apiKey = localStorage.getItem(storageKey) || defaultApiKey;

        // Save default API key to localStorage if not already saved
        if (!localStorage.getItem(storageKey)) {
            localStorage.setItem(storageKey, defaultApiKey);
        }

        this.currentChatId = null;
        this.chatHistory = JSON.parse(localStorage.getItem(this.config.STORAGE_KEYS?.CHAT_HISTORY || 'chat_history')) || [];
        this.currentMessages = [];
        this.isLoading = false;

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTheme();
        this.loadChatHistory();
        this.autoResizeTextarea();

        // Only show API key modal if no API key is set (since we have a default now)
        // User can still access it via the key button in the header
    }

    bindEvents() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // API key modal
        document.getElementById('apiKeyBtn').addEventListener('click', () => this.showApiKeyModal());
        document.getElementById('modalClose').addEventListener('click', () => this.hideApiKeyModal());
        document.getElementById('saveKeyBtn').addEventListener('click', () => this.saveApiKey());

        // Input handling
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');

        messageInput.addEventListener('input', () => this.handleInputChange());
        messageInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        sendBtn.addEventListener('click', () => this.sendMessage());

        // File upload
        document.getElementById('uploadBtn').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });
        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileUpload(e));

        // Voice input (placeholder for future implementation)
        document.getElementById('voiceBtn').addEventListener('click', () => this.toggleVoiceInput());

        // Example prompts
        document.querySelectorAll('.prompt-card').forEach(card => {
            card.addEventListener('click', () => {
                const prompt = card.getAttribute('data-prompt');
                this.setInputValue(prompt);
                this.sendMessage();
            });
        });

        // Quick actions
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                this.handleQuickAction(action);
            });
        });

        // Modal click outside to close
        document.getElementById('apiKeyModal').addEventListener('click', (e) => {
            if (e.target.id === 'apiKeyModal') {
                this.hideApiKeyModal();
            }
        });
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        const themeIcon = document.getElementById('themeIcon');
        themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);

        const themeIcon = document.getElementById('themeIcon');
        themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    showApiKeyModal() {
        const modal = document.getElementById('apiKeyModal');
        const input = document.getElementById('apiKeyInput');

        modal.style.display = 'block';
        input.value = this.apiKey;
        setTimeout(() => input.focus(), 100);
    }

    hideApiKeyModal() {
        document.getElementById('apiKeyModal').style.display = 'none';
    }

    saveApiKey() {
        const apiKey = document.getElementById('apiKeyInput').value.trim();

        if (!apiKey) {
            alert('Please enter a valid API key');
            return;
        }

        this.apiKey = apiKey;
        localStorage.setItem(this.config.STORAGE_KEYS?.API_KEY || 'gemini_api_key', apiKey);
        this.hideApiKeyModal();

        // Show success message
        this.showNotification('API key saved successfully!', 'success');
    }

    handleInputChange() {
        const input = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const charCount = document.getElementById('charCount');

        const length = input.value.length;
        charCount.textContent = `${length}/4000`;

        sendBtn.disabled = length === 0 || this.isLoading;
    }

    handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!this.isLoading && document.getElementById('messageInput').value.trim()) {
                this.sendMessage();
            }
        }
    }

    autoResizeTextarea() {
        const textarea = document.getElementById('messageInput');

        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
        });
    }

    setInputValue(value) {
        const input = document.getElementById('messageInput');
        input.value = value;
        this.handleInputChange();
        input.focus();
    }

    async sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();

        if (!message || this.isLoading) return;

        if (!this.apiKey) {
            this.showApiKeyModal();
            return;
        }

        // Hide welcome screen and show chat
        this.showChatInterface();

        // Add user message
        this.addMessage('user', message);

        // Clear input
        input.value = '';
        this.handleInputChange();

        // Show loading
        this.setLoading(true);

        try {
            // Get AI response
            const response = await this.callGeminiAPI(message);
            this.addMessage('ai', response);

            // Save to history
            this.saveCurrentChat();

        } catch (error) {
            console.error('Error calling Gemini API:', error);
            let errorMessage = 'Sorry, I encountered an error while processing your request.';

            if (error.message.includes('Invalid API key')) {
                errorMessage = 'Invalid API key. Please check your API key in the settings and try again.';
            } else if (error.message.includes('Too many requests')) {
                errorMessage = 'Too many requests. Please wait a moment and try again.';
            } else if (error.message.includes('API access forbidden')) {
                errorMessage = 'API access forbidden. Please check your API key permissions.';
            } else if (error.message.includes('Invalid request')) {
                errorMessage = 'Invalid request format. Please try rephrasing your message.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            this.addMessage('ai', errorMessage);
        } finally {
            this.setLoading(false);
        }
    }

    async callGeminiAPI(message) {
        // Try multiple API endpoints in case one doesn't work
        const apiEndpoints = [
            'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
            'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
        ];

        const requestBody = {
            contents: [{
                parts: [{
                    text: message
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
                stopSequences: []
            }
        };

        // Try each endpoint until one works
        for (let i = 0; i < apiEndpoints.length; i++) {
            const apiUrl = apiEndpoints[i];

            try {
                console.log(`Trying API endpoint ${i + 1}/${apiEndpoints.length}:`, apiUrl);
                console.log('Making API call with key:', this.apiKey.substring(0, 10) + '...');

                const response = await fetch(`${apiUrl}?key=${this.apiKey}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                });

                console.log('Response status:', response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('API Error Response:', errorText);

                    // If 404, try next endpoint
                    if (response.status === 404 && i < apiEndpoints.length - 1) {
                        console.log('Endpoint not found, trying next one...');
                        continue;
                    }

                    if (response.status === 400) {
                        throw new Error('Invalid request. Please check your message and try again.');
                    } else if (response.status === 401) {
                        throw new Error('Invalid API key. Please check your API key and try again.');
                    } else if (response.status === 403) {
                        throw new Error('API access forbidden. Please check your API key permissions.');
                    } else if (response.status === 404) {
                        throw new Error('API endpoint not found. The Gemini API may have changed.');
                    } else if (response.status === 429) {
                        throw new Error('Too many requests. Please wait a moment and try again.');
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                }

                const data = await response.json();
                console.log('API Response:', data);

                if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                    console.log('Success with endpoint:', apiUrl);
                    return data.candidates[0].content.parts[0].text;
                } else if (data.error) {
                    throw new Error(data.error.message || 'API returned an error');
                } else {
                    throw new Error('No response generated');
                }
            } catch (error) {
                console.error(`API call failed for endpoint ${apiUrl}:`, error);

                // If this is the last endpoint, throw the error
                if (i === apiEndpoints.length - 1) {
                    throw error;
                }

                // Otherwise, try the next endpoint
                console.log('Trying next endpoint...');
            }
        }
    } showChatInterface() {
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('chatMessages').style.display = 'block';
    }

    addMessage(sender, content) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageElement = this.createMessageElement(sender, content);

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Add to current messages
        this.currentMessages.push({ sender, content, timestamp: Date.now() });
    }

    createMessageElement(sender, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const isUser = sender === 'user';
        const avatar = isUser ? 'fas fa-user' : 'fas fa-gem';
        const senderName = isUser ? 'You' : 'Gemini';

        messageDiv.innerHTML = `
            <div class="message-header">
                <div class="message-avatar ${sender}-avatar">
                    <i class="${avatar}"></i>
                </div>
                <span class="message-sender">${senderName}</span>
            </div>
            <div class="message-content">
                ${this.formatMessage(content)}
            </div>
            ${!isUser ? this.createMessageActions() : ''}
        `;

        return messageDiv;
    }

    formatMessage(content) {
        // Basic markdown-like formatting
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    createMessageActions() {
        return `
            <div class="message-actions">
                <button class="action-btn-small copy-btn" onclick="geminiClone.copyMessage(this)">
                    <i class="fas fa-copy"></i>
                    Copy
                </button>
                <button class="action-btn-small like-btn" onclick="geminiClone.likeMessage(this)">
                    <i class="fas fa-thumbs-up"></i>
                    Like
                </button>
                <button class="action-btn-small dislike-btn" onclick="geminiClone.dislikeMessage(this)">
                    <i class="fas fa-thumbs-down"></i>
                    Dislike
                </button>
            </div>
        `;
    }

    copyMessage(button) {
        const messageContent = button.closest('.message').querySelector('.message-content');
        const text = messageContent.innerText;

        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Message copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy message', 'error');
        });
    }

    likeMessage(button) {
        button.classList.toggle('active');
        button.style.color = button.classList.contains('active') ? '#34a853' : '';

        // Remove dislike if active
        const dislikeBtn = button.parentElement.querySelector('.dislike-btn');
        dislikeBtn.classList.remove('active');
        dislikeBtn.style.color = '';
    }

    dislikeMessage(button) {
        button.classList.toggle('active');
        button.style.color = button.classList.contains('active') ? '#ea4335' : '';

        // Remove like if active
        const likeBtn = button.parentElement.querySelector('.like-btn');
        likeBtn.classList.remove('active');
        likeBtn.style.color = '';
    }

    setLoading(loading) {
        this.isLoading = loading;
        const loadingIndicator = document.getElementById('loadingIndicator');
        const sendBtn = document.getElementById('sendBtn');

        loadingIndicator.style.display = loading ? 'flex' : 'none';
        sendBtn.disabled = loading || !document.getElementById('messageInput').value.trim();
    }

    handleFileUpload(event) {
        const files = event.target.files;
        if (files.length === 0) return;

        // For now, just show a notification that file upload is being processed
        // In a real implementation, you would handle the file upload to the API
        this.showNotification(`${files.length} file(s) selected. File upload feature coming soon!`, 'info');
    }

    toggleVoiceInput() {
        const voiceBtn = document.getElementById('voiceBtn');

        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            if (voiceBtn.classList.contains('recording')) {
                recognition.stop();
                voiceBtn.classList.remove('recording');
            } else {
                recognition.start();
                voiceBtn.classList.add('recording');

                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    this.setInputValue(transcript);
                    voiceBtn.classList.remove('recording');
                };

                recognition.onerror = () => {
                    voiceBtn.classList.remove('recording');
                    this.showNotification('Voice recognition failed', 'error');
                };

                recognition.onend = () => {
                    voiceBtn.classList.remove('recording');
                };
            }
        } else {
            this.showNotification('Voice recognition not supported in your browser', 'error');
        }
    }

    handleQuickAction(action) {
        const prompts = {
            research: "Conduct a deep research on the latest developments in artificial intelligence and provide a comprehensive summary.",
            image: "Please analyze the image I'm about to upload and provide detailed insights.",
            video: "Help me analyze a video file and extract key information from it."
        };

        if (prompts[action]) {
            this.setInputValue(prompts[action]);
        }
    }

    saveCurrentChat() {
        if (this.currentMessages.length === 0) return;

        const chatId = this.currentChatId || Date.now().toString();
        this.currentChatId = chatId;

        const firstUserMessage = this.currentMessages.find(m => m.sender === 'user');
        const title = firstUserMessage ?
            firstUserMessage.content.substring(0, 50) + (firstUserMessage.content.length > 50 ? '...' : '') :
            'New Chat';

        const chatData = {
            id: chatId,
            title,
            messages: [...this.currentMessages],
            timestamp: Date.now()
        };

        // Update or add to history
        const existingIndex = this.chatHistory.findIndex(chat => chat.id === chatId);
        if (existingIndex >= 0) {
            this.chatHistory[existingIndex] = chatData;
        } else {
            this.chatHistory.unshift(chatData);
        }

        // Keep only last 50 chats
        this.chatHistory = this.chatHistory.slice(0, 50);

        localStorage.setItem('chat_history', JSON.stringify(this.chatHistory));
        this.loadChatHistory();
    }

    loadChatHistory() {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';

        if (this.chatHistory.length === 0) {
            historyList.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.875rem; text-align: center; padding: 1rem;">No chat history yet</p>';
            return;
        }

        this.chatHistory.forEach(chat => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div style="font-weight: 500; margin-bottom: 0.25rem;">${chat.title}</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary);">${this.formatDate(chat.timestamp)}</div>
            `;

            historyItem.addEventListener('click', () => this.loadChat(chat));
            historyList.appendChild(historyItem);
        });
    }

    loadChat(chat) {
        this.currentChatId = chat.id;
        this.currentMessages = [...chat.messages];

        // Clear current chat display
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.innerHTML = '';

        // Show chat interface
        this.showChatInterface();

        // Load messages
        chat.messages.forEach(message => {
            const messageElement = this.createMessageElement(message.sender, message.content);
            messagesContainer.appendChild(messageElement);
        });

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Today';
        if (diffDays === 2) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays} days ago`;

        return date.toLocaleDateString();
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--surface-color);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 1rem 1.5rem;
            box-shadow: var(--shadow-medium);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            max-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;

        const icon = type === 'success' ? 'fas fa-check-circle' :
            type === 'error' ? 'fas fa-exclamation-circle' :
                'fas fa-info-circle';

        const color = type === 'success' ? '#34a853' :
            type === 'error' ? '#ea4335' :
                '#1a73e8';

        notification.innerHTML = `
            <i class="${icon}" style="color: ${color};"></i>
            <span style="color: var(--text-primary); font-size: 0.875rem;">${message}</span>
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // New chat functionality
    startNewChat() {
        this.currentChatId = null;
        this.currentMessages = [];

        // Clear chat display
        document.getElementById('chatMessages').innerHTML = '';
        document.getElementById('welcomeScreen').style.display = 'flex';
        document.getElementById('chatMessages').style.display = 'none';

        // Clear input
        document.getElementById('messageInput').value = '';
        this.handleInputChange();
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .action-btn-small.active {
        background: var(--hover-color);
    }
`;
document.head.appendChild(style);

// Initialize the app
let geminiClone;
document.addEventListener('DOMContentLoaded', () => {
    geminiClone = new GeminiAIClone();
});

// Add keyboard shortcut for new chat
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        if (geminiClone) {
            geminiClone.startNewChat();
        }
    }
});

// Export for global access
window.geminiClone = geminiClone;
