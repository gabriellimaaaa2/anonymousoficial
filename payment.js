// Sistema de pagamentos BSPay
class PaymentSystem {
    constructor() {
        this.bspayConfig = {
            clientId: 'Gabriellima02_8489541538893349',
            clientSecret: '3e6dbd4930f68f1e3d2b434017419ab49ee4a8aff0ecc24777459d8c91549144',
            apiUrl: 'https://api.bspay.com.br/v1' // URL fictícia para demonstração
        };
        this.init();
    }

    init() {
        // Configurar eventos de pagamento
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Eventos já são configurados via onclick nos botões HTML
    }

    async payWithPix() {
        try {
            this.showLoadingPopup('Gerando PIX...');
            
            // Simular chamada para API do BSPay
            const paymentData = {
                amount: 2.99,
                description: 'Desbloqueio de pista - AnonymousApp',
                paymentMethod: 'pix'
            };

            // Simular delay da API
            await this.delay(2000);

            // Simular resposta da API
            const pixResponse = {
                success: true,
                pixCode: '00020126580014BR.GOV.BCB.PIX013636c1c3c0-3e4e-4f8a-9c2a-1234567890ab5204000053039865802BR5925ANONYMOUS APP LTDA6009SAO PAULO62070503***6304A1B2',
                qrCodeUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
                expiresIn: 300 // 5 minutos
            };

            this.showPixPayment(pixResponse);

        } catch (error) {
            console.error('Erro no pagamento PIX:', error);
            this.showPopup('Erro', 'Erro ao gerar PIX. Tente novamente.');
        }
    }

    async payWithCard() {
        try {
            this.showLoadingPopup('Processando pagamento...');
            
            // Simular processamento do cartão
            await this.delay(3000);
            
            // Simular sucesso do pagamento
            const success = Math.random() > 0.2; // 80% de chance de sucesso
            
            if (success) {
                this.showPopup('Pagamento Aprovado!', 'Pista desbloqueada com sucesso!', () => {
                    this.unlockPista();
                });
            } else {
                this.showPopup('Pagamento Recusado', 'Cartão recusado. Verifique os dados ou tente outro cartão.');
            }

        } catch (error) {
            console.error('Erro no pagamento com cartão:', error);
            this.showPopup('Erro', 'Erro no processamento. Tente novamente.');
        }
    }

    showPixPayment(pixData) {
        const pixModal = `
            <div id="pixModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>💳 Pagamento PIX - R$ 2,99</h3>
                        <button class="close-btn" onclick="closePixModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="pix-payment">
                            <div class="qr-code">
                                <img src="${pixData.qrCodeUrl}" alt="QR Code PIX" style="width: 200px; height: 200px; background: #fff; padding: 20px; border-radius: 10px;">
                            </div>
                            
                            <div class="pix-code">
                                <label>Código PIX (Copia e Cola):</label>
                                <textarea readonly onclick="this.select()" style="width: 100%; height: 80px; font-size: 0.8rem; padding: 10px; border-radius: 5px; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid #FFD700;">${pixData.pixCode}</textarea>
                                <button class="btn btn-secondary" onclick="copyPixCode('${pixData.pixCode}')">📋 Copiar Código</button>
                            </div>

                            <div class="pix-timer">
                                <p>⏰ Expira em: <span id="pixTimer">05:00</span></p>
                            </div>

                            <div class="pix-instructions">
                                <h4>Como pagar:</h4>
                                <ol>
                                    <li>Abra o app do seu banco</li>
                                    <li>Escolha PIX</li>
                                    <li>Escaneie o QR Code ou cole o código</li>
                                    <li>Confirme o pagamento</li>
                                </ol>
                            </div>

                            <button class="btn btn-primary" onclick="checkPixPayment()">
                                ✅ Já paguei - Verificar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', pixModal);
        this.startPixTimer(300); // 5 minutos
    }

    startPixTimer(seconds) {
        const timerElement = document.getElementById('pixTimer');
        if (!timerElement) return;

        const timer = setInterval(() => {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
            
            if (seconds <= 0) {
                clearInterval(timer);
                timerElement.textContent = 'EXPIRADO';
                timerElement.style.color = '#ff6b6b';
            }
            
            seconds--;
        }, 1000);
    }

    async checkPixPayment() {
        this.showLoadingPopup('Verificando pagamento...');
        
        // Simular verificação do pagamento
        await this.delay(2000);
        
        // Simular sucesso (80% de chance)
        const paid = Math.random() > 0.2;
        
        if (paid) {
            this.closePixModal();
            this.showPopup('Pagamento Confirmado!', 'Pista desbloqueada com sucesso!', () => {
                this.unlockPista();
            });
        } else {
            this.showPopup('Pagamento Pendente', 'Pagamento ainda não identificado. Aguarde alguns instantes e tente novamente.');
        }
    }

    unlockPista() {
        // Fechar modal de pistas e mostrar a pista desbloqueada
        const pistasModal = document.getElementById('pistasModal');
        if (pistasModal) {
            pistasModal.classList.add('hidden');
        }

        // Mostrar pista desbloqueada
        const unlockedPistaModal = `
            <div id="unlockedPistaModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>🔓 Pista Desbloqueada</h3>
                        <button class="close-btn" onclick="closeUnlockedPistaModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="unlocked-pista">
                            <div class="pista-content">
                                <p id="unlockedPistaText">Esta pessoa provavelmente te conhece do trabalho e tem acesso às suas redes sociais. Baseado no horário de envio (tarde), pode ser um colega próximo que te observa durante o expediente.</p>
                            </div>
                            
                            <div class="pista-details">
                                <h4>📊 Análise Detalhada:</h4>
                                <ul>
                                    <li><strong>Horário:</strong> Enviado durante horário comercial</li>
                                    <li><strong>Linguagem:</strong> Formal e respeitosa</li>
                                    <li><strong>Contexto:</strong> Conhece sua rotina profissional</li>
                                    <li><strong>Proximidade:</strong> Pessoa do convívio diário</li>
                                </ul>
                            </div>

                            <div class="disclaimer">
                                <p><strong>⚠️ Disclaimer:</strong> Esta análise é baseada em padrões de comportamento e pode não ser 100% precisa. Use como referência, não como certeza absoluta.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', unlockedPistaModal);
    }

