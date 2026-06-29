(() => {
    let memoElement = null;

    function initMemo() {
        memoElement = document.getElementById("memo");
        if (!memoElement) return;

        memoElement.value = localStorage.getItem("memo") || "";
    }

    function save() {
        if (!memoElement) initMemo();
        if (!memoElement) return;

        localStorage.setItem("memo", memoElement.value);
        alert("保存しました！");
    }

    window.initMemo = initMemo;
    window.save = save;
})();