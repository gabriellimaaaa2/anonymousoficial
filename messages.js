// Sistema de mensagens anônimas
class MessageSystem {
    constructor() {
        this.currentMessageId = null; // ID da mensagem atual para pagamento
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
        this.loadDashboardMessages();
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
            read: false,
            pista: "Esta pessoa provavelmente te conhece do trabalho..." // exemplo
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
            setTimeout(() => {
                this.showIncentivePopup();
            }, 2000);
        });

        this.loadDashboardMessages(); // Atualiza mensagens no dashboard
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

    loadDashboardMessages() {
        const messagesContainer = document.getElementById('messagesContainer');
        if (!messagesContainer) return;

        const currentUser = JSON.parse(localStorage.getItem('anonymousapp_users') || '[]')[0]; // exemplo: pegar primeiro usuário
        if (!currentUser || !currentUser.messages) {
            messagesContainer.innerHTML = `<p>Nenhuma mensagem recebida ainda.</p>`;
            return;
        }

        messagesContainer.innerHTML = '';
        currentUser.messages.forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('message');

            const content = document.createElement('p');
            content.textContent = msg.content;
            msgDiv.appendChild(content);

            const btn = document.createElement('button');
            btn.textContent = '🔍 Ver Pista';
            btn.classList.add('btn', 'btn-primary');
            btn.addEventListener('click', () => {
                this.openPistasModal(msg.id, msg.pista);
            });
            msgDiv.appendChild(btn);

            messagesContainer.appendChild(msgDiv);
        });
    }

    openPistasModal(messageId, pistaText) {
        this.currentMessageId = messageId;
        const modal = document.getElementById('pistasModal');
        const pistaElement = document.getElementById('pistaText');
        if (modal && pistaElement) {
            pistaElement.textContent = pistaText;
            modal.classList.remove('hidden');
        }
    }

    closePistasModal() {
        const modal = document.getElementById('pistasModal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.currentMessageId = null;
    }
}

// Funções globais
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
