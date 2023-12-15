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
        // Check for merged cells
        if (cell.trim() === '' && lastNonEmptyCell[cellIndex] != null) {
            lastNonEmptyCell[cellIndex].rowSpan += 1; // Increment rowspan for merging
        } else {
            let td = document.createElement('td');

            // Handling the 4th column for the 'Preview' link
            if (cellIndex === 3 && isValidUrl(cell)) {
                let previewLink = document.createElement('a');
                previewLink.href = "#";
                previewLink.textContent = "Preview";
                previewLink.addEventListener('click', function(event) {
                    event.preventDefault();
                    openPreviewWindow(cell);
                });
                td.appendChild(previewLink);
            } else {
                // For other cells, just display the text
                td.textContent = cell;
            }

            // Add class to specific columns for styling (columns 2 and 3)
            if (cellIndex === 1 || cellIndex === 2) {
                td.classList.add(`column-${cellIndex + 1}`);
            }

            tr.appendChild(td);
            lastNonEmptyCell[cellIndex] = td; // Update the last non-empty cell for this column
        }
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
    const previewContainer = document.getElementById('preview-container');
    const encodedUrl = encodeURIComponent(url);

    // Adjust widths of table and preview areas
    document.querySelector('.table-area').style.width = '50%';
    document.querySelector('.preview-area').style.width = '50%';
    document.querySelector('.preview-area').style.display = 'block';

    previewContainer.innerHTML = `
        <div class="preview-content">
            <iframe src="${url}" width="100%" height="100%"></iframe>
            <button class="view-button" onclick="viewButtonClicked('${encodedUrl}')">View in New Tab</button>
            <button id="close-preview" class="close-preview" onclick="closePreviewWindow()">Close</button>
        </div>`;
}

function closePreviewWindow() {
    document.querySelector('.table-area').style.width = '100%';
    document.querySelector('.preview-area').style.display = 'none';
}

function viewButtonClicked(encodedUrl) {
    const url = decodeURIComponent(encodedUrl); // Decode the URL
    window.open(url, '_blank'); // Open the URL in a new tab
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}
