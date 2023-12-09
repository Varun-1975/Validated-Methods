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
    data.slice(1).forEach((row, rowIndex) => {
        let tr = document.createElement('tr');
        row.forEach((cell, cellIndex) => {
            if (cell.trim() === '' && lastNonEmptyCell[cellIndex] != null) {
                // Increment rowspan for the last non-empty cell in this column
                lastNonEmptyCell[cellIndex].rowSpan += 1;
            } else {
                // This cell has content, so create a td and reset the rowspan count
                let td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
                lastNonEmptyCell[cellIndex] = td; // This becomes the last non-empty cell
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
