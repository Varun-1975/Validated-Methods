document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('data-container');
    if (!container) {
        console.error('Data container element not found');
        return;
    }

    const sheetUrl = container.getAttribute('data-sheet-url');
    if (sheetUrl) {
        loadTableFromSheet(sheetUrl);
    } else {
        console.error('No data-sheet-url found');
    }
});

async function loadTableFromSheet(url) {
    const response = await fetch(url);
    const tsvData = await response.text();
    const data = parseTSV(tsvData);

    const container = document.getElementById('data-container');
    if (!container) {
        console.error('Data container element not found');
        return;
    }

    // Clear existing data
    container.innerHTML = '';

    // Create table elements
    const table = document.createElement('table');
    const tableHead = document.createElement('thead');
    const tableBody = document.createElement('tbody');
    table.appendChild(tableHead);
    table.appendChild(tableBody);

    // Initialize an array to keep track of the last non-empty cell for each column
    let lastNonEmptyCell = Array(data[0].length).fill(null);

    // Create header row
    let headerRow = document.createElement('tr');
    data[0].forEach(header => {
        let th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);

    // Create table body and handle merged cells
    data.slice(1).forEach(row => {
    let tr = document.createElement('tr');
    row.forEach((cell, cellIndex) => {
        let td = document.createElement('td');

        // Check if the current cell is from the URL column (5th column)
        if (cellIndex === 4 && isValidUrl(cell)) {
            console.log("URL found:", cell);
            let previewLink = document.createElement('a');
            previewLink.href = "#"; // Prevent default link behavior
            previewLink.textContent = "Preview";
            previewLink.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default link behavior
                openPreviewWindow(cell); // Open the preview window with the URL
            });
            td.appendChild(previewLink);
        } else {
            td.textContent = cell; // For other cells, just display the text
        }

        tr.appendChild(td);
    });
    tableBody.appendChild(tr);
});
    // Append the table to the container
    container.appendChild(table);
}

function parseTSV(tsvData) {
    // Split the TSV data into lines and then cells using tab as the delimiter
    return tsvData.split('\n').map(row => row.split('\t'));
}

function openPreviewWindow(url) {
    console.log("Opening URL:", url);
    // Create the modal container if it doesn't exist
    let modal = document.getElementById('preview-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'preview-modal';
        document.body.appendChild(modal);
    }

    // Set the content of the modal
    modal.innerHTML = `<iframe src="${url}" width="100%" height="400px"></iframe>
                       <button onclick="closePreviewWindow()">Close</button>`;

    // Display the modal
    modal.style.display = 'block';
}

function closePreviewWindow() {
    const modal = document.getElementById('preview-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}
