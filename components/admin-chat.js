// Admin Chat Interface
console.log('admin-chat.js loaded');

class AdminChatInterface {
  constructor() {
    this.conversations = [];
    this.selectedConversationId = null;
    this.notificationSound = null;
    this.unreadConversations = new Set();
    this.currentFilter = 'active';
    this.init();
  }

  init() {
    this.createNotificationSound();
    this.createChatUI();
    this.loadConversations();
    this.setupRealtimeListeners();
    this.requestNotificationPermission();
    this.updateNotificationBadge();
  }

  createNotificationSound() {
    // Create a simple notification sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.notificationSound = () => {
        const now = audioContext.currentTime;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.value = 800;
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        osc.start(now);
        osc.stop(now + 0.1);
      };
    } catch (e) {
      console.log('Audio context not available');
      this.notificationSound = null;
    }
  }

  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  createChatUI() {
    const chatTab = document.createElement('div');
    chatTab.id = 'admin-chat';
    chatTab.className = 'tab-content';
    chatTab.innerHTML = `
      <style>
        .admin-chat-container {
          display: flex;
          gap: 1.5rem;
          height: calc(100vh - 250px);
        }

        .chat-conversations {
          flex: 0 0 300px;
          background: #f9f9f9;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(0,0,0,0.08);
        }

        .chat-conversations-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }

        .chat-conversations-header h3 {
          margin: 0 0 0.8rem 0;
          color: #2a4175;
          font-size: 1.1rem;
        }

        .filter-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 0.4rem 0.8rem;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .filter-btn:hover {
          border-color: #2a4175;
        }

        .filter-btn.active {
          background: #2a4175;
          color: white;
          border-color: #2a4175;
        }

        .conversations-list {
          flex: 1;
          overflow-y: auto;
        }

        .conversation-item {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid rgba(0,0,0,0.04);
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
          position: relative;
        }

        .conversation-item:hover {
          background: #f0f0f0;
        }

        .conversation-item.active {
          background: linear-gradient(135deg, #2a4175 0%, #4a6fa5 100%);
          color: white;
        }

        .conversation-item.closed {
          opacity: 0.6;
        }

        .conversation-item.unread::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 8px;
          width: 8px;
          height: 8px;
          background: #fca311;
          border-radius: 50%;
          transform: translateY(-50%);
        }

        .conversation-visitor-name {
          font-weight: 600;
          margin-bottom: 0.3rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .conversation-status-badge {
          font-size: 0.65rem;
          padding: 0.2rem 0.4rem;
          background: rgba(0,0,0,0.1);
          border-radius: 3px;
          font-weight: 600;
        }

        .conversation-item.active .conversation-status-badge {
          background: rgba(255,255,255,0.3);
        }

        .conversation-visitor-email {
          font-size: 0.85rem;
          opacity: 0.7;
          margin-bottom: 0.5rem;
        }

        .conversation-last-message {
          font-size: 0.85rem;
          opacity: 0.6;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .conversation-time {
          font-size: 0.75rem;
          opacity: 0.5;
          margin-top: 0.3rem;
        }

        .chat-thread {
          flex: 1;
          background: white;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(0,0,0,0.08);
        }

        .chat-thread-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(0,0,0,0.08);
          background: #f9f9f9;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .chat-thread-info h3 {
          margin: 0 0 0.3rem 0;
          color: #2a4175;
        }

        .chat-thread-info p {
          margin: 0;
          font-size: 0.85rem;
          color: #999;
        }

        .chat-thread-actions {
          display: flex;
          gap: 0.5rem;
        }

        .close-conversation-btn {
          padding: 0.6rem 1rem;
          background: #d32f2f;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .close-conversation-btn:hover {
          background: #b71c1c;
          box-shadow: 0 2px 8px rgba(211, 47, 47, 0.3);
        }

        .conversation-status-text {
          padding: 0.6rem 1rem;
          background: #f0f0f0;
          border-radius: 4px;
          font-size: 0.85rem;
          color: #666;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .admin-message {
          display: flex;
          justify-content: flex-end;
          align-items: flex-end;
        }

        .user-message {
          display: flex;
          justify-content: flex-start;
          align-items: flex-end;
        }

        .message-wrapper {
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          max-width: 350px;
        }

        .message-bubble {
          max-width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          word-wrap: break-word;
          font-size: 0.95rem;
          line-height: 1.4;
          overflow-wrap: break-word;
          white-space: normal;
        }

        .admin-message .message-bubble {
          background: linear-gradient(135deg, #fca311 0%, #ff9500 100%);
          color: #2a4175;
        }

        .user-message .message-bubble {
          background: #e8e8e8;
          color: #333;
        }

        .message-time {
          font-size: 0.75rem;
          color: #999;
          margin-top: 0.3rem;
          padding: 0 0.5rem;
        }

        .conversation-closed-notice {
          padding: 1rem;
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          margin: -1.5rem -1.5rem 0 -1.5rem;
          color: #856404;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .chat-reply-area {
          padding: 1.5rem;
          border-top: 1px solid rgba(0,0,0,0.08);
          display: flex;
          gap: 0.75rem;
        }

        .chat-reply-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 6px;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .chat-reply-input:focus {
          border-color: #2a4175;
          box-shadow: 0 0 0 3px rgba(42, 65, 117, 0.1);
        }

        .chat-reply-btn {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #fca311 0%, #ff9500 100%);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .chat-reply-btn:hover {
          box-shadow: 0 4px 12px rgba(252, 163, 17, 0.3);
        }

        .no-conversation {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #999;
          text-align: center;
        }

        @media (max-width: 1200px) {
          .admin-chat-container {
            flex-direction: column;
            height: auto;
          }

          .chat-conversations {
            flex: 0 0 auto;
            max-height: 300px;
          }

          .chat-thread {
            max-height: 500px;
          }
        }
      </style>

      <div class="admin-chat-container">
        <div class="chat-conversations">
          <div class="chat-conversations-header">
            <h3>💬 Conversations</h3>
            <div class="filter-buttons">
              <button class="filter-btn active" onclick="window.adminChat.filterConversations('active')">Active</button>
              <button class="filter-btn" onclick="window.adminChat.filterConversations('closed')">Closed</button>
              <button class="filter-btn" onclick="window.adminChat.filterConversations('all')">All</button>
            </div>
          </div>
          <div class="conversations-list" id="conversationsList">
            <div style="padding: 2rem; text-align: center; color: #999;">Loading conversations...</div>
          </div>
        </div>

        <div class="chat-thread" id="chatThread">
          <div class="no-conversation">
            <div>
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const adminPanel = document.querySelector('#adminPanel');
    if (adminPanel) {
      adminPanel.appendChild(chatTab);
    }
  }

  filterConversations(status) {
    // Update button states
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    this.currentFilter = status;
    this.renderConversationsList(status);
  }

  async loadConversations() {
    try {
      const db = window.firebaseDB;
      const chatsRef = db.collection('chats');
      
      const snapshot = await chatsRef.orderBy('updatedAt', 'desc').get();
      
      this.conversations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      this.renderConversationsList(this.currentFilter);
    } catch (error) {
      console.error('Error loading conversations:', error);
      document.getElementById('conversationsList').innerHTML = '<div style="padding: 2rem; text-align: center; color: #d32f2f;">Error loading conversations</div>';
    }
  }

  renderConversationsList(filter = 'active') {
    const container = document.getElementById('conversationsList');
    
    // Filter conversations
    let filtered = this.conversations;
    if (filter === 'active') {
      filtered = this.conversations.filter(c => c.status !== 'closed');
    } else if (filter === 'closed') {
      filtered = this.conversations.filter(c => c.status === 'closed');
    }
    
    if (filtered.length === 0) {
      container.innerHTML = `<div style="padding: 2rem; text-align: center; color: #999;">No ${filter !== 'all' ? filter : ''} conversations</div>`;
      return;
    }

    container.innerHTML = '';
    
    filtered.forEach(conv => {
      const item = document.createElement('div');
      const isActive = this.selectedConversationId === conv.id;
      const isClosed = conv.status === 'closed';
      const isUnread = this.unreadConversations.has(conv.id);
      
      item.className = `conversation-item ${isActive ? 'active' : ''} ${isClosed ? 'closed' : ''} ${isUnread ? 'unread' : ''}`;
      
      const lastMessageTime = conv.updatedAt ? new Date(conv.updatedAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
      
      item.innerHTML = `
        <div class="conversation-visitor-name">
          ${this.escapeHtml(conv.visitorName || 'Guest')}
          <span class="conversation-status-badge">${isClosed ? '✓ Closed' : 'Active'}</span>
        </div>
        <div class="conversation-visitor-email">${this.escapeHtml(conv.visitorEmail || 'No email')}</div>
        <div class="conversation-last-message">${conv.lastMessagePreview || 'No messages yet'}</div>
        <div class="conversation-time">${lastMessageTime}</div>
      `;
      
      item.addEventListener('click', () => this.selectConversation(conv.id));
      container.appendChild(item);
    });
    
    this.updateNotificationBadge();
  }

  async selectConversation(conversationId) {
    this.selectedConversationId = conversationId;
    this.unreadConversations.delete(conversationId);
    
    // Mark all messages in this conversation as read
    try {
      const db = window.firebaseDB;
      const messagesRef = db.collection('chats').doc(conversationId).collection('messages');
      const unreadMessages = await messagesRef.where('sender', '==', 'user').where('read', '==', false).get();
      
      const batch = db.batch();
      unreadMessages.docs.forEach(doc => {
        batch.update(doc.ref, { read: true });
      });
      await batch.commit();
      console.log('Marked messages as read:', unreadMessages.docs.length);
    } catch (e) {
      console.error('Error marking messages as read:', e);
    }
    
    this.updateNotificationBadge();
    
    // Update active state
    document.querySelectorAll('.conversation-item').forEach(item => {
      item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    event.currentTarget.classList.remove('unread');

    // Load messages
    this.loadConversationMessages(conversationId);
    this.setupMessageListener(conversationId);
  }

  updateNotificationBadge() {
    // Call the main notification badge updater from admin-programs.html
    if (typeof updateNotificationBadge === 'function') {
      updateNotificationBadge();
    }
  }

  async loadConversationMessages(conversationId) {
    try {
      const db = window.firebaseDB;
      const conv = await db.collection('chats').doc(conversationId).get();
      const convData = conv.data();
      
      const messagesSnapshot = await db.collection('chats').doc(conversationId).collection('messages').orderBy('timestamp', 'asc').get();
      
      this.renderChatThread(conversationId, convData, messagesSnapshot.docs);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }

  renderChatThread(conversationId, convData, messageDocs) {
    const isClosed = convData.status === 'closed';
    const chatThread = document.getElementById('chatThread');
    
    chatThread.innerHTML = `
      <div class="chat-thread-header">
        <div class="chat-thread-info">
          <h3>${this.escapeHtml(convData.visitorName || 'Guest')}</h3>
          <p>${this.escapeHtml(convData.visitorEmail || 'No email provided')}</p>
        </div>
        <div class="chat-thread-actions">
          ${isClosed ? '<div class="conversation-status-text">✓ Conversation Closed</div>' : `<button class="close-conversation-btn" onclick="window.adminChat.closeConversation('${conversationId}')">× Close Conversation</button>`}
        </div>
      </div>

      ${isClosed ? '<div class="conversation-closed-notice">📌 This conversation has been closed. Visitors cannot send new messages.</div>' : ''}

      <div class="messages-container" id="chatMessagesContainer">
        ${messageDocs.map(doc => {
          const msg = doc.data();
          const timestamp = msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
          const isAdmin = msg.sender === 'admin';
          
          return `
            <div class="${isAdmin ? 'admin-message' : 'user-message'}">
              <div class="message-wrapper">
                <div class="message-bubble">${this.escapeHtml(msg.text)}</div>
                <div class="message-time">${timestamp}</div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="chat-reply-area ${isClosed ? 'disabled' : ''}">
        <input type="text" class="chat-reply-input" id="replyInput" placeholder="${isClosed ? 'Conversation closed' : 'Type your reply...'}" autocomplete="off" ${isClosed ? 'disabled' : ''}>
        <button class="chat-reply-btn" onclick="window.adminChat.sendReply('${conversationId}')" ${isClosed ? 'disabled' : ''}>Send</button>
      </div>
    `;

    // Setup enter key for send
    const replyInput = document.getElementById('replyInput');
    if (replyInput && !isClosed) {
      replyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendReply(conversationId);
        }
      });
      replyInput.focus();
    }

    // Scroll to bottom
    const container = document.getElementById('chatMessagesContainer');
    if (container) {
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 100);
    }
  }

  async sendReply(conversationId) {
    const input = document.getElementById('replyInput');
    const text = input.value.trim();
    
    if (!text) return;

    try {
      const db = window.firebaseDB;
      
      await db.collection('chats').doc(conversationId).collection('messages').add({
        sender: 'admin',
        text,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        read: true
      });

      await db.collection('chats').doc(conversationId).update({
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastMessagePreview: text.substring(0, 50) + (text.length > 50 ? '...' : '')
      });

      input.value = '';
      input.focus();
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply');
    }
  }

  async closeConversation(conversationId) {
    if (!confirm('Are you sure you want to close this conversation? Visitors will no longer be able to send messages.')) {
      return;
    }

    try {
      const db = window.firebaseDB;
      
      await db.collection('chats').doc(conversationId).update({
        status: 'closed',
        closedAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Reload conversations
      this.loadConversations();
      
      // Clear selection
      this.selectedConversationId = null;
      document.getElementById('chatThread').innerHTML = `
        <div class="no-conversation">
          <div>
            <p>✓ Conversation closed successfully</p>
          </div>
        </div>
      `;
    } catch (error) {
      console.error('Error closing conversation:', error);
      alert('Failed to close conversation');
    }
  }

  setupMessageListener(conversationId) {
    const db = window.firebaseDB;
    const messagesRef = db.collection('chats').doc(conversationId).collection('messages');
    
    messagesRef.orderBy('timestamp', 'asc').onSnapshot((snapshot) => {
      // Check for new unread messages from user
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added' && change.doc.data().sender === 'user') {
          if (conversationId === this.selectedConversationId) {
            // Message arrived in active conversation - play sound and reload
            this.playNotificationSound();
            this.loadConversationMessages(conversationId);
          } else {
            // Mark conversation as unread and show notification
            this.unreadConversations.add(conversationId);
            this.updateNotificationBadge();
            this.playNotificationSound();
            this.showDesktopNotification(conversationId);
            this.renderConversationsList(this.currentFilter);
          }
        }
      });

      // Reload if viewing this conversation
      if (conversationId === this.selectedConversationId) {
        this.loadConversationMessages(conversationId);
      }
    });
  }

  setupRealtimeListeners() {
    const db = window.firebaseDB;
    
    // Listen for new conversations and status changes
    db.collection('chats').onSnapshot((snapshot) => {
      this.loadConversations();
    });
  }

  playNotificationSound() {
    try {
      if (this.notificationSound) {
        this.notificationSound();
      }
    } catch (e) {
      console.log('Could not play notification sound:', e);
    }
  }

  showDesktopNotification(conversationId) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const conv = this.conversations.find(c => c.id === conversationId);
      if (conv) {
        const notification = new Notification('💬 New Chat Message', {
          body: `New message from ${conv.visitorName || 'a visitor'}`,
          icon: 'images/logo.png',
          tag: conversationId,
          badge: 'images/logo.png'
        });
        
        notification.onclick = () => {
          window.focus();
          this.selectConversation(conversationId);
        };
        
        // Auto-close notification after 5 seconds
        setTimeout(() => notification.close(), 5000);
      }
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }
}

// Initialize admin chat when admin panel loads
window.adminChat = null;

function initializeAdminChat() {
  console.log('initializeAdminChat called, firebaseDB:', !!window.firebaseDB, 'adminChat:', !!window.adminChat);
  if (!window.adminChat && window.firebaseDB) {
    console.log('Creating AdminChatInterface...');
    window.adminChat = new AdminChatInterface();
    console.log('AdminChatInterface created:', window.adminChat);
  }
}

// Initialize on page load
console.log('Document ready state:', document.readyState);
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAdminChat);
} else {
  console.log('Document already loaded, initializing immediately');
  initializeAdminChat();
}
