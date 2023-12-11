// Function to fetch TSV data from the Google Sheet
async function fetchTSVData(url) {
    const response = await fetch(url);
    const text = await response.text();
    return text.split('\n').map(row => row.split('\t'));
}

// Function to create a table with the TSV data
function createTable(data) {
    const table = document.createElement('table');
    let previousCells = [];

    data.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((cell, cellIndex) => {
            // For the first row, create a header
            if (rowIndex === 0) {
                const th = document.createElement('th');
                th.textContent = cell;
                tr.appendChild(th);
                previousCells[cellIndex] = th;
            } else {
                // If the cell is not empty or it's the first column, create a new cell
                if (cell !== '' || cellIndex === 0) {
                    const td = document.createElement('td');
                    if (isImageLink(cell)) {
                        const img = document.createElement('img');
                        img.src = parseImageLink(cell);
                        td.appendChild(img);
                    } else {
                        td.textContent = cell;
                    }
                    tr.appendChild(td);
                    previousCells[cellIndex] = td;
                } else {
                    // If the cell is empty, increment the rowSpan of the previous cell in the same column
                    if (previousCells[cellIndex]) {
                        previousCells[cellIndex].rowSpan = (previousCells[cellIndex].rowSpan || 1) + 1;
                    }
                }
            }
        });
        table.appendChild(tr);
    });

    return table;
}

// Helper function to check if a string is an image link
function isImageLink(str) {
    return str.includes('cdn.discordapp.com/attachments/');
}

// Function to parse the provided image link format
function parseImageLink(link) {
    const baseUrl = link.split('?')[0];
    return baseUrl;
}

// Function to initialize the data fetching and table creation
function initializeTable() {
    const container = document.getElementById('data-container');
    const tsvUrl = container.getAttribute('data-sheet-url');
    fetchTSVData(tsvUrl).then(data => {
        const table = createTable(data);
        container.appendChild(table);
    });
}

// Call the initialize function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeTable);
