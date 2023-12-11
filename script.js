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

    container.innerHTML = '';

    const table = document.createElement('table');
    const tableHead = document.createElement('thead');
    const tableBody = document.createElement('tbody');
    table.appendChild(tableHead);
    table.appendChild(tableBody);

    // Create header row
    let headerRow = document.createElement('tr');
    data[0].forEach(header => {
        let th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);

    // Create table body
    data.slice(1).forEach((row, rowIndex) => {
        let tr = document.createElement('tr');
        row.forEach((cell, cellIndex) => {
            if (rowIndex === 1 && cellIndex === 0) {
                // Handle the merged cell for the image
                let td = document.createElement('td');
                td.setAttribute('colspan', '3');
                if (isValidUrl(cell)) {
                    let img = document.createElement('img');
                    img.src = cell;
                    img.style.maxWidth = '100px'; // Set a max width for the image
                    td.appendChild(img);
                } else {
                    td.textContent = cell;
                }
                tr.appendChild(td);
            } else if (!(rowIndex === 1 && (cellIndex === 1 || cellIndex === 2))) {
                // Skip adding cells for B and C in the second row
                let td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            }
        });
        tableBody.appendChild(tr);
    });

    container.appendChild(table);
}
function parseTSV(tsvData) {
    // Split the TSV data into lines and then cells using tab as the delimiter
    return tsvData.split('\n').map(row => row.split('\t'));
}

function openPreviewWindow(url) {
    let modal = document.getElementById('preview-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'preview-modal';
        document.body.appendChild(modal);
    }

    const encodedUrl = encodeURIComponent(url); // Encode the URL

    modal.innerHTML = `
        <div class="modal-content">
            <iframe src="${url}" width="100%" height="calc(100% - 60px)"></iframe>
            <span class="close-modal" onclick="closePreviewWindow()">&times;</span>
            <button class="view-button" onclick="viewButtonClicked('${encodedUrl}')">View</button>
        </div>`;

    modal.style.display = 'block';
}

function viewButtonClicked(encodedUrl) {
    const url = decodeURIComponent(encodedUrl); // Decode the URL
    window.open(url, '_blank');
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
