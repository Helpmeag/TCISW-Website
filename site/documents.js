const MAX_PDF_SIZE = 5 * 1024 * 1024; // 5MB
const docStatus = document.getElementById("docStatus");
const docList = document.getElementById("docList");

document.getElementById("uploadDocBtn").onclick = async () => {
    const fileInput = document.getElementById("docFile");
    const titleInput = document.getElementById("docTitle").value.trim();
    if(!titleInput || !fileInput.files[0]) return alert("Title or file missing.");

    const file = fileInput.files[0];
    if(file.size > MAX_PDF_SIZE) return alert("Max PDF size is 5MB");

    // compress file locally (browser gzip)
    const compressed = await compressFile(file);

    // store in localStorage (private to browser)
    const key = `pdf_${Date.now()}`;
    localStorage.setItem(key, JSON.stringify({
        title: titleInput,
        name: file.name,
        type: file.type,
        data: Array.from(new Uint8Array(compressed))
    }));

    docStatus.textContent = "PDF compressed & stored locally. Ready for upload to Backblaze B2.";
    renderDocs();
};

async function compressFile(file) {
    const stream = file.stream().pipeThrough(new CompressionStream("gzip"));
    const response = new Response(stream);
    return await response.arrayBuffer();
}

function renderDocs() {
    docList.innerHTML = "";
    Object.keys(localStorage).forEach(key => {
        if(key.startsWith("pdf_")){
            const item = JSON.parse(localStorage.getItem(key));
            docList.innerHTML += `<div><strong>${item.title}</strong> (${item.name})</div>`;
        }
    });
}

renderDocs();
