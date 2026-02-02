async function loadHTML(id, file) {
    const element = document.getElementById(id);
    const response = await fetch(file);
    const html = await response.text();
    element.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", async () => {
    document.body.style.visibility = "hidden";
    await loadHTML("header", "/assets/header.html");
    await loadHTML("footer", "/assets/footer.html");
    document.body.style.visibility = "visible";
});