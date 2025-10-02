// backend/server.js
import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const BSP_API_URL = process.env.BSP_API_URL;
const CLIENT_ID = process.env.BSP_CLIENT_ID;
const CLIENT_SECRET = process.env.BSP_CLIENT_SECRET;

// rota inicial só pra testar se está online
app.get("/", (req, res) => {
  res.send("🚀 BSPay backend rodando com sucesso!");
});

// Criar pagamento PIX
app.post("/api/create-pix-payment", async (req, res) => {
  try {
    const { amount } = req.body;

    const response = await axios.post(
      `${BSP_API_URL}/payments/pix`,
      {
        amount: amount, // valor em centavos (500 = R$ 5,00)
        currency: "BRL",
        description: "Desbloqueio de pista no AnonymousApp",
      },
      {
        auth: {
          username: CLIENT_ID,
          password: CLIENT_SECRET,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Erro ao criar pagamento PIX:", err.response?.data || err.message);
    res.status(500).json({ error: "Erro ao criar pagamento PIX" });
  }
});

// Criar pagamento Cartão
app.post("/api/create-card-payment", async (req, res) => {
  try {
    const { amount, cardNumber, expMonth, expYear, cvc } = req.body;

    const response = await axios.post(
      `${BSP_API_URL}/payments/card`,
      {
        amount: amount,
        currency: "BRL",
        description: "Desbloqueio de pista no AnonymousApp",
        card: {
          number: cardNumber,
          exp_month: expMonth,
          exp_year: expYear,
          cvc: cvc,
        },
      },
      {
        auth: {
          username: CLIENT_ID,
          password: CLIENT_SECRET,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Erro ao criar pagamento Cartão:", err.response?.data || err.message);
    res.status(500).json({ error: "Erro ao criar pagamento Cartão" });
  }
});

// Ver status do pagamento
app.get("/api/payment-status/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(`${BSP_API_URL}/payments/${id}`, {
      auth: {
        username: CLIENT_ID,
        password: CLIENT_SECRET,
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error("Erro ao verificar status do pagamento:", err.response?.data || err.message);
    res.status(500).json({ error: "Erro ao verificar status do pagamento" });
  }
});

// Inicia servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
