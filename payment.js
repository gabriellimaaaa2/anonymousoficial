document.addEventListener("DOMContentLoaded", () => {
  const btnPix = document.getElementById("btn-pix");
  const btnCard = document.getElementById("btn-card");
  const statusBox = document.getElementById("status");

  // função helper para atualizar status na tela
  function setStatus(message, type = "info") {
    statusBox.innerText = message;
    statusBox.className = type; // usa CSS para colorir (info, success, error)
  }

  // 🔹 Criar pagamento Pix
  btnPix.addEventListener("click", async () => {
    try {
      setStatus("🔄 Gerando cobrança Pix...");

      const res = await fetch("http://localhost:5000/api/create-pix-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 500 }) // valor em centavos (R$10,00)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erro desconhecido");

      // Mostra QRCode e copia e cola
      setStatus("✅ Pix gerado com sucesso!", "success");
      document.getElementById("qrcode").src = data.qr_code_base64;
      document.getElementById("copia-cola").value = data.qr_code_text;

    } catch (err) {
      setStatus("❌ Erro ao gerar Pix: " + err.message, "error");
    }
  });

  // 🔹 Criar pagamento Cartão
  btnCard.addEventListener("click", async () => {
    try {
      setStatus("🔄 Processando pagamento no cartão...");

      const res = await fetch("http://localhost:5000/api/create-card-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 2000, // R$20,00
          card_number: "4111111111111111",
          card_cvv: "123",
          card_exp_month: "12",
          card_exp_year: "2026",
          holder_name: "Gabriel Lima"
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erro no cartão");

      setStatus("✅ Pagamento no cartão aprovado!", "success");
    } catch (err) {
      setStatus("❌ Erro ao pagar no cartão: " + err.message, "error");
    }
  });
});
