const MAX_PNG_SIZE = 1 * 1024 * 1024; // 1MB
const imgStatus = document.getElementById("imgStatus");
const imgList = document.getElementById("imgList");

document.getElementById("uploadImgBtn").onclick = async () => {
    const fileInput = document.getElementById("imgFile");
    const titleInput = document.getElementById("imgTitle").value.trim();
    if(!titleInput || !fileInput.files[0]) return alert("Title or file missing.");

    const file = fileInput.files[0];
    if(file.size > MAX_PNG_SIZE) return alert("Max PNG size is 1MB");

    // read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // simple XOR encryption for storage (lightweight, reversible)
    const encrypted = new Uint8Array(arrayBuffer.byteLength);
    const key = 123; // trivial key
    const view = new Uint8Array(arrayBuffer);
    for(let i=0;i<view.length;i++) encrypted[i] = view[i]^key;

    // store locally
    const storeKey = `png_${Date.now()}`;
    localStorage.setItem(storeKey, JSON.stringify({
        title: titleInput,
        name: file.name,
        type: file.type,
        data: Array.from(encrypted)
    }));

    imgStatus.textContent = "PNG encrypted & stored locally. Ready for upload.";
    renderImages();
};

function renderImages() {
    imgList.innerHTML = "";
    Object.keys(localStorage).forEach(key => {
        if(key.startsWith("png_")){
            const item = JSON.parse(localStorage.getItem(key));
            imgList.innerHTML += `<div><strong>${item.title}</strong> (${item.name})</div>`;
        }
    });
}

renderImages();
