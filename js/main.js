const menuItems = [
  { name: "Deep Work Latte", category: "coffee", price: 4.5, description: "Espresso, oat milk, vanilla, and cinnamon dust." },
  { name: "Chi Signature Mocha", category: "coffee", price: 4.75, description: "Dark chocolate, espresso, whipped cream, and cocoa." },
  { name: "Sunset Cold Brew", category: "cold", price: 5, description: "Cold brew with citrus foam and berry syrup." },
  { name: "Mint Iced Matcha", category: "cold", price: 4.9, description: "Matcha, mint, milk, and crushed ice." },
  { name: "Almond Croissant", category: "sweet", price: 3.25, description: "Flaky pastry with almond cream filling." },
  { name: "Founder Combo", category: "food", price: 8, description: "Latte, croissant, and one bonus loyalty stamp." },
  { name: "Jollof Brunch Toast", category: "food", price: 6.5, description: "Toasted sourdough with spicy tomato relish and eggs." },
  { name: "Berry Pancake Cup", category: "sweet", price: 5.25, description: "Mini pancakes layered with berries and cream." }
];

const moods = [
  "Today's mood: caramel focus mode.",
  "Today's mood: iced matcha and bold ideas.",
  "Today's mood: brunch table with friends.",
  "Today's mood: espresso sprint, then dessert.",
  "Today's mood: quiet corner, laptop open."
];

const visitTimes = [
  "Try Tuesday at 9:00 AM for calm work energy.",
  "Try Friday at 6:30 PM for music and dessert.",
  "Try Saturday at 11:00 AM for brunch with friends.",
  "Try Wednesday at 2:00 PM for a soft study break."
];

const orderKey = "chiCafeOrder";
const stampKey = "chiCafeStamps";

function getOrder() {
  return JSON.parse(localStorage.getItem(orderKey)) || [];
}

function saveOrder(order) {
  localStorage.setItem(orderKey, JSON.stringify(order));
}

function money(value) {
  return `$${value.toFixed(2)}`;
}

function addToOrder(item) {
  const order = getOrder();
  order.push(item);
  saveOrder(order);
  renderOrder();
}

function renderOrder() {
  const lists = document.querySelectorAll("#quickOrderList");
  const totals = document.querySelectorAll("#quickOrderTotal");
  if (!lists.length) return;

  const order = getOrder();
  const total = order.reduce((sum, item) => sum + item.price, 0);
  const content = order.length
    ? order.map((item, index) => `<li><span>${item.name}</span><button class="remove-item" data-index="${index}">${money(item.price)}</button></li>`).join("")
    : "<li>Your tray is waiting.</li>";

  lists.forEach(list => {
    list.innerHTML = content;
  });
  totals.forEach(totalNode => {
    totalNode.textContent = money(total);
  });
}

function renderMenu() {
  const menu = document.querySelector("#menuItems");
  if (!menu) return;

  const activeFilter = document.querySelector("#menuFilters .active")?.dataset.filter || "all";
  const search = document.querySelector("#menuSearch")?.value.toLowerCase() || "";
  const filtered = menuItems.filter(item => {
    const matchesFilter = activeFilter === "all" || item.category === activeFilter;
    const matchesSearch = `${item.name} ${item.description}`.toLowerCase().includes(search);
    return matchesFilter && matchesSearch;
  });

  menu.innerHTML = filtered.map(item => `
    <article class="menu-card">
      <span class="tag">${item.category}</span>
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <footer>
        <strong>${money(item.price)}</strong>
        <button class="mini-add" data-name="${item.name}" data-price="${item.price}">Add</button>
      </footer>
    </article>
  `).join("");
}

function renderStamps() {
  const grid = document.querySelector("#stampGrid");
  if (!grid) return;

  const stamps = Number(localStorage.getItem(stampKey) || 0);
  grid.innerHTML = Array.from({ length: 6 }, (_, index) => (
    `<span class="stamp ${index < stamps ? "filled" : ""}">${index < stamps ? "Chi" : index + 1}</span>`
  )).join("");
  document.querySelector("#stampMessage").textContent = stamps >= 6
    ? "Reward unlocked: free pastry on your next visit."
    : `${6 - stamps} stamp${6 - stamps === 1 ? "" : "s"} until your pastry reward.`;
}

document.addEventListener("click", event => {
  const navToggle = event.target.closest("#menu-btn");
  if (navToggle) {
    document.querySelector("#nav-menu")?.classList.toggle("open");
  }

  const addButton = event.target.closest(".mini-add");
  if (addButton) {
    addToOrder({ name: addButton.dataset.name, price: Number(addButton.dataset.price) });
  }

  const removeButton = event.target.closest(".remove-item");
  if (removeButton) {
    const order = getOrder();
    order.splice(Number(removeButton.dataset.index), 1);
    saveOrder(order);
    renderOrder();
  }

  if (event.target.closest("#clearQuickOrder")) {
    saveOrder([]);
    renderOrder();
  }

  const filterButton = event.target.closest("#menuFilters button");
  if (filterButton) {
    document.querySelectorAll("#menuFilters button").forEach(button => button.classList.remove("active"));
    filterButton.classList.add("active");
    renderMenu();
  }
});

document.querySelector("#menuSearch")?.addEventListener("input", renderMenu);

document.querySelector("#moodBtn")?.addEventListener("click", () => {
  const result = document.querySelector("#moodResult");
  const nextMood = moods[Math.floor(Math.random() * moods.length)];
  result.textContent = nextMood;
});

document.querySelector("#stampCard")?.addEventListener("click", () => {
  const current = Number(localStorage.getItem(stampKey) || 0);
  localStorage.setItem(stampKey, String(Math.min(6, current + 1)));
  renderStamps();
});

document.querySelector("#stampCard")?.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    document.querySelector("#stampCard").click();
  }
});

document.querySelector("#galleryGrid")?.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  const lightbox = document.querySelector("#lightbox");
  document.querySelector("#lightboxImg").src = button.dataset.src;
  document.querySelector("#lightboxImg").alt = button.dataset.caption;
  document.querySelector("#lightboxCaption").textContent = button.dataset.caption;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
});

document.querySelector("#closeLightbox")?.addEventListener("click", () => {
  const lightbox = document.querySelector("#lightbox");
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
});

document.querySelector("#contactForm")?.addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  const message = document.querySelector("#formMessage");
  message.textContent = `Thanks ${form.name.value.trim()}. Your ${form.visit.value.toLowerCase()} request is ready for the Chi team.`;
  form.reset();
});

document.querySelector("#vibeBtn")?.addEventListener("click", () => {
  document.querySelector("#contactVibe").textContent = visitTimes[Math.floor(Math.random() * visitTimes.length)];
});

renderMenu();
renderOrder();
renderStamps();

document.addEventListener("pointermove", event => {
  document.body.style.setProperty("--cursor-x", `${(event.clientX / window.innerWidth) * 100}%`);
  document.body.style.setProperty("--cursor-y", `${(event.clientY / window.innerHeight) * 100}%`);
});
