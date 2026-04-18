const STORAGE_KEY = "eventoGoEvents";
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80";

const form = document.getElementById("eventForm");
const formTitle = document.getElementById("formTitle");
const eventIdInput = document.getElementById("eventId");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const locationInput = document.getElementById("location");
const priceInput = document.getElementById("price");
const imageInput = document.getElementById("image");
const descriptionInput = document.getElementById("description");
const imagePreview = document.getElementById("imagePreview");
const eventList = document.getElementById("eventList");
const eventCount = document.getElementById("eventCount");
const clearBtn = document.getElementById("clearBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const toast = document.getElementById("toast");

let currentImage = "";

init();

function init() {
  deleteExpiredEvents();
  renderEvents();

  form.addEventListener("submit", handleSubmit);
  imageInput.addEventListener("change", handleImageChange);
  clearBtn.addEventListener("click", resetForm);
  cancelEditBtn.addEventListener("click", resetForm);

  setInterval(() => {
    const before = getEvents().length;
    deleteExpiredEvents();
    const after = getEvents().length;

    if (before !== after) {
      renderEvents();
      showToast("Expired events were deleted automatically.");
    }
  }, 60000);
}

function getEvents() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

function handleImageChange() {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    currentImage = e.target.result;
    imagePreview.src = currentImage;
  };
  reader.readAsDataURL(file);
}

function handleSubmit(e) {
  e.preventDefault();

  const id = eventIdInput.value || Date.now().toString();
  const title = titleInput.value.trim();
  const category = categoryInput.value;
  const date = dateInput.value;
  const time = timeInput.value;
  const location = locationInput.value.trim();
  const price = priceInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title || !category || !date || !time || !location || price === "" || !description) {
    showToast("Please fill in all fields.");
    return;
  }

  const eventDateTime = new Date(`${date}T${time}`);
  if (eventDateTime <= new Date()) {
    showToast("Event date and time must be in the future.");
    return;
  }

  let events = getEvents();
  const oldEvent = events.find((event) => event.id === id);

  const eventData = {
    id,
    title,
    category,
    date,
    time,
    location,
    price: Number(price),
    description,
    image: currentImage || (oldEvent && oldEvent.image) || DEFAULT_IMAGE,
  };

  if (oldEvent) {
    events = events.map((event) => (event.id === id ? eventData : event));
    showToast("Event updated successfully.");
  } else {
    events.push(eventData);
    showToast("Event added successfully.");
  }

  saveEvents(events);
  deleteExpiredEvents();
  renderEvents();
  resetForm();
}

function renderEvents() {
  deleteExpiredEvents();

  const events = getEvents().sort(
    (a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
  );

  eventCount.textContent = `${events.length} event${events.length !== 1 ? "s" : ""}`;

  if (!events.length) {
    eventList.innerHTML = `<div class="empty">No events found.</div>`;
    return;
  }

  eventList.innerHTML = events
    .map(
      (event) => `
      <div class="event-item">
        <img src="${event.image}" alt="${escapeHtml(event.title)}">
        
        <div>
          <div class="badge">${escapeHtml(event.category)}</div>
          <h3 class="event-title">${escapeHtml(event.title)}</h3>
          <div class="meta">
            <div><strong>Date:</strong> ${formatDate(event.date)} - ${formatTime(event.time)}</div>
            <div><strong>Location:</strong> ${escapeHtml(event.location)}</div>
            <div><strong>Price:</strong> ${Number(event.price).toLocaleString()} EGP</div>
            <div><strong>Description:</strong> ${escapeHtml(event.description)}</div>
          </div>
        </div>

        <div class="event-buttons">
          <button class="btn btn-secondary" onclick="editEvent('${event.id}')">Edit</button>
          <button class="btn btn-danger" onclick="deleteEvent('${event.id}')">Delete</button>
        </div>
      </div>
    `
    )
    .join("");
}

function editEvent(id) {
  const events = getEvents();
  const event = events.find((item) => item.id === id);
  if (!event) return;

  eventIdInput.value = event.id;
  titleInput.value = event.title;
  categoryInput.value = event.category;
  dateInput.value = event.date;
  timeInput.value = event.time;
  locationInput.value = event.location;
  priceInput.value = event.price;
  descriptionInput.value = event.description;
  currentImage = event.image;
  imagePreview.src = event.image;

  formTitle.textContent = "Edit Event";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteEvent(id) {
  const events = getEvents();
  const event = events.find((item) => item.id === id);
  if (!event) return;

  const ok = confirm(`Delete "${event.title}"?`);
  if (!ok) return;

  const updatedEvents = events.filter((item) => item.id !== id);
  saveEvents(updatedEvents);
  renderEvents();

  if (eventIdInput.value === id) resetForm();
  showToast("Event deleted successfully.");
}

function deleteExpiredEvents() {
  const now = new Date();
  const events = getEvents();
  const validEvents = events.filter((event) => new Date(`${event.date}T${event.time}`) > now);
  saveEvents(validEvents);
}

function resetForm() {
  form.reset();
  eventIdInput.value = "";
  currentImage = "";
  imagePreview.src = "";
  formTitle.textContent = "Add Event";
}

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time) {
  const parts = time.split(":");
  const d = new Date();
  d.setHours(parts[0], parts[1]);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function showToast(message) {
  toast.textContent = message;
  toast.style.display = "block";
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.style.display = "none";
  }, 2500);
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}