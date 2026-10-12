// FETCH API
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("garage-list");
  const empty = document.getElementById("garage-empty");

  if (!container) return;

  fetch("data/motorcycles.json")
    .then(function (response) { return response.json(); })
    .then(function (motorcycles) {
      renderGarage(motorcycles);
    });

  // DYNAMIC GARAGE CARDS
  // DYNAMIC CONTENT
  // DYNAMIC CONTENT
  function renderGarage(motorcycles) {
    const saved = getGarage();
    container.innerHTML = "";

    const savedBikes = motorcycles.filter(function (bike) {
      return saved.includes(bike.id);
    });

    if (savedBikes.length === 0) {
      empty.classList.remove("hidden");
      return;
    }

    empty.classList.add("hidden");

    savedBikes.forEach(function (bike) {
      const card = document.createElement("article");
      card.className = "motorcycle-card";
      card.innerHTML = `
        <div class="bike-visual"><img src="${bike.image}" alt="${bike.name} motorcycle image" loading="lazy"></div>
        <div class="card-body">
          <div class="card-category">${bike.type}</div>
          <h3>${bike.name}</h3>
          <div class="card-year">${bike.modelYear || "Not specified"}</div>
          <div class="card-price">${formatPrice(bike.price)}</div>
          <div class="card-actions">
            <button class="small-btn" data-view="${bike.id}">View</button>
            <button class="small-btn" data-remove="${bike.id}">Remove</button>
          </div>
        </div>
      `;

      card.querySelector("[data-remove]").addEventListener("click", function () {
        toggleGarage(bike.id);
        renderGarage(motorcycles);
      });

      card.querySelector("[data-view]").addEventListener("click", function () {
        window.location.href = "motorcycles.html";
      });

      container.appendChild(card);
    });
  }
});
