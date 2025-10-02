// Sistema de autenticação simples usando localStorage
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('anonymousapp_users') || '[]');
        this.currentUser = JSON.parse(localStorage.getItem('anonymousapp_current_user') || 'null');
        this.init();
    }

    init() {
        // Verificar se está logado e redirecionar se necessário
        if (window.location.pathname.includes('dashboard.html') && !this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        // Configurar eventos dos formulários
        this.setupEventListeners();
        
        // Carregar dados do usuário no dashboard
        if (window.location.pathname.includes('dashboard.html') && this.currentUser) {
            this.loadDashboard();
        }
    }

    setupEventListeners() {
        // Formulário de registro
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Formulário de login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }

    handleRegister(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validações
        if (!username || !email || !password) {
            this.showPopup('Erro', 'Todos os campos são obrigatórios!');
            return;
        }

        if (password.length < 6) {
            this.showPopup('Erro', 'A senha deve ter pelo menos 6 caracteres!');
            return;
        }

        if (password !== confirmPassword) {
            this.showPopup('Erro', 'As senhas não coincidem!');
            return;
        }

        // Verificar se usuário já existe
        if (this.users.find(u => u.username === username || u.email === email)) {
            this.showPopup('Erro', 'Usuário ou email já existe!');
            return;
        }

        // Criar novo usuário
        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password: this.hashPassword(password),
            createdAt: new Date().toISOString(),
            messages: []
        };

        this.users.push(newUser);
        localStorage.setItem('anonymousapp_users', JSON.stringify(this.users));

        this.showPopup('Sucesso!', 'Conta criada com sucesso! Redirecionando para login...', () => {
            window.location.href = 'login.html';
        });
    }

    handleLogin(e) {
        e.preventDefault();
        
        const loginUsername = document.getElementById('loginUsername').value.trim();
        const loginPassword = document.getElementById('loginPassword').value;

        if (!loginUsername || !loginPassword) {
            this.showPopup('Erro', 'Todos os campos são obrigatórios!');
            return;
        }

        // Buscar usuário
        const user = this.users.find(u => 
            (u.username === loginUsername || u.email === loginUsername) && 
            u.password === this.hashPassword(loginPassword)
        );

        if (!user) {
            this.showPopup('Erro', 'Usuário ou senha incorretos!');
            return;
        }

        // Fazer login
        this.currentUser = user;
        localStorage.setItem('anonymousapp_current_user', JSON.stringify(user));

        this.showPopup('Sucesso!', 'Login realizado com sucesso! Redirecionando...', () => {
            window.location.href = 'dashboard.html';
        });
    }

    loadDashboard() {
        if (!this.currentUser) return;

        // Atualizar nome do usuário
        const usernameElement = document.getElementById('username');
        if (usernameElement) {
            usernameElement.textContent = this.currentUser.username;
        }

        // Atualizar link personalizado
        const personalLink = document.getElementById('personalLink');
        if (personalLink) {
            const baseUrl = window.location.origin + window.location.pathname.replace('dashboard.html', '');
            personalLink.value = `${baseUrl}send.html?u=${this.currentUser.username}`;
        }

        // Mostrar seção admin se for o usuário correto
        if (this.currentUser.username === 'admin' || this.currentUser.email === 'admin@anonymousapp.com') {
            const adminSection = document.getElementById('adminSection');
            if (adminSection) {
                adminSection.style.display = 'block';
            }
        }

        // Carregar mensagens
        this.loadMessages();
    }

    loadMessages() {
        const messagesContainer = document.getElementById('messagesContainer');
        if (!messagesContainer || !this.currentUser) return;

        const messages = this.currentUser.messages || [];
        
        if (messages.length === 0) {
            messagesContainer.innerHTML = `
                <div class="message-card">
                    <div class="message-content">
                        <p>📭 Nenhuma mensagem ainda!</p>
                        <p>Compartilhe seu link para começar a receber mensagens anônimas.</p>
                    </div>
                </div>
            `;
            return;
        }

        messagesContainer.innerHTML = messages.map((message, index) => `
            <div class="message-card" style="animation-delay: ${index * 0.1}s">
                <div class="message-header">
                    <span class="message-time">${this.formatDate(message.timestamp)}</span>
                </div>
                <div class="message-content">
                    <p>${this.escapeHtml(message.content)}</p>
                </div>
                <div class="message-actions">
                    <button class="btn btn-secondary" onclick="auth.openPistas('${message.id}')">
                        🔍 Ver Pista - R$ 2,99
                    </button>
                    <button class="btn btn-outline" onclick="auth.deleteMessage('${message.id}')">
                        🗑️ Excluir
                    </button>
                </div>
            </div>
        `).join('');
    }

    openPistas(messageId) {
        const message = this.currentUser.messages.find(m => m.id === messageId);
        if (!message) return;

        // Simular pista baseada na mensagem
        const pistas = [
            'Esta pessoa provavelmente te conhece do trabalho...',
            'Alguém que você vê frequentemente nas redes sociais...',
            'Uma pessoa do seu círculo de amigos próximos...',
            'Alguém que conhece detalhes da sua rotina...',
            'Provavelmente alguém da sua família ou parentes...'
        ];

        const pistaText = pistas[Math.floor(Math.random() * pistas.length)];
        
        const pistaElement = document.getElementById('pistaText');
        if (pistaElement) {
            pistaElement.textContent = pistaText;
        }

        const modal = document.getElementById('pistasModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    deleteMessage(messageId) {
        if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return;

        this.currentUser.messages = this.currentUser.messages.filter(m => m.id !== messageId);
        
        // Atualizar no localStorage
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = this.currentUser;
            localStorage.setItem('anonymousapp_users', JSON.stringify(this.users));
            localStorage.setItem('anonymousapp_current_user', JSON.stringify(this.currentUser));
        }

        this.loadMessages();
        this.showPopup('Sucesso!', 'Mensagem excluída com sucesso!');
    }

    hashPassword(password) {
        // Hash simples para demonstração - em produção usar bcrypt ou similar
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showPopup(title, message, callback = null) {
        const popup = document.getElementById('popup');
        const popupTitle = document.getElementById('popup-title');
        const popupMessage = document.getElementById('popup-message');

        if (popup && popupTitle && popupMessage) {
            popupTitle.textContent = title;
            popupMessage.textContent = message;
            popup.classList.remove('hidden');

            // Armazenar callback para usar no closePopup
            if (callback) {
                popup.dataset.callback = 'true';
                window.popupCallback = callback;
            } else {
                popup.dataset.callback = 'false';
            }
        }
    }

    logout() {
        localStorage.removeItem('anonymousapp_current_user');
        window.location.href = 'index.html';
    }
}

