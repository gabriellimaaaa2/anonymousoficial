// Sistema de mensagens anônimas
class MessageSystem {
    constructor() {
        this.init();
    }

    init() {
        // Verificar se estamos na página de envio de mensagem
        const urlParams = new URLSearchParams(window.location.search);
        const username = urlParams.get('u');
        
        if (username && window.location.pathname.includes('send.html')) {
            this.loadSendPage(username);
        }

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Formulário de envio de mensagem
        const sendForm = document.getElementById('sendMessageForm');
        if (sendForm) {
            sendForm.addEventListener('submit', (e) => this.handleSendMessage(e));
        }
    }

    loadSendPage(username) {
        // Verificar se usuário existe
        const users = JSON.parse(localStorage.getItem('anonymousapp_users') || '[]');
        const targetUser = users.find(u => u.username === username);

        if (!targetUser) {
            document.body.innerHTML = `
                <div class="container">
                    <div class="error-page">
                        <h1>🚫 Usuário não encontrado</h1>
                        <p>O usuário "${username}" não existe ou foi removido.</p>
                        <button class="btn btn-primary" onclick="window.location.href='index.html'">
                            Voltar ao início
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        // Atualizar página com informações do usuário
        const usernameElement = document.getElementById('targetUsername');
        if (usernameElement) {
            usernameElement.textContent = username;
        }
    }

    handleSendMessage(e) {
        e.preventDefault();
        
        const messageContent = document.getElementById('messageContent').value.trim();
        const urlParams = new URLSearchParams(window.location.search);
        const targetUsername = urlParams.get('u');

        if (!messageContent) {
            this.showPopup('Erro', 'Por favor, digite uma mensagem!');
            return;
        }

        if (messageContent.length > 500) {
            this.showPopup('Erro', 'A mensagem deve ter no máximo 500 caracteres!');
            return;
        }

        // Buscar usuário destinatário
        const users = JSON.parse(localStorage.getItem('anonymousapp_users') || '[]');
        const targetUser = users.find(u => u.username === targetUsername);

        if (!targetUser) {
            this.showPopup('Erro', 'Usuário não encontrado!');
            return;
        }

        // Criar nova mensagem
        const newMessage = {
            id: Date.now().toString(),
            content: messageContent,
            timestamp: Date.now(),
            read: false
        };

        // Adicionar mensagem ao usuário
        if (!targetUser.messages) {
            targetUser.messages = [];
        }
        targetUser.messages.unshift(newMessage);

        // Atualizar no localStorage
        const userIndex = users.findIndex(u => u.id === targetUser.id);
        if (userIndex !== -1) {
            users[userIndex] = targetUser;
            localStorage.setItem('anonymousapp_users', JSON.stringify(users));
        }

        // Limpar formulário
        document.getElementById('messageContent').value = '';

        // Mostrar sucesso
        this.showPopup('Sucesso!', 'Mensagem enviada com sucesso!', () => {
            // Mostrar popup de incentivo após 2 segundos
            setTimeout(() => {
                this.showIncentivePopup();
            }, 2000);
        });
    }

    showIncentivePopup() {
        const incentiveHtml = `
            <div id="incentivePopup" class="popup">
                <div class="popup-content">
                    <h3>✨ Que tal criar sua conta?</h3>
                    <p>Mensagem enviada com sucesso!</p>
                    <p>Que tal criar sua própria conta para receber mensagens anônimas?</p>
                    <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                        <button class="btn btn-primary" onclick="window.location.href='register.html'">
                            Criar Conta
                        </button>
                        <button class="btn btn-secondary" onclick="closeIncentivePopup()">
                            Agora não
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', incentiveHtml);
    }

    showPopup(title, message, callback = null) {
        const popup = document.getElementById('popup');
        const popupTitle = document.getElementById('popup-title');
        const popupMessage = document.getElementById('popup-message');

        if (popup && popupTitle && popupMessage) {
            popupTitle.textContent = title;
            popupMessage.textContent = message;
            popup.classList.remove('hidden');

            if (callback) {
                popup.dataset.callback = 'true';
                window.messageCallback = callback;
            } else {
                popup.dataset.callback = 'false';
            }
        }
    }

    // Método para criar página de envio de mensagem dinamicamente
    createSendPage(username) {
        return `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Enviar Mensagem - AnonymousApp</title>
                <link rel="stylesheet" href="style.css">
            </head>
            <body>
                <div class="container">
                    <div class="send-container">
                        <div class="send-header">
                            <h1>🎭 AnonymousApp</h1>
                            <h2>Enviar Mensagem Anônima</h2>
                            <p>Para: <strong id="targetUsername">${username}</strong></p>
                        </div>

                        <form class="send-form" id="sendMessageForm">
                            <div class="form-group">
                                <label for="messageContent">Sua mensagem anônima:</label>
                                <textarea id="messageContent" name="messageContent" 
                                         placeholder="Digite sua mensagem aqui... (máximo 500 caracteres)"
                                         maxlength="500" rows="6" required></textarea>
                                <div class="char-counter">
                                    <span id="charCount">0</span>/500 caracteres
                                </div>
                            </div>

                            <div class="warning-box">
                                <p><strong>🔒 Sua identidade será mantida em sigilo!</strong></p>
                                <p>Esta mensagem será enviada de forma completamente anônima.</p>
                            </div>

                            <button type="submit" class="btn btn-primary btn-full">
                                📤 Enviar Mensagem Anônima
                            </button>

                            <div class="send-links">
                                <p><a href="index.html">← Voltar ao início</a></p>
                            </div>
                        </form>
                    </div>
                </div>

                <div id="popup" class="popup hidden">
                    <div class="popup-content">
                        <h3 id="popup-title">Notificação</h3>
                        <p id="popup-message">Mensagem</p>
                        <button class="btn btn-primary" onclick="closeMessagePopup()">OK</button>
                    </div>
                </div>

                <script src="messages.js"></script>
            </body>
            </html>
        `;
    }
}

// Funções globais para mensagens
function closeMessagePopup() {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.classList.add('hidden');
        
        if (popup.dataset.callback === 'true' && window.messageCallback) {
            setTimeout(window.messageCallback, 300);
            window.messageCallback = null;
        }
    }
}

function closeIncentivePopup() {
    const incentivePopup = document.getElementById('incentivePopup');
    if (incentivePopup) {
        incentivePopup.remove();
    }
}

// Contador de caracteres para textarea
document.addEventListener('DOMContentLoaded', function() {
    const messageContent = document.getElementById('messageContent');
    const charCount = document.getElementById('charCount');
    
    if (messageContent && charCount) {
        messageContent.addEventListener('input', function() {
            charCount.textContent = this.value.length;
            
            // Mudar cor quando próximo do limite
            if (this.value.length > 450) {
                charCount.style.color = '#ff6b6b';
            } else if (this.value.length > 400) {
                charCount.style.color = '#FFA500';
            } else {
                charCount.style.color = '#FFD700';
            }
        });
    }
});

// Inicializar sistema de mensagens
const messageSystem = new MessageSystem();
