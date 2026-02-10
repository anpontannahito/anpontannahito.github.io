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

    if (!btn) {
        console.warn("Theme toggle button not found");
        return;
    }

    // 保存されたテーマ設定があれば復元
    const savedTheme = localStorage.getItem("theme") || "dark";
    if (savedTheme === "light") {
        document.body.classList.remove("dark-theme");
        document.body.classList.add("light-theme");
        document.querySelectorAll(".box").forEach(box => {
            box.classList.remove("box-dark-mode");
            box.classList.add("box-light-mode");
        });
        btn.checked = false;
        localStorage.setItem("theme", "light");
    } else {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-theme");
        document.querySelectorAll(".box").forEach(box => {
            box.classList.remove("box-light-mode");
            box.classList.add("box-dark-mode");
        });
        btn.checked = true;
        localStorage.setItem("theme", "dark");
    }

    // チェックした時の挙動
    btn.addEventListener("click", () => {
        if (document.body.classList.contains("dark-theme")) {
            // ダークモード → ライトモード
            document.body.classList.remove("dark-theme");
            document.body.classList.add("light-theme");
            document.querySelectorAll(".box").forEach(box => {
                box.classList.remove("box-dark-mode");
                box.classList.add("box-light-mode");
            });
            localStorage.setItem("theme", "light");
        } else {
            // ライトモード → ダークモード
            document.body.classList.remove("light-theme");
            document.body.classList.add("dark-theme");
            document.querySelectorAll(".box").forEach(box => {
                box.classList.remove("box-light-mode");
                box.classList.add("box-dark-mode");
            });
            localStorage.setItem("theme", "dark");
        }
    });
}