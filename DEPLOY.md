# 🚀 Como Fazer Deploy do AnonymousApp

## GitHub Pages (Recomendado)

1. **Criar repositório no GitHub:**
   - Vá para github.com e crie um novo repositório
   - Nome sugerido: `anonymousapp` ou `mensagens-anonimas`
   - Marque como público

2. **Upload dos arquivos:**
   - Faça upload de todos os arquivos da pasta AnonymousApp
   - Ou use git clone e push:
   ```bash
   git clone https://github.com/seuusuario/anonymousapp.git
   cd anonymousapp
   # Copie todos os arquivos para esta pasta
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Ativar GitHub Pages:**
   - Vá em Settings > Pages
   - Source: Deploy from a branch
   - Branch: main / (root)
   - Clique em Save

4. **Acessar o site:**
   - URL será: `https://seuusuario.github.io/anonymousapp`

## Vercel (Alternativa)

1. **Acesse vercel.com**
2. **Conecte com GitHub**
3. **Import Project**
4. **Selecione seu repositório**
5. **Deploy automático**

## Netlify (Alternativa)

1. **Acesse netlify.com**
2. **Drag & Drop** a pasta do projeto
3. **Deploy automático**

## ✅ Teste Local

Antes de fazer deploy, teste localmente:

```bash
# Navegue até a pasta do projeto
cd AnonymousApp

# Inicie um servidor local
python -m http.server 8000
# ou
npx serve .

# Acesse: http://localhost:8000
```

## 🧪 Como Testar

1. **Acesse a landing page**
2. **Crie uma conta** (ex: usuario: `teste`, senha: `123456`)
3. **Faça login**
4. **Copie seu link personalizado**
5. **Abra em nova aba anônima**
6. **Envie uma mensagem**
7. **Volte ao dashboard** e veja a mensagem

## 👥 Usuários de Exemplo

O projeto já vem com 3 usuários de exemplo:

- **Usuário:** `joao` | **Senha:** `123456`
- **Usuário:** `marcos` | **Senha:** `123456`  
- **Usuário:** `felipe` | **Senha:** `123456`

Cada um já tem mensagens de exemplo para demonstração.

## 🔗 Como Funciona o Link

Quando você compartilhar o link personalizado:
- Formato: `https://seusite.com/send.html?u=nomedousuario`
- A pessoa clica e vai direto para enviar mensagem
- A mensagem chega na conta do usuário especificado

## 📱 Exemplo de Uso

1. Felipe cria conta e pega o link: `send.html?u=felipe`
2. Felipe compartilha o link
3. Alguém clica e vê: "Enviar Mensagem Anônima para Felipe"
4. Pessoa envia mensagem
5. Mensagem aparece no dashboard do Felipe

## ⚠️ Importante

- Todos os dados ficam no navegador (localStorage)
- Não há backend real - é só demonstração
- Para produção real, seria necessário um backend
- Os pagamentos BSPay são simulados
