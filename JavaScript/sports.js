const API = "http://localhost:3000/api/events?category=Sports";

async function getEvents() {
  try {
    const res = await fetch(API);
    return await res.json();
  } catch (err) {
    console.log(err);
    return [];
  }
}

function renderCard(event) {
  return `
    <div class="event-card">
      <h2>${event.title}</h2>
      <p>Date: ${event.date} | ${event.time}</p>
      <p>Location: ${event.location}</p>
      <p>Price: ${event.price} EGP</p>
      <p>${event.description}</p>
      <button class="book-btn">Book Now</button>
    </div>
  `;
}

async function renderEvents() {
  const container = document.querySelector(".events-container");
  const events = await getEvents();

  if (!container) return;

  if (!events.length) {
    container.innerHTML = "<p>No sports events found.</p>";
    return;
  }

  container.innerHTML = events.map(renderCard).join("");
}

document.addEventListener("DOMContentLoaded", renderEvents);