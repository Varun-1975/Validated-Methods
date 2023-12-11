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
    let mergeCounts = [];

    data.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((cell, cellIndex) => {
            let td;

            // Check for the first row to create table header
            if (rowIndex === 0) {
                td = document.createElement('th');
                td.textContent = cell;
            } else {
                td = document.createElement('td');

                // Handle vertical merged cells
                if (cell === '' && previousCells[cellIndex]) {
                    mergeCounts[cellIndex]++;
                    previousCells[cellIndex].rowSpan = mergeCounts[cellIndex];
                    return;
                } else {
                    mergeCounts[cellIndex] = 1;
                }

                // Check if the cell contains an image link and handle it
                if (isImageLink(cell)) {
                    const img = document.createElement('img');
                    img.src = parseImageLink(cell);
                    td.appendChild(img);
                } else {
                    td.textContent = cell;
                }
            }

            tr.appendChild(td);
            previousCells[cellIndex] = td;
        });

        // Apply bold formatting if 3 cells are vertically merged
        previousCells.forEach((cell, index) => {
            if (mergeCounts[index] === 3) {
                cell.style.fontWeight = 'bold';
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
