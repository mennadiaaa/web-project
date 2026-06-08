const themeToggle = document.getElementById("themeToggle");

console.log("theme.js is working");
console.log(themeToggle);

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");

    if (themeToggle) {
        themeToggle.textContent = "☀️ Light Mode";
    }
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        console.log("button clicked");

        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
            themeToggle.textContent = "☀️ Light Mode";
        } else {
            localStorage.setItem("theme", "light");
            themeToggle.textContent = "🌙 Dark Mode";
        }
    });
}