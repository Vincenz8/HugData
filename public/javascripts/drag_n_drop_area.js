// Select the drop area and the file input
const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('datasetFile');

// Prevent default behaviors for drag events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
    dropArea.addEventListener(event, e => e.preventDefault());
    dropArea.addEventListener(event, e => e.stopPropagation());
});

// Add 'dragging' class on dragover
dropArea.addEventListener('dragover', () => {
    dropArea.classList.add('dragging');
});

// Remove 'dragging' class on dragleave or drop
['dragleave', 'drop'].forEach(event => {
    dropArea.addEventListener(event, () => {
        dropArea.classList.remove('dragging');
    });
});

// Handle file drop
dropArea.addEventListener('drop', (e) => {
    // Get the dropped files
    const files = e.dataTransfer.files;
    // Assign the file to the file input
    fileInput.files = files;
    // Display the selected file name in the drop area
    if (files.length > 0) {
        dropArea.querySelector('p').textContent = `Selected file: ${files[0].name}`;
    }
});

// Allow click to trigger file input
dropArea.addEventListener('click', () => {
    fileInput.click();
});

// Handle file input change event (if user clicks to select file)
fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    // Optionally, display the selected file name in the drop area
    if (files.length > 0) {
        dropArea.querySelector('p').textContent = `Selected file: ${files[0].name}`;
    }
});