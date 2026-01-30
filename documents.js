const documentsForm = document.getElementById('documents-form');
const documentsList = document.getElementById('documents-list');

documentsForm.addEventListener('submit', async e => {
    e.preventDefault();
    const file = document.getElementById('document-file').files[0];
    if(!file) return alert('Select a file first!');

    const formData = new FormData();
    formData.append('file', file);

    try {
        const res = await fetch('https://your-backend.onrender.com/upload', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if(res.ok) {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${data.downloadUrl}" target="_blank">${file.name}</a>`;
            documentsList.appendChild(li);
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error(err);
        alert('Upload failed');
    }
});
