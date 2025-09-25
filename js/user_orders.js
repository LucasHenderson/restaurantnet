// --- Dropdown Usuário ---
const userMenu = document.querySelector(".user-menu");
const userIcon = document.querySelector(".user-icon");
userIcon.addEventListener("click", () => {
  userMenu.classList.toggle("active");
});

// --- Mock de pedidos (simulação) ---
const pedidos = {
  proprio: [
    { id: 1, itens: [{ nome: "Pizza Marguerita", qtd: 3, preco: 48 }], endereco: "Rua das Flores, 123", total: 144, data: new Date("2025-09-21T19:30:00"), confirmado: false, cancelado: false },
    { id: 2, itens: [{ nome: "Lasanha", qtd: 2, preco: 35 }], endereco: "Rua A", total: 70, data: new Date("2025-09-22T12:00:00"), confirmado: true, cancelado: false },
    { id: 3, itens: [{ nome: "Hambúrguer", qtd: 1, preco: 25 }], endereco: "Rua B", total: 25, data: new Date("2025-09-23T13:00:00"), confirmado: false, cancelado: false },
  ],
  parceiro: [
    { id: 4, itens: [{ nome: "Filé ao Molho Madeira", qtd: 2, preco: 38.4 }], endereco: "Av. Central, 456", total: 76.8, data: new Date("2025-09-21T18:00:00"), confirmado: true, cancelado: false },
    { id: 5, itens: [{ nome: "Strogonoff", qtd: 1, preco: 30 }], endereco: "Av. X", total: 30, data: new Date("2025-09-22T19:00:00"), confirmado: false, cancelado: false },
  ],
  reservas: [
    { id: 6, itens: [{ nome: "Pizza Calabresa", qtd: 1, preco: 35 }], endereco: "Presencial", total: 45, horario: "20:00", data: new Date("2025-09-22T20:00:00"), confirmado: false, cancelado: false },
    { id: 7, itens: [{ nome: "Risoto de Camarão", qtd: 1, preco: 55 }], endereco: "Presencial", total: 65, horario: "21:00", data: new Date("2025-09-23T21:00:00"), confirmado: true, cancelado: false },
  ]
};

// --- Controle de página por lista ---
const state = { proprio: 1, parceiro: 1, reservas: 1 };
const itemsPerPage = 3;

// --- Renderização geral ---
function renderPedidos() {
  renderLista("delivery-proprio", pedidos.proprio, "pagination-proprio", state.proprio, document.getElementById("filter-proprio").value);
  renderLista("delivery-parceiro", pedidos.parceiro, "pagination-parceiro", state.parceiro, document.getElementById("filter-parceiro").value);
  renderLista("reservas", pedidos.reservas, "pagination-reservas", state.reservas, document.getElementById("filter-reservas").value, true);
}

function renderLista(containerId, lista, paginationId, currentPage, filterDate, isReserva = false) {
  const container = document.getElementById(containerId);
  const paginationContainer = document.getElementById(paginationId);
  container.innerHTML = "";
  paginationContainer.innerHTML = "";

  // Filtrar por data
  let filtrada = lista;
  if (filterDate) {
    filtrada = lista.filter(p => p.data.toISOString().split("T")[0] === filterDate);
  }

  // Paginação
  const totalPages = Math.ceil(filtrada.length / itemsPerPage);
  if (currentPage > totalPages) currentPage = totalPages || 1;
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = filtrada.slice(start, end);

  // Render itens
  pageItems.forEach(pedido => {
    const li = document.createElement("li");
    li.classList.add("order-item");

    let itensHTML = pedido.itens.map(i => `${i.nome} (${i.qtd}): R$${i.preco.toFixed(2)} un`).join(", ");

    // Status do pedido
    let statusText = "⏳ Aguardando Confirmação";
    if (pedido.confirmado) statusText = "✅ Confirmado";
    else if (pedido.cancelado) statusText = "❌ Cancelado";

    li.innerHTML = `
      <div class="order-header">${itensHTML}</div>
      <div class="order-details">Endereço: ${pedido.endereco}</div>
      <div class="order-details">Total: R$${pedido.total.toFixed(2)}</div>
      <div class="order-details">Data: ${pedido.data.toLocaleDateString()} - ${pedido.data.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
      ${isReserva ? `<div class="order-details">Horário Reserva: ${pedido.horario}</div>` : ""}
      <div class="order-status">Status: ${statusText}</div>
    `;

    if (!pedido.confirmado && !pedido.cancelado) {
      const cancelBtn = document.createElement("button");
      cancelBtn.classList.add("cancel-btn");
      cancelBtn.textContent = "Cancelar";
      cancelBtn.addEventListener("click", () => {
        pedido.cancelado = true;
        renderPedidos();
      });
      li.appendChild(cancelBtn);
    }

    container.appendChild(li);
  });

  // Render paginação
  if (totalPages > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "Anterior";
    prevBtn.disabled = currentPage === 1;
    prevBtn.addEventListener("click", () => {
      state[getKeyFromId(containerId)]--;
      renderPedidos();
    });

    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Próximo";
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.addEventListener("click", () => {
      state[getKeyFromId(containerId)]++;
      renderPedidos();
    });

    paginationContainer.appendChild(prevBtn);
    paginationContainer.appendChild(nextBtn);
  }
}

// --- Helpers ---
function getKeyFromId(id) {
  if (id === "delivery-proprio") return "proprio";
  if (id === "delivery-parceiro") return "parceiro";
  if (id === "reservas") return "reservas";
}

// --- Eventos de filtro ---
document.getElementById("filter-proprio").addEventListener("change", () => {
  state.proprio = 1;
  renderPedidos();
});
document.getElementById("filter-parceiro").addEventListener("change", () => {
  state.parceiro = 1;
  renderPedidos();
});
document.getElementById("filter-reservas").addEventListener("change", () => {
  state.reservas = 1;
  renderPedidos();
});

// --- Inicializar ---
renderPedidos();
