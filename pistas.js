// Sistema de pistas para mensagens anônimas
class PistasSystem {
    constructor() {
        this.pistasDatabase = {
            // Pistas baseadas em horário
            horario: {
                manha: ['Esta pessoa provavelmente tem uma rotina matinal similar à sua', 'Alguém que acorda cedo como você'],
                tarde: ['Pessoa que te observa durante o horário de trabalho', 'Alguém do seu convívio durante a tarde'],
                noite: ['Esta pessoa pensa em você no final do dia', 'Alguém que tem tempo livre à noite para te enviar mensagens']
            },
            
            // Pistas baseadas no conteúdo
            conteudo: {
                trabalho: ['Conhece detalhes da sua vida profissional', 'Provavelmente um colega de trabalho'],
                pessoal: ['Tem acesso à sua vida pessoal', 'Alguém próximo do seu círculo íntimo'],
                elogio: ['Esta pessoa te admira genuinamente', 'Alguém que te observa com carinho'],
                critica: ['Pessoa que se preocupa com seu desenvolvimento', 'Alguém que quer te ver crescer']
            },
            
            // Pistas baseadas no tamanho da mensagem
            tamanho: {
                curta: ['Pessoa objetiva e direta', 'Alguém que não gosta de textos longos'],
                media: ['Pessoa equilibrada na comunicação', 'Alguém que pensa antes de escrever'],
                longa: ['Pessoa expressiva e detalhista', 'Alguém que gosta de se comunicar bem']
            },

            // Pistas baseadas em padrões de linguagem
            linguagem: {
                formal: ['Pessoa educada e respeitosa', 'Provavelmente alguém mais velho ou do trabalho'],
                informal: ['Alguém do seu círculo de amigos', 'Pessoa jovem ou próxima de você'],
                carinhosa: ['Esta pessoa tem sentimentos especiais por você', 'Alguém que te ama ou admira muito']
            }
        };

        this.init();
    }

    init() {
        // Sistema já inicializado via auth.js
    }

    // Gerar pista baseada na análise da mensagem
    generatePista(message) {
        const analysis = this.analyzeMessage(message);
        const pistas = [];

        // Adicionar pistas baseadas na análise
        if (analysis.horario) {
            const horariopistas = this.pistasDatabase.horario[analysis.horario];
            if (horariopistas) {
                pistas.push(...horariopistas);
            }
        }

        if (analysis.conteudo) {
            const conteudoPistas = this.pistasDatabase.conteudo[analysis.conteudo];
            if (conteudoPistas) {
                pistas.push(...conteudoPistas);
            }
        }

        if (analysis.tamanho) {
            const tamanhoPistas = this.pistasDatabase.tamanho[analysis.tamanho];
            if (tamanhoPistas) {
                pistas.push(...tamanhoPistas);
            }
        }

        if (analysis.linguagem) {
            const linguagemPistas = this.pistasDatabase.linguagem[analysis.linguagem];
            if (linguagemPistas) {
                pistas.push(...linguagemPistas);
            }
        }

        // Selecionar pista aleatória ou combinar várias
        if (pistas.length === 0) {
            return 'Esta pessoa prefere manter sua identidade bem protegida...';
        }

        // Combinar até 3 pistas diferentes
        const selectedPistas = this.getRandomElements(pistas, Math.min(3, pistas.length));
        return this.combinePistas(selectedPistas, analysis);
    }

    // Analisar mensagem para extrair padrões
    analyzeMessage(message) {
        const analysis = {};
        const content = message.content.toLowerCase();
        const timestamp = new Date(message.timestamp);
        const hour = timestamp.getHours();

        // Análise de horário
        if (hour >= 6 && hour < 12) {
            analysis.horario = 'manha';
        } else if (hour >= 12 && hour < 18) {
            analysis.horario = 'tarde';
        } else {
            analysis.horario = 'noite';
        }

        // Análise de conteúdo
        const trabalhoKeywords = ['trabalho', 'colega', 'escritório', 'projeto', 'reunião', 'chefe', 'empresa'];
        const pessoalKeywords = ['família', 'casa', 'amigo', 'relacionamento', 'amor', 'vida'];
        const elogioKeywords = ['incrível', 'maravilhoso', 'admiro', 'parabéns', 'sucesso', 'talentoso'];

        if (trabalhoKeywords.some(keyword => content.includes(keyword))) {
            analysis.conteudo = 'trabalho';
        } else if (pessoalKeywords.some(keyword => content.includes(keyword))) {
            analysis.conteudo = 'pessoal';
        } else if (elogioKeywords.some(keyword => content.includes(keyword))) {
            analysis.conteudo = 'elogio';
        }

        // Análise de tamanho
        if (content.length < 50) {
            analysis.tamanho = 'curta';
        } else if (content.length < 200) {
            analysis.tamanho = 'media';
        } else {
            analysis.tamanho = 'longa';
        }

        // Análise de linguagem
        const formalKeywords = ['senhor', 'senhora', 'por favor', 'obrigado', 'gostaria'];
        const informalKeywords = ['oi', 'opa', 'cara', 'mano', 'galera', 'rs', 'haha'];
        const carinhosaKeywords = ['querido', 'amor', 'coração', '❤️', '😘', '🥰'];

        if (formalKeywords.some(keyword => content.includes(keyword))) {
            analysis.linguagem = 'formal';
        } else if (informalKeywords.some(keyword => content.includes(keyword))) {
            analysis.linguagem = 'informal';
        } else if (carinhosaKeywords.some(keyword => content.includes(keyword))) {
            analysis.linguagem = 'carinhosa';
        }

        return analysis;
    }

