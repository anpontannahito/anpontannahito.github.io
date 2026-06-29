const MAIN_SELECTOR = ".container";
const MAIN_SCRIPT_PATH = "/scripts/main.js";
const PAGE_INITIALIZERS = {
    "/scripts/memo.js": "initMemo",
    "/scripts/clock.js": "initClock",
    "/scripts/timer.js": "initTimer",
    "/scripts/counter.js": "initCounter",
    "/scripts/todo.js": "initTodo"
};

let activeNavigationController = null;

async function loadHTML(id, file) {
    const element = document.getElementById(id);
    if (!element) return;

    const response = await fetch(file);
    if (!response.ok) {
        throw new Error(`${file} の読み込みに失敗しました`);
    }

    const html = await response.text();
    element.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", async () => {
    document.body.style.visibility = "hidden";

    try {
        await Promise.all([
            loadHTML("header", "/assets/header.html"),
            loadHTML("footer", "/assets/footer.html")
        ]);
    } catch (error) {
        console.error(error);
    }

    initThemeToggle();
    initPartialNavigation();
    await initializePage(document, new URL(location.href));
    document.body.style.visibility = "visible";
});

function initThemeToggle() {
    const btn = document.querySelector("#btn-mode");
    if (!btn) return;

    // 保存されたテーマ設定があれば復元
    const savedTheme = localStorage.getItem("theme") || "dark";
    applyTheme(savedTheme);

    if (btn.dataset.themeInitialized === "true") return;
    btn.dataset.themeInitialized = "true";

    // チェックした時の挙動
    btn.addEventListener("click", () => {
        const isDark = document.body.classList.contains("dark-theme");
        applyTheme(isDark ? "light" : "dark");
    });
}

function applyTheme(theme) {
    const btn = document.querySelector("#btn-mode");
    const isLight = theme === "light";

    document.body.classList.toggle("light-theme", isLight);
    document.body.classList.toggle("dark-theme", !isLight);
    document.documentElement.classList.toggle("light-theme", isLight);
    document.documentElement.classList.toggle("dark-theme", !isLight);
    document.documentElement.classList.remove("light-mode", "dark-mode");

    document.querySelectorAll(".box").forEach(box => {
        box.classList.toggle("box-light-mode", isLight);
        box.classList.toggle("box-dark-mode", !isLight);
    });

    if (btn) btn.checked = !isLight;
    localStorage.setItem("theme", isLight ? "light" : "dark");
}

function initPartialNavigation() {
    if (window.partialNavigationInitialized) return;
    window.partialNavigationInitialized = true;

    document.addEventListener("click", handleNavigationClick);
    window.addEventListener("popstate", () => {
        navigateTo(location.href, { push: false });
    });
}

function handleNavigationClick(event) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest("a[href]");
    if (!link || link.target || link.hasAttribute("download")) return;

    const url = new URL(link.href);
    if (!shouldHandleNavigation(url)) return;

    event.preventDefault();
    navigateTo(url.href);
}

function shouldHandleNavigation(url) {
    if (url.origin !== location.origin) return false;
    if (url.pathname === location.pathname && url.search === location.search && url.hash) return false;

    const filename = url.pathname.split("/").pop();
    if (!filename || !filename.includes(".")) return true;

    return filename.endsWith(".html");
}

async function navigateTo(url, options = {}) {
    const push = options.push !== false;
    const targetUrl = new URL(url, location.href);
    const currentMain = document.querySelector(MAIN_SELECTOR);

    if (!currentMain) {
        location.href = targetUrl.href;
        return;
    }

    if (targetUrl.href === location.href && push) return;

    if (activeNavigationController) {
        activeNavigationController.abort();
    }

    const controller = new AbortController();
    activeNavigationController = controller;
    currentMain.setAttribute("aria-busy", "true");

    try {
        const response = await fetch(targetUrl.href, { signal: controller.signal });
        if (!response.ok) {
            throw new Error(`${targetUrl.pathname} の読み込みに失敗しました`);
        }

        const html = await response.text();
        const nextDocument = new DOMParser().parseFromString(html, "text/html");
        const nextMain = nextDocument.querySelector(MAIN_SELECTOR);
        if (!nextMain) {
            throw new Error("更新対象のメイン表示エリアが見つかりません");
        }

        cleanupCurrentPage();
        loadPageStyles(nextDocument, targetUrl);
        currentMain.replaceWith(document.importNode(nextMain, true));
        document.title = nextDocument.title || document.title;

        if (push) {
            history.pushState({}, "", targetUrl.href);
        }

        applyTheme(localStorage.getItem("theme") || "dark");
        await initializePage(nextDocument, targetUrl);
        window.scrollTo({ top: 0, behavior: "auto" });
    } catch (error) {
        if (error.name === "AbortError") return;
        console.error(error);
        location.href = targetUrl.href;
    } finally {
        if (activeNavigationController === controller) {
            activeNavigationController = null;
        }
        document.querySelector(MAIN_SELECTOR)?.removeAttribute("aria-busy");
    }
}

function cleanupCurrentPage() {
    if (typeof window.currentPageCleanup !== "function") return;

    try {
        window.currentPageCleanup();
    } catch (error) {
        console.error(error);
    } finally {
        window.currentPageCleanup = null;
    }
}

async function initializePage(pageDocument, pageUrl) {
    const pageScripts = getPageScriptSources(pageDocument, pageUrl);

    for (const scriptSrc of pageScripts) {
        await loadScriptOnce(scriptSrc);
    }

    for (const scriptSrc of pageScripts) {
        const initializerName = PAGE_INITIALIZERS[new URL(scriptSrc).pathname];
        if (initializerName && typeof window[initializerName] === "function") {
            window[initializerName]();
        }
    }
}

function getPageScriptSources(pageDocument, pageUrl) {
    return Array.from(pageDocument.querySelectorAll("script[src]"))
        .map(script => new URL(script.getAttribute("src"), pageUrl).href)
        .filter(scriptSrc => new URL(scriptSrc).pathname !== MAIN_SCRIPT_PATH);
}

function loadScriptOnce(scriptSrc) {
    if (isScriptLoaded(scriptSrc)) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = scriptSrc;
        script.dataset.dynamicPageScript = "true";
        script.onload = resolve;
        script.onerror = () => reject(new Error(`${scriptSrc} の読み込みに失敗しました`));
        document.body.appendChild(script);
    });
}

function isScriptLoaded(scriptSrc) {
    return Array.from(document.querySelectorAll("script[src]")).some(script => {
        return new URL(script.getAttribute("src"), location.href).href === scriptSrc;
    });
}

function loadPageStyles(pageDocument, pageUrl) {
    const styleLinks = Array.from(pageDocument.querySelectorAll('link[rel~="stylesheet"][href]'));

    for (const link of styleLinks) {
        const href = new URL(link.getAttribute("href"), pageUrl).href;
        if (isStylesheetLoaded(href)) continue;

        const newLink = document.createElement("link");
        newLink.rel = "stylesheet";
        newLink.href = href;
        document.head.appendChild(newLink);
    }
}

function isStylesheetLoaded(href) {
    return Array.from(document.querySelectorAll('link[rel~="stylesheet"][href]')).some(link => {
        return new URL(link.getAttribute("href"), location.href).href === href;
    });
}