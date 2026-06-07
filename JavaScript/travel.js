const API = "http://localhost:3000/api/events?category=Travel";

const container = document.getElementById("eventsContainer");

// Fetch events from backend
async function getEvents() {
  try {
    const res = await fetch(API);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching events:", err);
    return [];
  }
}

// Render ONE event card
function renderCard(event) {
  return `
    <div class="event-card">

      <img 
        src="${event.image ? `http://localhost:3000${event.image}` : 'https://via.placeholder.com/400'}" 
        alt="${event.title}"
      >

      <h2>${event.title}</h2>

      <p><strong>Date:</strong> ${formatDate(event.date)} | ${formatTime(event.time)}</p>
      <p><strong>Location:</strong> ${event.location}</p>
      <p><strong>Price:</strong> ${event.price} EGP</p>

      <p>${shortenText(event.description, 80)}</p>

      <a href="event-details.html?id=${event._id}" class="book-btn">
        View Details
      </a>

    </div>
  `;
}

// Render ALL events
async function renderEvents() {
  const events = await getEvents();

  if (!events.length) {
    container.innerHTML = "<p>No travel events found.</p>";
    return;
  }

  container.innerHTML = events.map(renderCard).join("");
}

// Helpers
function shortenText(text, maxLength) {
  if (!text) return "";
  return text.length > maxLength
    ? text.substring(0, maxLength) + "..."
    : text;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(time) {
  const [h, m] = time.split(":");
  const d = new Date();
  d.setHours(h, m);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Start
document.addEventListener("DOMContentLoaded", renderEvents);