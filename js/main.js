// PAGE INITIALIZATION
document.addEventListener("DOMContentLoaded", function () {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  updateGarageCount();
  updateCompareCount();
  loadFeaturedMotorcycles();
});

// LOCAL STORAGE
function getGarage() {
  return JSON.parse(localStorage.getItem("ridelineGarage")) || [];
}

function saveGarage(garage) {
  localStorage.setItem("ridelineGarage", JSON.stringify(garage));
  updateGarageCount();
}

// GARAGE COUNT
function updateGarageCount() {
  const count = getGarage().length;
  document.querySelectorAll(".garage-count").forEach(function (element) {
    element.textContent = count;
  });
}

function isSaved(id) {
  return getGarage().includes(id);
}

function toggleGarage(id) {
  const garage = getGarage();

  if (garage.includes(id)) {
    const updated = garage.filter(function (item) {
      return item !== id;
    });
    saveGarage(updated);
    return false;
  }

  garage.push(id);
  saveGarage(garage);
  return true;
}

function formatPrice(price) {
  if (typeof price === "number" && Number.isFinite(price)) return "₱" + price.toLocaleString("en-PH");
  if (typeof price === "string" && price.trim() !== "") return price;
  return "₱299,000";
}

// FETCH API
function loadFeaturedMotorcycles() {
  const container = document.getElementById("featured-list");
  if (!container) return;

  container.innerHTML = "";
  fetch("data/motorcycles.json")
    .then(function (response) {
      if (!response.ok) throw new Error("Could not load data.");
      return response.json();
    })
    .then(function (motorcycles) {
      const featuredIds = ["mt15", "lexi", "panigale-v4", "ktm-1390-super-adventure-r"];
      featuredIds.forEach(function (id) {
        const bike = motorcycles.find(function (item) {
          return item.id === id;
        });
        if (!bike) return;
        const card = document.createElement("article");
        card.className = "motorcycle-card";
        card.innerHTML = `
          <div class="bike-visual"><img src="${bike.image}" alt="${bike.name} motorcycle image" loading="lazy"></div>
          <div class="card-body">
            <div class="card-category">${bike.type}</div>
            <h3>${bike.name}</h3>
            <div class="card-year">${bike.modelYear || "Not specified"}</div>
            <div class="card-price">${formatPrice(bike.price)}</div>
            <a class="small-btn" href="motorcycles.html?id=${bike.id}">View Details</a>
            ${compareButtonMarkup(bike.id)}
          </div>
        `;
        container.appendChild(card);
        const compareButton = card.querySelector("[data-compare]");
        if (compareButton) compareButton.addEventListener("click", function () {
          const result = toggleCompare(bike.id);
          if (result.limit) alert(result.message);
          loadFeaturedMotorcycles();
        });
      });
    })
    .catch(function () {
      container.innerHTML = '<p class="empty-state" style="grid-column:1/-1">Open the project using a local server such as VS Code Live Server to load the JSON data.</p>';
    });
}


// LOCAL STORAGE: COMPARE
function getCompareSelection() {
  try { const value = JSON.parse(localStorage.getItem("ridelineCompare")) || []; return Array.isArray(value) ? value.slice(0, 2) : []; }
  catch (error) { return []; }
}
function saveCompareSelection(ids) {
  const unique = [...new Set(ids)].slice(0, 2);
  localStorage.setItem("ridelineCompare", JSON.stringify(unique));
  updateCompareCount();
  document.dispatchEvent(new CustomEvent("ridelineCompareChanged", { detail: unique }));
}
// COMPARE COUNT
function updateCompareCount() {
  const count = getCompareSelection().length;
  document.querySelectorAll(".compare-count").forEach(function (el) { el.textContent = count; });
}
function toggleCompare(id) {
  const selected = getCompareSelection();
  if (selected.includes(id)) { saveCompareSelection(selected.filter(function (item) { return item !== id; })); return { added: false, message: "Motorcycle removed from comparison." }; }
  if (selected.length >= 2) return { added: false, limit: true, message: "You can compare only two motorcycles. Remove one to choose another." };
  selected.push(id); saveCompareSelection(selected); return { added: true, message: "Motorcycle added to comparison." };
}
function compareButtonMarkup(id) {
  const selected = getCompareSelection().includes(id);
  return `<button class="small-btn compare-toggle ${selected ? "selected" : ""}" data-compare="${id}" aria-pressed="${selected}">${selected ? "Selected" : "Compare"}</button>`;
}
