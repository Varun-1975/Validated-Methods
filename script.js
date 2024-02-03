document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('data-container');
    if (!container) {
        console.error('Data container element not found');
        return;
    }

    const sheetUrl = container.getAttribute('data-sheet-url');
    if (sheetUrl) {
        fetchTSVData(sheetUrl).then(data => {
            container.innerHTML = ''; // Clear any existing content
            container.appendChild(createTable(data)); // Append the new table to the container
        });
    } else {
        console.error('No data-sheet-url found');
    }
});

async function fetchTSVData(url) {
    const response = await fetch(url);
    const text = await response.text();
    return parseTSV(text);
}

function parseTSV(tsvData) {
    return tsvData.split('\n').map(row => row.split('\t'));
}

function createTable(data) {
    const fragment = document.createDocumentFragment();
    const table = document.createElement('table');
    table.className = 'data-table';

    const headerRow = document.createElement('tr');
    data[0].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        th.style.textAlign = 'center';
        th.style.fontWeight = 'bold';
        headerRow.appendChild(th);
    });
    fragment.appendChild(headerRow);

    data.slice(1).forEach(row => {
        const tr = document.createElement('tr');
        row.forEach((cell, cellIndex) => {
            const td = document.createElement('td');
            td.textContent = cell;
            if (cellIndex === 0) {
                td.style.fontWeight = 'bold';
            }
            tr.appendChild(td);
        });
        fragment.appendChild(tr);
    });

    table.appendChild(fragment);
    return table;
}

function openPreviewWindow(url) {
    const previewContainer = document.getElementById('preview-container');
    previewContainer.innerHTML = '';

    fetchTSVData(url).then(data => {
        previewContainer.appendChild(createTable(data));
    });

    adjustPreviewStyles(true);
}

function closePreviewWindow() {
    adjustPreviewStyles(false);
}

function adjustPreviewStyles(isPreviewOpen) {
    const previewArea = document.querySelector('.preview-area');
    const tableArea = document.querySelector('.table-area');

    if (isPreviewOpen) {
        previewArea.style.display = 'block';
        previewArea.style.width = '50%';
        previewArea.style.flex = '1';
        tableArea.style.flex = '1';
    } else {
        previewArea.style.display = 'none';
        previewArea.style.width = '0';
        previewArea.style.flex = '0';
        tableArea.style.flex = '1';
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

// Additional helper functions, if any, can go here.