    // Combinar pistas em uma narrativa coerente
    combinePistas(pistas, analysis) {
        const baseText = pistas[0] || 'Esta pessoa mantém sua identidade bem protegida';
        
        let combinedPista = baseText;

        // Adicionar contexto baseado na análise
        if (analysis.horario === 'manha') {
            combinedPista += '. O fato de ter enviado pela manhã sugere que você é uma das primeiras pessoas em que ela pensa ao acordar.';
        } else if (analysis.horario === 'tarde') {
            combinedPista += '. Enviado durante a tarde, provavelmente durante uma pausa no trabalho ou estudo.';
        } else if (analysis.horario === 'noite') {
            combinedPista += '. Enviado à noite, quando as pessoas costumam refletir sobre o dia e as pessoas importantes.';
        }

        // Adicionar detalhes sobre o conteúdo
        if (analysis.conteudo === 'trabalho') {
            combinedPista += ' A mensagem demonstra conhecimento sobre sua vida profissional.';
        } else if (analysis.conteudo === 'pessoal') {
            combinedPista += ' O conteúdo sugere intimidade e conhecimento da sua vida pessoal.';
        }

        // Adicionar observação sobre a linguagem
        if (analysis.linguagem === 'formal') {
            combinedPista += ' O tom formal indica respeito e possivelmente uma relação hierárquica.';
        } else if (analysis.linguagem === 'informal') {
            combinedPista += ' A linguagem descontraída sugere proximidade e familiaridade.';
        } else if (analysis.linguagem === 'carinhosa') {
            combinedPista += ' O tom carinhoso revela sentimentos especiais por você.';
        }

        return combinedPista;
    }

    // Selecionar elementos aleatórios de um array
    getRandomElements(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // Gerar análise detalhada para pista desbloqueada
    generateDetailedAnalysis(message) {
        const analysis = this.analyzeMessage(message);
        const timestamp = new Date(message.timestamp);
        
        return {
            horario: `Enviado ${this.formatTimeContext(timestamp)}`,
            linguagem: this.analyzeLinguisticStyle(message.content),
            contexto: this.analyzeContext(message.content),
            proximidade: this.analyzeProximity(message.content, analysis)
        };
    }

    formatTimeContext(timestamp) {
        const hour = timestamp.getHours();
        const day = timestamp.toLocaleDateString('pt-BR', { weekday: 'long' });
        
        let timeContext = '';
        if (hour >= 6 && hour < 12) {
            timeContext = `na manhã de ${day} às ${timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        } else if (hour >= 12 && hour < 18) {
            timeContext = `na tarde de ${day} às ${timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            timeContext = `na noite de ${day} às ${timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        }
        
        return timeContext;
    }

    analyzeLinguisticStyle(content) {
        const formal = content.match(/\b(senhor|senhora|por favor|obrigado|gostaria)\b/gi);
        const informal = content.match(/\b(oi|opa|cara|mano|galera|rs|haha)\b/gi);
        const emojis = content.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu);
        
        if (formal && formal.length > 0) {
            return 'Formal e respeitosa';
        } else if (informal && informal.length > 0) {
            return 'Descontraída e informal';
        } else if (emojis && emojis.length > 0) {
            return 'Expressiva com emojis';
        } else {
            return 'Neutra e equilibrada';
        }
    }

    analyzeContext(content) {
        const trabalho = content.match(/\b(trabalho|colega|escritório|projeto|reunião|chefe|empresa)\b/gi);
        const estudo = content.match(/\b(escola|faculdade|universidade|prova|aula|professor)\b/gi);
        const social = content.match(/\b(festa|encontro|amigos|saída|diversão)\b/gi);
        
        if (trabalho && trabalho.length > 0) {
            return 'Conhece sua rotina profissional';
        } else if (estudo && estudo.length > 0) {
            return 'Relacionado aos seus estudos';
        } else if (social && social.length > 0) {
            return 'Parte do seu círculo social';
        } else {
            return 'Observa você em diferentes contextos';
        }
    }

    analyzeProximity(content, analysis) {
        const intimate = content.match(/\b(querido|amor|coração|saudade|especial)\b/gi);
        const friendly = content.match(/\b(amigo|parceiro|companheiro|legal|bacana)\b/gi);
        
        if (intimate && intimate.length > 0) {
            return 'Pessoa muito próxima e íntima';
        } else if (friendly && friendly.length > 0) {
            return 'Amigo ou conhecido próximo';
        } else if (analysis.linguagem === 'formal') {
            return 'Pessoa do convívio profissional';
        } else {
            return 'Pessoa do convívio diário';
        }
    }
}

// Inicializar sistema de pistas
const pistasSystem = new PistasSystem();

// Função global para abrir modal de pistas (chamada pelo auth.js)
window.openPistas = function(messageId) {
    const currentUser = JSON.parse(localStorage.getItem('anonymousapp_current_user') || 'null');
    if (!currentUser) return;

    const message = currentUser.messages.find(m => m.id === messageId);
    if (!message) return;

    // Gerar pista baseada na mensagem
    const pista = pistasSystem.generatePista(message);
    
    const pistaElement = document.getElementById('pistaText');
    if (pistaElement) {
        pistaElement.textContent = pista;
    }

    const modal = document.getElementById('pistasModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
};