    showLoadingPopup(message) {
        const loadingPopup = `
            <div id="loadingPopup" class="popup">
                <div class="popup-content">
                    <div class="loading-spinner" style="width: 40px; height: 40px; border: 4px solid #333; border-top: 4px solid #FFD700; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                    <h3>Processando...</h3>
                    <p>${message}</p>
                </div>
            </div>
        `;

        // Remover popup de loading anterior se existir
        const existingLoading = document.getElementById('loadingPopup');
        if (existingLoading) {
            existingLoading.remove();
        }

        document.body.insertAdjacentHTML('beforeend', loadingPopup);
    }

    closeLoadingPopup() {
        const loadingPopup = document.getElementById('loadingPopup');
        if (loadingPopup) {
            loadingPopup.remove();
        }
    }

    showPopup(title, message, callback = null) {
        this.closeLoadingPopup();
        
        const popup = document.getElementById('popup');
        const popupTitle = document.getElementById('popup-title');
        const popupMessage = document.getElementById('popup-message');

        if (popup && popupTitle && popupMessage) {
            popupTitle.textContent = title;
            popupMessage.textContent = message;
            popup.classList.remove('hidden');

            if (callback) {
                popup.dataset.callback = 'true';
                window.paymentCallback = callback;
            } else {
                popup.dataset.callback = 'false';
            }
        }
    }

    closePixModal() {
        const pixModal = document.getElementById('pixModal');
        if (pixModal) {
            pixModal.remove();
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Funções globais para pagamentos
function payWithPix() {
    paymentSystem.payWithPix();
}

function payWithCard() {
    // Mostrar formulário de cartão (simplificado para demonstração)
    const cardForm = `
        <div id="cardModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>💳 Pagamento com Cartão - R$ 2,99</h3>
                    <button class="close-btn" onclick="closeCardModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="cardForm" onsubmit="processCardPayment(event)">
                        <div class="form-group">
                            <label>Número do Cartão:</label>
                            <input type="text" placeholder="0000 0000 0000 0000" maxlength="19" required>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <div class="form-group" style="flex: 1;">
                                <label>Validade:</label>
                                <input type="text" placeholder="MM/AA" maxlength="5" required>
                            </div>
                            <div class="form-group" style="flex: 1;">
                                <label>CVV:</label>
                                <input type="text" placeholder="000" maxlength="3" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Nome no Cartão:</label>
                            <input type="text" placeholder="NOME COMPLETO" required>
                        </div>
                        <button type="submit" class="btn btn-primary btn-full">
                            💳 Pagar R$ 2,99
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', cardForm);
}

function processCardPayment(event) {
    event.preventDefault();
    closeCardModal();
    paymentSystem.payWithCard();
}

function closeCardModal() {
    const cardModal = document.getElementById('cardModal');
    if (cardModal) {
        cardModal.remove();
    }
}

function closePixModal() {
    paymentSystem.closePixModal();
}

function copyPixCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        paymentSystem.showPopup('Sucesso!', 'Código PIX copiado para a área de transferência!');
    });
}

function checkPixPayment() {
    paymentSystem.checkPixPayment();
}

function closeUnlockedPistaModal() {
    const modal = document.getElementById('unlockedPistaModal');
    if (modal) {
        modal.remove();
    }
}

// Fechar popup com callback de pagamento
function closePopup() {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.classList.add('hidden');
        
        if (popup.dataset.callback === 'true' && window.paymentCallback) {
            setTimeout(window.paymentCallback, 300);
            window.paymentCallback = null;
        }
    }
}

// Inicializar sistema de pagamentos
const paymentSystem = new PaymentSystem();
