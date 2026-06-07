const EVENT_API = "/api/events";
const BOOKING_API = "/api/bookings/confirm";
const detailsContainer = document.getElementById("detailsContainer");
const bookingContainer = document.getElementById("bookingContainer");
const toast = document.getElementById("toast");

const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");

const DEFAULT_IMAGE = "https://via.placeholder.com/700x400";

let selectedEvent = null;

document.addEventListener("DOMContentLoaded", loadEventDetails);

async function loadEventDetails() {
    if (!eventId) {
        detailsContainer.innerHTML = `<p class="loading">No event selected.</p>`;
        return;
    }

    try {
        const response = await fetch(EVENT_API);
        const events = await response.json();

        selectedEvent = events.find((event) => event._id === eventId);

        if (!selectedEvent) {
            detailsContainer.innerHTML = `<p class="loading">Event not found.</p>`;
            return;
        }

        renderEventDetails(selectedEvent);

    } catch (error) {
        console.error("Error loading event:", error);
        detailsContainer.innerHTML = `<p class="loading">Failed to load event details.</p>`;
    }
}

function renderEventDetails(event) {
    const images = getEventImages(event);

    detailsContainer.innerHTML = `
        <section class="details-card">

            <div class="image-gallery">
                ${images.map((img) => `
                    <img src="${resolveImage(img)}" alt="${escapeHtml(event.title)}">
                `).join("")}
            </div>

            <div class="details-content">
                <span class="category-pill">${escapeHtml(event.category)}</span>

                <h2>${escapeHtml(event.title)}</h2>

                <div class="info-grid">
                    <div>
                        <span>Date</span>
                        <strong>${formatDate(event.date)}</strong>
                    </div>

                    <div>
                        <span>Time</span>
                        <strong>${formatTime(event.time)}</strong>
                    </div>

                    <div>
                        <span>Location</span>
                        <strong>${escapeHtml(event.location)}</strong>
                    </div>

                    <div>
                        <span>Price</span>
                        <strong>${Number(event.price).toLocaleString()} EGP</strong>
                    </div>
                </div>

                <div class="description-box">
                    <h3>Description</h3>
                    <p>${formatDescription(event.description)}</p>
                </div>

                <button class="book-btn" onclick="showBookingForm()">
                    Book Now
                </button>
            </div>

        </section>
    `;
}

function showBookingForm() {
    bookingContainer.innerHTML = `
        <section class="booking-card">

            <h2>Complete Your Booking</h2>
            <p class="payment-note">This is a demo payment form for the project.</p>

            <form id="bookingForm">

                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="customerEmail" placeholder="example@email.com" required>
                </div>

                <div class="form-group">
                    <label>Number of Tickets</label>
                    <input type="number" id="ticketCount" min="1" max="10" value="1" required>
                </div>

                <div class="form-group">
                    <label>Visa Card Number</label>
                    <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" required>
                </div>

                <div class="payment-row">
                    <div class="form-group">
                        <label>Expiry Date</label>
                        <input type="text" id="expiryDate" placeholder="MM/YY" maxlength="5" required>
                    </div>

                    <div class="form-group">
                        <label>CVV</label>

                        <div class="cvv-wrapper">
                            <input type="password" id="cvv" placeholder="123" maxlength="3" required>
                            <button type="button" id="toggleCvv">👁</button>
                        </div>
                    </div>
                </div>

                <button type="submit" class="confirm-btn">
                    Confirm Booking
                </button>

            </form>

        </section>
    `;

    const cardInput = document.getElementById("cardNumber");
    const expiryInput = document.getElementById("expiryDate");
    const cvvInput = document.getElementById("cvv");
    const toggleCvv = document.getElementById("toggleCvv");

    cardInput.addEventListener("input", formatCardNumber);
    expiryInput.addEventListener("input", formatExpiryDate);

    toggleCvv.addEventListener("click", () => {
        if (cvvInput.type === "password") {
            cvvInput.type = "text";
            toggleCvv.textContent = "🙈";
        } else {
            cvvInput.type = "password";
            toggleCvv.textContent = "👁";
        }
    });

    document.getElementById("bookingForm").addEventListener("submit", confirmBooking);

    bookingContainer.scrollIntoView({ behavior: "smooth" });
}