// Funções globais
function closePopup() {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.classList.add('hidden');
        
        // Executar callback se existir
        if (popup.dataset.callback === 'true' && window.popupCallback) {
            setTimeout(window.popupCallback, 300);
            window.popupCallback = null;
        }
    }
}

function closePistasModal() {
    const modal = document.getElementById('pistasModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function copyLink() {
    const linkInput = document.getElementById('personalLink');
    if (linkInput) {
        linkInput.select();
        document.execCommand('copy');
        auth.showPopup('Sucesso!', 'Link copiado para a área de transferência!');
    }
}

function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        auth.logout();
    }
}

function testBSPay() {
    auth.showPopup('BSPay', 'Configuração BSPay carregada com sucesso!');
}

// Inicializar sistema de autenticação
const auth = new AuthSystem();

// Criar usuários de exemplo para demonstração
function createExampleUsers() {
    const existingUsers = JSON.parse(localStorage.getItem('anonymousapp_users') || '[]');
    
    // Verificar se já existem usuários de exemplo
    if (existingUsers.length === 0) {
        const exampleUsers = [
            {
                id: 'user1',
                username: 'joao',
                email: 'joao@example.com',
                password: auth.hashPassword('123456'),
                createdAt: new Date().toISOString(),
                messages: [
                    {
                        id: 'msg1',
                        content: 'João, você é um cara muito legal! Admiro sua personalidade.',
                        timestamp: Date.now() - 86400000
                    },
                    {
                        id: 'msg2',
                        content: 'Parabéns pelo seu trabalho incrível! Você inspira muita gente.',
                        timestamp: Date.now() - 172800000
                    }
                ]
            },
            {
                id: 'user2',
                username: 'marcos',
                email: 'marcos@example.com',
                password: auth.hashPassword('123456'),
                createdAt: new Date().toISOString(),
                messages: [
                    {
                        id: 'msg3',
                        content: 'Marcos, seu senso de humor é fantástico! Sempre me faz rir.',
                        timestamp: Date.now() - 259200000
                    }
                ]
            },
            {
                id: 'user3',
                username: 'felipe',
                email: 'felipe@example.com',
                password: auth.hashPassword('123456'),
                createdAt: new Date().toISOString(),
                messages: [
                    {
                        id: 'msg4',
                        content: 'Felipe, você é uma pessoa muito especial! Continue sendo assim.',
                        timestamp: Date.now() - 345600000
                    },
                    {
                        id: 'msg5',
                        content: 'Admiro muito sua dedicação e esforço em tudo que faz!',
                        timestamp: Date.now() - 432000000
                    }
                ]
            }
        ];

        localStorage.setItem('anonymousapp_users', JSON.stringify(exampleUsers));
    }
}

// Criar usuários de exemplo ao carregar a página
createExampleUsers();
