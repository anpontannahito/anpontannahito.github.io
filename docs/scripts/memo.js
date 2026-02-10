const memo = document.getElementById('memo');
memo.value = localStorage.getItem('memo') || '';

function save() {
    localStorage.setItem('memo', memo.value);
    alert('保存しました！');
}