// Chat Widget - Real-time Chat Interface
class ChatWidget {
  constructor() {
    this.conversationId = null;
    this.userId = this.getOrCreateUserId();
    this.isOpen = false;
    this.messagesUnread = 0;
    this.visitorName = null;
    this.visitorEmail = null;
    this.init();
  }

  getOrCreateUserId() {
    let userId = sessionStorage.getItem('chatUserId');
    if (!userId) {
      userId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('chatUserId', userId);
    }
    return userId;
  }

  init() {
    // Create widget HTML
    this.createWidget();
    this.setupEventListeners();
    // Don't load conversation yet - wait for user to start chat
  }

  createWidget() {
    // Make sure we're adding to an existing body
    if (!document.body) {
      console.warn('Document body not ready, retrying widget creation');
      setTimeout(() => this.createWidget(), 100);
      return;
    }

    const styles = `
      #chatWidget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        z-index: 9999;
      }

      .chat-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #2a4175 0%, #4a6fa5 100%);
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        box-shadow: 0 4px 16px rgba(42, 65, 117, 0.3);
        transition: all 0.3s ease;
        position: relative;
      }

      .chat-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(42, 65, 117, 0.4);
      }

      .chat-button.active {
        background: linear-gradient(135deg, #fca311 0%, #ff9500 100%);
      }

      .chat-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #ff6b6b;
        color: white;
        border-radius: 50%;
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
        display: none;
      }

      .chat-badge.show {
        display: flex;
      }

      .chat-window {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 380px;
        height: 600px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        display: none;
        flex-direction: column;
        overflow: hidden;
      }

      .chat-window.open {
        display: flex;
      }

      .chat-header {
        background: linear-gradient(135deg, #2a4175 0%, #4a6fa5 100%);
        color: white;
        padding: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
      }

      .chat-header h3 {
        margin: 0;
        font-size: 1.1rem;
      }

      .chat-header-close {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        cursor: pointer;
        font-size: 20px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }

      .chat-header-close:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        background: #f9f9f9;
      }

      .message {
        display: flex;
        gap: 0.5rem;
        align-items: flex-end;
        animation: slideIn 0.3s ease;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .message.user {
        justify-content: flex-end;
      }

      .message-bubble {
        max-width: 95%;
        padding: 0.75rem 1rem;
        border-radius: 12px;
        word-wrap: break-word;
        font-size: 0.95rem;
        line-height: 1.4;
        white-space: normal;
        overflow-wrap: break-word;
      }

      .message.user .message-bubble {
        background: linear-gradient(135deg, #2a4175 0%, #4a6fa5 100%);
        color: white;
        border-bottom-right-radius: 2px;
      }

      .message.admin .message-bubble {
        background: #e8e8e8;
        color: #333;
        border-bottom-left-radius: 2px;
      }

      .message-time {
        font-size: 0.75rem;
        color: #999;
        margin-top: 0.3rem;
      }

      .chat-input-area {
        padding: 1rem;
        background: white;
        border-top: 1px solid #e0e0e0;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        flex-shrink: 0;
      }

      .chat-input-group {
        display: flex;
        gap: 0.5rem;
      }

      .chat-input {
        flex: 1;
        padding: 0.75rem 1rem;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 0.9rem;
        outline: none;
        transition: all 0.3s ease;
      }

      .chat-input:focus {
        border-color: #2a4175;
        box-shadow: 0 0 0 3px rgba(42, 65, 117, 0.1);
      }

      .chat-send-btn {
        padding: 0.75rem 1rem;
        background: linear-gradient(135deg, #fca311 0%, #ff9500 100%);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .chat-send-btn:hover {
        box-shadow: 0 4px 12px rgba(252, 163, 17, 0.3);
      }

      .chat-send-btn:active {
        transform: scale(0.95);
      }

      .chat-visitor-info {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .chat-visitor-info input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        font-size: 0.9rem;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        outline: none;
      }

      .chat-visitor-info input:focus {
        border-color: #2a4175;
        box-shadow: 0 0 0 3px rgba(42, 65, 117, 0.1);
      }

      .chat-welcome-screen {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding: 2rem 1.5rem;
        background: #f9f9f9;
        flex: 1;
        justify-content: center;
      }

      .chat-welcome-screen h2 {
        margin: 0;
        color: #2a4175;
        font-size: 1.2rem;
        text-align: center;
      }

      .chat-welcome-screen p {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
        text-align: center;
      }

      .chat-welcome-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .chat-button-group {
        display: flex;
        gap: 0.75rem;
      }

      .chat-btn-primary, .chat-btn-secondary {
        flex: 1;
        padding: 0.75rem;
        border: none;
        border-radius: 6px;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 0.9rem;
      }

      .chat-btn-primary {
        background: linear-gradient(135deg, #fca311 0%, #ff9500 100%);
        color: white;
      }

      .chat-btn-primary:hover {
        box-shadow: 0 4px 12px rgba(252, 163, 17, 0.3);
      }

      .chat-btn-secondary {
        background: white;
        border: 2px solid #2a4175;
        color: #2a4175;
      }

      .chat-btn-secondary:hover {
        background: #f0f0f0;
      }

      .chat-loading {
        text-align: center;
        padding: 2rem;
        color: #999;
      }

      @media (max-width: 480px) {
        .chat-window {
          width: calc(100vw - 20px);
          height: 70vh;
          bottom: 80px;
          right: 10px;
        }

        .message-bubble {
          max-width: 85%;
        }
      }
    `;

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Create HTML
    const widget = document.createElement('div');
    widget.id = 'chatWidget';
    widget.innerHTML = `
      <button class="chat-button" id="chatToggle" title="Chat with us">
        💬
        <div class="chat-badge" id="chatBadge">0</div>
      </button>

      <div class="chat-window" id="chatWindow">
        <div class="chat-header">
          <h3>💬 Chat Support</h3>
          <button class="chat-header-close" id="chatClose">×</button>
        </div>

        <!-- Welcome Screen (shown first) -->
        <div class="chat-welcome-screen" id="chatWelcome">
          <h2>Welcome to Chat Support</h2>
          <p>Get help from our support team</p>
          
          <div class="chat-welcome-form">
            <div class="chat-visitor-info">
              <input type="text" id="welcomeName" placeholder="Your name" maxlength="30">
              <input type="email" id="welcomeEmail" placeholder="Your email">
            </div>
            <div class="chat-button-group">
              <button class="chat-btn-primary" id="chatStartBtn">Start Chat</button>
              <button class="chat-btn-secondary" id="chatGuestBtn">Chat as Guest</button>
            </div>
          </div>
        </div>

        <!-- Chat Screen (shown after welcome) -->
        <div id="chatContent" style="display: none; flex: 1; display: flex; flex-direction: column;">
          <div class="chat-messages" id="chatMessages">
            <div class="chat-loading">Loading conversation...</div>
          </div>

          <div class="chat-input-area">
            <div class="chat-input-group">
              <input type="text" class="chat-input" id="chatInput" placeholder="Type your message...">
              <button class="chat-send-btn" id="chatSend">Send</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(widget);
  }

  setupEventListeners() {
    // Toggle chat window
    document.getElementById('chatToggle').addEventListener('click', () => this.toggleChat());
    document.getElementById('chatClose').addEventListener('click', () => this.closeChat());
    
    // Welcome form buttons
    document.getElementById('chatStartBtn').addEventListener('click', () => this.startChat());
    document.getElementById('chatGuestBtn').addEventListener('click', () => this.startChatAsGuest());
    
    // Chat message sending
    document.getElementById('chatSend').addEventListener('click', () => this.sendMessage());
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  startChat() {
    const name = document.getElementById('welcomeName').value.trim();
    const email = document.getElementById('welcomeEmail').value.trim();
    
    if (!name) {
      alert('Please enter your name');
      return;
    }
    
    if (!email) {
      alert('Please enter your email');
      return;
    }
    
    this.visitorName = name;
    this.visitorEmail = email;
    this.showChatScreen();
  }

  startChatAsGuest() {
    this.visitorName = 'Guest';
    this.visitorEmail = '';
    this.showChatScreen();
  }

  showChatScreen() {
    // Hide welcome screen, show chat content
    document.getElementById('chatWelcome').style.display = 'none';
    const chatContent = document.getElementById('chatContent');
    chatContent.style.display = 'flex';
    
    // Now load the conversation
    this.loadOrCreateConversation();
    
    // Focus on input
    setTimeout(() => {
      document.getElementById('chatInput').focus();
    }, 100);
  }

  async loadOrCreateConversation() {
    try {
      // Wait for Firebase to be available
      let attempts = 0;
      while (!window.firebaseDB && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (!window.firebaseDB) {
        console.error('Firebase still not initialized after 5 seconds');
        // Try alternate Firebase reference
        if (window.firebase && window.firebase.firestore) {
          console.log('Using window.firebase.firestore instead');
          window.firebaseDB = window.firebase.firestore();
        } else {
          console.error('Firebase not available anywhere');
          return;
        }
      }

      const db = window.firebaseDB;
      if (!db || typeof db.collection !== 'function') {
        console.error('Invalid Firebase database reference:', db);
        return;
      }

      const chatsRef = db.collection('chats');
      
      // Query for existing conversation with this userId (simplified query to avoid needing composite index)
      const query = chatsRef.where('userId', '==', this.userId);
      const snapshot = await query.get();

      // Filter for active conversations in code
      let activeConversation = null;
      if (!snapshot.empty) {
        for (let doc of snapshot.docs) {
          const data = doc.data();
          if (data.status !== 'closed') {
            activeConversation = doc;
            break;
          }
        }
      }

      if (activeConversation) {
        // Use existing active conversation
        this.conversationId = activeConversation.id;
        console.log('Using existing conversation:', this.conversationId);
        this.setupRealtimeListener();
        this.loadMessages();
      } else {
        // Create new conversation
        console.log('Creating new conversation for user:', this.userId);
        const newConv = await chatsRef.add({
          userId: this.userId,
          visitorName: '',
          visitorEmail: '',
          status: 'active',
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        this.conversationId = newConv.id;
        console.log('New conversation created:', this.conversationId);
        this.setupRealtimeListener();
      }
    } catch (error) {
      console.error('Error loading conversation:', error.message, error);
    }
  }

  setupRealtimeListener() {
    const db = window.firebaseDB;
    
    // Listen to conversation status changes
    db.collection('chats').doc(this.conversationId).onSnapshot((doc) => {
      const convData = doc.data();
      if (convData.status === 'closed') {
        this.handleConversationClosed();
      }
    });
    
    // Listen for messages
    const messagesRef = db.collection('chats').doc(this.conversationId).collection('messages');
    messagesRef.orderBy('timestamp', 'asc').onSnapshot((snapshot) => {
      this.displayMessages(snapshot.docs);
      this.updateUnreadCount();
    });
  }

  handleConversationClosed() {
    // Disable input and show message
    const input = document.getElementById('chatInput');
    const sendBtn = document.querySelector('.chat-send-btn');
    
    if (input) {
      input.disabled = true;
      input.placeholder = 'This conversation has been closed';
      input.style.background = '#f5f5f5';
    }
    
    if (sendBtn) {
      sendBtn.disabled = true;
      sendBtn.style.opacity = '0.5';
      sendBtn.style.cursor = 'not-allowed';
    }
    
    // Show notice
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
      const notice = document.createElement('div');
      notice.style.cssText = 'padding: 1rem; background: #fff3cd; border-left: 4px solid #ffc107; margin: 1rem; color: #856404; font-size: 0.9rem; font-weight: 500;';
      notice.innerHTML = '📌 This conversation has been closed by support.';
      chatMessages.appendChild(notice);
    }
  }

  loadMessages() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.innerHTML = '<div style="color: #999; text-align: center; padding: 2rem;">Start a conversation...</div>';
  }

  displayMessages(docs) {
    const messagesContainer = document.getElementById('chatMessages');
    
    if (docs.length === 0) {
      messagesContainer.innerHTML = '<div style="color: #999; text-align: center; padding: 2rem; font-size: 0.9rem;">No messages yet. Start the conversation...</div>';
      return;
    }

    messagesContainer.innerHTML = '';
    
    docs.forEach((doc) => {
      const msg = doc.data();
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${msg.sender === 'user' ? 'user' : 'admin'}`;
      
      const timestamp = msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
      
      const senderLabel = msg.sender === 'user' ? '' : 'Support: ';
      
      messageDiv.innerHTML = `
        <div style="width: 100%; display: flex; flex-direction: ${msg.sender === 'user' ? 'row-reverse' : 'row'}; gap: 0.5rem;">
          <div>
            <div class="message-bubble">${senderLabel}<strong>${msg.sender === 'admin' ? '' : ''}</strong>${this.escapeHtml(msg.text)}</div>
            <div class="message-time" style="text-align: ${msg.sender === 'user' ? 'right' : 'left'}; margin-top: 0.3rem;">${timestamp}</div>
          </div>
        </div>
      `;
      
      messagesContainer.appendChild(messageDiv);
    });

    // Scroll to bottom
    setTimeout(() => {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 0);
  }

  async sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    
    if (!text) return;
    
    // Wait for Firebase and conversationId to be ready
    let attempts = 0;
    while ((!this.conversationId || !window.firebaseDB) && attempts < 20) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    if (!this.conversationId || !window.firebaseDB) {
      console.error('Conversation not initialized or Firebase not available');
      alert('Chat is not ready. Please refresh the page.');
      return;
    }

    try {
      const db = window.firebaseDB;
      const convDoc = await db.collection('chats').doc(this.conversationId).get();
      
      if (!convDoc.exists) {
        console.error('Conversation document not found');
        alert('Chat session lost. Please refresh the page.');
        return;
      }
      
      const convData = convDoc.data();
      
      if (convData && convData.status === 'closed') {
        alert('This conversation has been closed. You cannot send new messages.');
        return;
      }

      const visitorName = this.visitorName || 'Guest';
      const visitorEmail = this.visitorEmail || '';

      // Update visitor info
      await db.collection('chats').doc(this.conversationId).update({
        visitorName,
        visitorEmail,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastMessagePreview: text.substring(0, 50) + (text.length > 50 ? '...' : '')
      });

      // Send message
      await db.collection('chats').doc(this.conversationId).collection('messages').add({
        sender: 'user',
        text,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        read: false
      });

      input.value = '';
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message: ' + error.message);
    }
  }

  updateUnreadCount() {
    const db = window.firebaseDB;
    const messagesRef = db.collection('chats').doc(this.conversationId).collection('messages');
    
    messagesRef.where('sender', '==', 'admin').where('read', '==', false).onSnapshot((snapshot) => {
      this.messagesUnread = snapshot.size;
      const badge = document.getElementById('chatBadge');
      if (this.messagesUnread > 0) {
        badge.textContent = this.messagesUnread;
        badge.classList.add('show');
      } else {
        badge.classList.remove('show');
      }
    });
  }

  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  openChat() {
    this.isOpen = true;
    document.getElementById('chatWindow').classList.add('open');
    document.getElementById('chatToggle').classList.add('active');
    document.getElementById('chatInput').focus();
    
    // Mark messages as read
    this.markMessagesAsRead();
  }

  closeChat() {
    this.isOpen = false;
    document.getElementById('chatWindow').classList.remove('open');
    document.getElementById('chatToggle').classList.remove('active');
  }

  async markMessagesAsRead() {
    try {
      if (!this.conversationId || !window.firebaseDB) return;
      
      const db = window.firebaseDB;
      const messagesRef = db.collection('chats').doc(this.conversationId).collection('messages');
      
      const unreadMessages = await messagesRef.where('sender', '==', 'admin').where('read', '==', false).get();
      
      if (unreadMessages.empty) return;
      
      const batch = db.batch();
      unreadMessages.docs.forEach((doc) => {
        batch.update(doc.ref, { read: true });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize chat widget when page loads
function initializeChatWidget() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeChatWidget);
    return;
  }
  
  // Wait for Firebase to be available
  if (!window.firebaseDB) {
    console.log('Firebase not ready yet, retrying in 500ms...');
    setTimeout(initializeChatWidget, 500);
    return;
  }
  
  console.log('Initializing chat widget...');
  try {
    new ChatWidget();
    console.log('Chat widget initialized successfully');
  } catch (error) {
    console.error('Error initializing chat widget:', error);
  }
}

// Start initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeChatWidget);
} else {
  initializeChatWidget();
}
