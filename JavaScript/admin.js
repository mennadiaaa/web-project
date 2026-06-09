//deleted storage key constant as we are now using the backend instead of localStorage

const API="http://localhost:3000/api/admin/events";
const USERS_API="http://localhost:3000/api/admin/users";

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


init();

async function init() {

  await renderEvents();
  await loadUsers();

  form.addEventListener("submit", handleSubmit);
  imageInput.addEventListener("change", handleImageChange);
  clearBtn.addEventListener("click", resetForm);
  cancelEditBtn.addEventListener("click", resetForm);

}

//changed getEvents function to fetch events from the backend instead of localStorage
async function getEvents(){

    try{

        const response=
        await fetch(API);

        return await response.json();

    }
    catch(error){

        console.log(error);

        return [];

    }

}

function handleImageChange() {
  const file = imageInput.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    imagePreview.src = e.target.result;
  };
  reader.readAsDataURL(file);
}


async function handleSubmit(e){

e.preventDefault();

if(
!titleInput.value.trim() ||
!categoryInput.value ||
!dateInput.value ||
!timeInput.value ||
!locationInput.value.trim() ||
!priceInput.value ||
!descriptionInput.value.trim()
){

showToast("Fill all fields");

return;

}

const eventDateTime=
new Date(
`${dateInput.value}T${timeInput.value}`
);

if(
eventDateTime<=new Date()
){

showToast(
"Event must be in future"
);

return;

}

try{

const formData=new FormData();

formData.append(
"title",
titleInput.value
);

formData.append(
"category",
categoryInput.value
);

formData.append(
"location",
locationInput.value
);

formData.append(
"date",
dateInput.value
);

formData.append(
"time",
timeInput.value
);

formData.append(
"price",
priceInput.value
);

formData.append(
"description",
descriptionInput.value
);

if(imageInput.files[0]){

formData.append(
"image",
imageInput.files[0]

);

}

let url=API;

let method="POST";

if(eventIdInput.value){

url+=`/${eventIdInput.value}`;

method="PUT";

}

console.log(imageInput.files[0]);

//deleted old fetch call and replaced with new one that sends formData to the backend
const response = await fetch(
url,
{
method,
body:formData
}
);

if(!response.ok){
  throw new Error("Failed to save");
}

showToast(

method==="POST"
?
"Event Added"
:
"Event Updated"

);

await renderEvents();

resetForm();

}
catch(error){

console.error(error);

showToast(
error.message
);

}

}

async function renderEvents() {

    const events = await getEvents();

  events.sort(
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
        <img src="${event.image?`http://localhost:3000${event.image}`:DEFAULT_IMAGE}" alt="${escapeHtml(event.title)}">
        
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
          <button class="btn btn-secondary" onclick="editEvent('${event._id}')">Edit</button>
          <button class="btn btn-danger" onclick="deleteEvent('${event._id}')">Delete</button>
        </div>
      </div>
    `
    )
    .join("");
}

async function editEvent(id) {
  const events = await getEvents();

  const event = events.find((item) => item._id === id);
  if (!event) return;

  eventIdInput.value = event._id;
  titleInput.value = event.title;
  categoryInput.value = event.category;
  dateInput.value = event.date;
  timeInput.value = event.time;
  locationInput.value = event.location;
  priceInput.value = event.price;
  descriptionInput.value = event.description;
  imagePreview.src = event.image?"http://localhost:3000"+event.image:"";

  formTitle.textContent = "Edit Event";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteEvent(id){

const ok=confirm("Delete this event?");

if(!ok)return;

await fetch(

`${API}/${id}`,

{
method:"DELETE"
}

);

showToast("Deleted");

await renderEvents();

}

//deleted deleteExpiredEvents function as we are now using the backend instead of localStorage

function resetForm() {
  form.reset();
  eventIdInput.value = "";
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

// ── USER MANAGEMENT ──────────────────────────────────────

async function loadUsers() {
    try {
        const res = await fetch(USERS_API);
        const users = await res.json();

        const userCount = document.getElementById("userCount");
        const userList = document.getElementById("userList");

        userCount.textContent = `${users.length} user${users.length !== 1 ? "s" : ""}`;

        if (!users.length) {
            userList.innerHTML = `<div class="empty">No users found.</div>`;
            return;
        }

        userList.innerHTML = users.map(user => `
            <div class="event-item">
                <div style="flex:1">
                    <h3 class="event-title">${escapeHtml(user.name)}</h3>
                    <div class="meta">
                        <div><strong>Email:</strong> ${escapeHtml(user.email)}</div>
                        <div><strong>Role:</strong> <span class="badge">${escapeHtml(user.role)}</span></div>
                    </div>
                </div>
                <div class="event-buttons">
                    <button class="btn btn-danger" onclick="deleteUser('${user._id}')">Delete</button>
                </div>
            </div>
        `).join("");

    } catch (err) {
        console.error("Failed to load users:", err);
    }
}

async function deleteUser(id) {
    const ok = confirm("Delete this user?");
    if (!ok) return;
    await fetch(`${USERS_API}/${id}`, { method: "DELETE" });
    showToast("User deleted");
    await loadUsers();
}