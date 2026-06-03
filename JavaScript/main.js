const API = "http://localhost:3000/api/admin/events";
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80";

async function getEvents() {
  try {
    const response = await fetch(API);
    return await response.json();
  } catch (err) {
    console.log(err);
    return [];
  }
}

async function renderEvents() {
  const events = await getEvents();
  const container = document.getElementById("eventsContainer");

  if (!container) return;

  if (!events.length) {
    container.innerHTML = "<p>No events available yet.</p>";
    return;
  }

  container.innerHTML = events.map(event => `
    <div class="event-card">
      <img src="${event.image ? `http://localhost:3000${event.image}` : DEFAULT_IMAGE}" alt="${event.title}">
      <h3>${event.title}</h3>
      <p>${event.category}</p>
      <p>${event.location}</p>
      <p>${event.date} | ${event.time}</p>
      <p>${event.price} EGP</p>
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", renderEvents);