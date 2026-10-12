// MOTORCYCLE DATA
let motorcycles = [];

document.addEventListener("DOMContentLoaded", function () {
  loadMotorcycles();
});

// FETCH API
function loadMotorcycles() {
  fetch("data/motorcycles.json")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Could not load motorcycle data.");
      }
      return response.json();
    })
    .then(function (data) {
      motorcycles = data;
      renderFilters();
      cleanCompareSelection(motorcycles);
      renderMotorcycles(motorcycles);
      updateCompareTray(motorcycles);

      const requestedId = new URLSearchParams(window.location.search).get("id");
      if (requestedId) {
        const requestedBike = motorcycles.find(function (bike) {
          return bike.id === requestedId;
        });
        if (requestedBike) openDetails(requestedBike);
      }
    })
    .catch(function () {
      document.getElementById("motorcycle-list").innerHTML =
        '<div class="empty-state" style="grid-column:1/-1"><strong>Motorcycle data could not be loaded.</strong><br>Open the project using a local server such as VS Code Live Server so Fetch API can read the JSON file.</div>';
    });
}

// CATEGORY FILTERS
function renderFilters() {
  const categories = ["All", ...new Set(motorcycles.map(function (bike) { return bike.type; }))];
  const container = document.getElementById("category-filters");

  categories.forEach(function (category, index) {
    const button = document.createElement("button");
    button.className = "filter-btn" + (index === 0 ? " active" : "");
    button.textContent = category;
    button.addEventListener("click", function () {
      document.querySelectorAll(".filter-btn").forEach(function (item) {
        item.classList.remove("active");
      });
      button.classList.add("active");
      filterMotorcycles();
    });
    container.appendChild(button);
  });
}

// SEARCH AND FILTER
// SEARCH AND FILTER
function filterMotorcycles() {
  const search = document.getElementById("search-input").value.toLowerCase();
  const active = document.querySelector(".filter-btn.active").textContent;

  const filtered = motorcycles.filter(function (bike) {
    const matchesSearch =
      bike.name.toLowerCase().includes(search) ||
      bike.type.toLowerCase().includes(search);

    const matchesCategory =
      active === "All" || bike.type === active;

    return matchesSearch && matchesCategory;
  });

  renderMotorcycles(filtered);
}

// DYNAMIC CONTENT
function renderMotorcycles(list) {
  const container = document.getElementById("motorcycle-list");
  const empty = document.getElementById("empty-results");
  container.innerHTML = "";

  if (list.length === 0) {
    empty.classList.remove("hidden");
    return;
  }

  empty.classList.add("hidden");

  list.forEach(function (bike) {
    const saved = isSaved(bike.id);
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
          <button class="small-btn heart-btn ${saved ? "saved" : ""}" data-save="${bike.id}" aria-label="Add to Garage">${saved ? "♥" : "♡"}</button>
          <button class="small-btn" data-details="${bike.id}">View Details</button>
          ${compareButtonMarkup(bike.id)}
        </div>
      </div>
    `;

    card.querySelector("[data-save]").addEventListener("click", function () {
      toggleGarage(bike.id);
      renderMotorcycles(list);
    });

    card.querySelector("[data-details]").addEventListener("click", function () { openDetails(bike); });
    card.querySelector("[data-compare]").addEventListener("click", function () {
      const result = toggleCompare(bike.id);
      if (result.limit) alert(result.message);
      renderMotorcycles(list); updateCompareTray(motorcycles);
    });

    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const search = document.getElementById("search-input");
  if (search) {
    search.addEventListener("input", filterMotorcycles);
  }
});


// LOCAL STORAGE: COMPARE
function cleanCompareSelection(list) {
  const valid = getCompareSelection().filter(function (id, index, arr) {
    return list.some(function (bike) { return bike.id === id; }) && arr.indexOf(id) === index;
  }).slice(0, 2);
  saveCompareSelection(valid);
}
function updateCompareTray(list) {
  const tray = document.getElementById("compare-tray"); if (!tray) return;
  const selected = getCompareSelection();
  const count = document.getElementById("compare-count");
  const hint = document.getElementById("compare-hint");
  const now = document.getElementById("compare-now");
  if (count) count.textContent = `Compare (${selected.length}/2)`;
  if (hint) hint.textContent = selected.length === 0 ? "Select two motorcycles to compare specifications." : selected.map(function(id){ const bike=list.find(function(b){return b.id===id;}); return bike ? bike.name : id; }).join(" + ") + (selected.length < 2 ? " — choose one more motorcycle." : " — ready to compare.");
  if (now) { now.classList.toggle("disabled-link", selected.length !== 2); now.setAttribute("aria-disabled", selected.length !== 2 ? "true" : "false"); }
  const clear = document.getElementById("clear-compare");
  if (clear && !clear.dataset.bound) { clear.dataset.bound="true"; clear.addEventListener("click",function(){saveCompareSelection([]);renderMotorcycles(motorcycles);updateCompareTray(motorcycles);}); }
}
document.addEventListener("ridelineCompareChanged", function () {
  if (motorcycles.length) { renderMotorcycles(motorcycles); updateCompareTray(motorcycles); }
});
