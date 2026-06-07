const API = "http://localhost:3000/api/events";
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80";

document.addEventListener("DOMContentLoaded", () => {
    fetchAndRender();
});

async function searchEvents() {
    const search = document.getElementById("searchInput").value.trim();
    const category = document.getElementById("categorySelect").value;
    fetchAndRender(search, category);
}

function clearSearch() {
    document.getElementById("searchInput").value = "";
    document.getElementById("categorySelect").value = "";
    fetchAndRender();
}

async function fetchAndRender(search = "", category = "") {
    const container = document.getElementById("eventsContainer");
    const title = document.getElementById("eventsTitle");

    container.innerHTML = "<p>Loading...</p>";

    let url = API;
    const params = [];

    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (category) params.push(`category=${encodeURIComponent(category)}`);
    if (params.length) url += "?" + params.join("&");

    try {
        const res = await fetch(url);
        const events = await res.json();

        if (search && category) {
            title.textContent = `Results for "${search}" in ${category}`;
        } else if (search) {
            title.textContent = `Results for "${search}"`;
        } else if (category) {
            title.textContent = `${category} Events`;
        } else {
            title.textContent = "Featured Events";
        }

        render(events);

    } catch (err) {
        console.error("Error fetching events:", err);
        container.innerHTML = "<p>Failed to load events. Make sure the server is running.</p>";
    }
}

function render(events) {
    const container = document.getElementById("eventsContainer");

    if (!events.length) {
        container.innerHTML = `
            <div class="no-results-wrap">
                <p class="no-results">😕 No events found matching your search.</p>
                <p class="no-results-sub">Try different keywords or <span onclick="clearSearch()" class="clear-link">clear the search</span> to see all events.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = events.map(event => `
        <div class="event-card">
            <div class="event-card-img-wrap">
                <img 
                    src="${event.image ? `http://localhost:3000${event.image}` : DEFAULT_IMAGE}" 
                    alt="${escapeHtml(event.title)}"
                    onerror="this.src='${DEFAULT_IMAGE}'"
                >
                <span class="event-badge">${escapeHtml(event.category)}</span>
            </div>
            <div class="event-card-body">
                <h3>${escapeHtml(event.title)}</h3>
                <p class="event-desc">${shortenText(event.description, 80)}</p>
                <div class="event-meta">
                    <p>📅 ${formatDate(event.date)}</p>
                    <p>📍 ${escapeHtml(event.location)}</p>
                </div>
                <div class="event-card-footer">
                    <div class="event-price">
                        <span class="from-label">From</span>
                        <span class="price-value">${Number(event.price).toLocaleString()} EGP</span>
                    </div>
                    <a href="pages/details.html?id=${event._id}" class="reserve-btn">Reserve</a>
                </div>
            </div>
        </div>
    `).join("");
}

function shortenText(text, max) {
    if (!text) return "";
    return text.length > max ? text.substring(0, max) + "..." : text;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric"
    });
}

function formatTime(time) {
    if (!time) return "";
    const [h, m] = time.split(":");
    const d = new Date();
    d.setHours(h, m);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function escapeHtml(text) {
    return String(text || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}