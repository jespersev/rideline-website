// SPECIFICATION FORMATTING
function specValue(value, suffix) {
  if (value === null || value === undefined || value === "") return "Not specified";
  if (typeof value === "number" && suffix) return String(value) + suffix;
  return String(value);
}
function weightValue(bike) {
  if (typeof bike.weight === "number") return bike.weight + " kg" + (bike.weightType ? " (" + bike.weightType + ")" : "");
  if (typeof bike.weight === "string" && bike.weight.trim() !== "" && bike.weight !== "Not specified") {
    return bike.weight + (bike.weightType && bike.weightType !== "Not specified" ? " (" + bike.weightType + ")" : "");
  }
  return "Not specified";
}
// MODAL
// MODAL
function closeDetailsModal() {
  const modal = document.getElementById("details-modal");
  if (!modal || modal.classList.contains("hidden")) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (window.__ridelineModalPreviousFocus && typeof window.__ridelineModalPreviousFocus.focus === "function") window.__ridelineModalPreviousFocus.focus();
}
// DYNAMIC CONTENT
function openDetails(bike) {
  const modal = document.getElementById("details-modal");
  const content = document.getElementById("details-content");
  if (!modal || !content) return;
  window.__ridelineModalPreviousFocus = document.activeElement;
  const saved = isSaved(bike.id);
  const compareSelected = getCompareSelection().includes(bike.id);
  const specs = [
    ["Category", specValue(bike.type)], ["Model Year", specValue(bike.modelYear)], ["Engine Displacement", specValue(bike.engineDisplacement, " cc")],
    ["Engine Type/Configuration", specValue(bike.engineType)], ["Transmission", specValue(bike.transmission)],
    ["Weight", weightValue(bike)], ["Seat Height", specValue(bike.seatHeight, " mm")], ["Fuel Capacity", specValue(bike.fuelCapacity)], ["Cooling System", specValue(bike.cooling)]
  ];
  content.innerHTML = `
    <div class="details-layout"><div class="details-visual"><img src="${bike.image}" alt="${bike.name} motorcycle image"></div>
      <div class="details-copy"><p class="eyebrow">${bike.type} MOTORCYCLE</p><h2 id="details-name">${bike.name}</h2>
        <p class="details-price">${formatPrice(bike.price)}</p><p>${bike.description}</p>
        <div class="spec-list">${specs.map(function(row){return `<div class="spec-row"><span>${row[0]}</span><strong>${row[1]}</strong></div>`;}).join("")}</div>
        <div class="card-actions details-actions"><button class="btn btn-red" id="details-garage">${saved ? "Remove from Garage" : "Add to Garage"}</button>
        <a class="btn btn-outline" style="color:#111;border-color:#111" href="inquiry.html?motorcycle=${encodeURIComponent(bike.id)}">Send Inquiry</a>
        <button class="btn btn-outline dark-outline" id="details-compare" aria-pressed="${compareSelected}">${compareSelected ? "Remove Compare" : "Compare"}</button></div>
      </div></div>`;
  modal.classList.remove("hidden"); modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  const closeButton = modal.querySelector(".modal-close");
  if (closeButton) closeButton.focus();
  document.getElementById("details-garage").addEventListener("click", function(){toggleGarage(bike.id);openDetails(bike);});
  document.getElementById("details-compare").addEventListener("click", function(){
    const result=toggleCompare(bike.id); if(result.limit){alert(result.message);return;} openDetails(bike);
  });
}
document.addEventListener("click",function(event){if(event.target.matches("[data-close-modal]")) closeDetailsModal();});
document.addEventListener("keydown",function(event){if(event.key==="Escape") closeDetailsModal();});
