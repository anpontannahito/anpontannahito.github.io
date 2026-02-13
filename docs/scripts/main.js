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
    initThemeToggle();
    document.body.style.visibility = "visible";
});

function initThemeToggle() {
    const btn = document.querySelector("#btn-mode");

    // 保存されたテーマ設定があれば復元
    const savedTheme = localStorage.getItem("theme") || "dark";
    applyTheme(savedTheme);

    // チェックした時の挙動
    btn.addEventListener("click", () => {
        const isDark = document.body.classList.contains("dark-theme");
        applyTheme(isDark ? "light" : "dark");
    });
}

function applyTheme(theme) {
    const btn = document.querySelector("#btn-mode");

    if (theme === "light") {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
        document.documentElement.classList.remove("dark-mode");
        document.documentElement.classList.add("light-mode");
        document.querySelectorAll(".box").forEach(box => {
            box.classList.remove("box-dark-mode");
            box.classList.add("box-light-mode");
        });
        if (btn) btn.checked = false;
        localStorage.setItem("theme", "light");
    } else {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
        document.documentElement.classList.remove("light-mode");
        document.documentElement.classList.add("dark-mode");
        document.querySelectorAll(".box").forEach(box => {
            box.classList.remove("box-light-mode");
            box.classList.add("box-dark-mode");
        });
        if (btn) btn.checked = true;
        localStorage.setItem("theme", "dark");
    }
}