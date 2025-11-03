async function loadHTML(id, file) {
    const element = document.getElementById(id);
    const response = await fetch(file);
    const html = await response.text();
    element.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
    loadHTML("header", "/docs/assets/header.html");
    loadHTML("footer", "/docs/assets/footer.html");
});