function formatCardNumber(e) {
    let value = e.target.value.replace(/\D/g, "");

    value = value.substring(0, 16);

    e.target.value = value.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiryDate(e) {
    let value = e.target.value.replace(/\D/g, "");

    value = value.substring(0, 4);

    if (value.length >= 3) {
        value = value.substring(0, 2) + "/" + value.substring(2);
    }

    e.target.value = value;
}

async function confirmBooking(e) {
    e.preventDefault();
    console.log("CONFIRM BOOKING CLICKED");
console.log("Booking API:", BOOKING_API);

    const email = document.getElementById("customerEmail").value.trim();
    const tickets = Number(document.getElementById("ticketCount").value);
    const cardNumber = document.getElementById("cardNumber").value.replaceAll(" ", "");
    const expiryDate = document.getElementById("expiryDate").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    if (!validateBooking(email, tickets, cardNumber, expiryDate, cvv)) {
        return;
    }

    const bookingId = generateBookingId();

    try {
        const response = await fetch(BOOKING_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                tickets,
                bookingId,
                event: {
                    title: selectedEvent.title,
                    category: selectedEvent.category,
                    date: selectedEvent.date,
                    time: selectedEvent.time,
                    location: selectedEvent.location,
                    price: selectedEvent.price,
                    description: selectedEvent.description
                }
            })
        });

        if (!response.ok) {
            throw new Error("Email could not be sent");
        }

        showToast("Booking successful! Check your email for your ticket and QR code.");

        bookingContainer.innerHTML = "";

        setTimeout(() => {
            window.location.href = "../index.html";
        }, 10000);

    } catch (error) {
        console.error(error);
        showToast("Booking saved, but email could not be sent. Please try again.");
    }
}

function validateBooking(email, tickets, cardNumber, expiryDate, cvv) {
    if (!email.includes("@")) {
        showToast("Please enter a valid email.");
        return false;
    }

    if (tickets < 1 || tickets > 10) {
        showToast("Tickets must be between 1 and 10.");
        return false;
    }

    if (!/^\d{16}$/.test(cardNumber)) {
        showToast("Card number must be 16 digits.");
        return false;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        showToast("Expiry date must be in MM/YY format.");
        return false;
    }

    if (!isFutureExpiry(expiryDate)) {
        showToast("This Visa card is expired. Please enter a future expiry date.");
        return false;
    }

    if (!/^\d{3}$/.test(cvv)) {
        showToast("CVV must be 3 digits.");
        return false;
    }

    return true;
}

function isFutureExpiry(expiryDate) {
    const [month, year] = expiryDate.split("/").map(Number);

    if (month < 1 || month > 12) {
        return false;
    }

    const fullYear = 2000 + year;

    const expiry = new Date(fullYear, month, 0, 23, 59, 59);
    const now = new Date();

    return expiry > now;
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 10000);
}

function generateBookingId() {
    return "EVG-" + Date.now();
}

function getEventImages(event) {
    if (event.images && Array.isArray(event.images) && event.images.length > 0) {
        return event.images;
    }

    if (event.image) {
        return [event.image];
    }

    return [DEFAULT_IMAGE];
}

function resolveImage(imagePath) {
    if (!imagePath) {
        return DEFAULT_IMAGE;
    }

    if (imagePath.startsWith("http")) {
        return imagePath;
    }

    return `http://localhost:3000${imagePath}`;
}

function formatDate(date) {
    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function formatTime(time) {
    if (!time) return "";

    const [h, m] = time.split(":");
    const d = new Date();

    d.setHours(h, m);

    return d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function formatDescription(description) {
    return escapeHtml(description).replaceAll("\n", "<br>");
}

function escapeHtml(text) {
    return String(text || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}