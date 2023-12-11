// Function to fetch TSV data from the Google Sheet
async function fetchTSVData(url) {
    const response = await fetch(url);
    const text = await response.text();
    return text.split('\n').map(row => row.split('\t'));
}

// Function to create a table with the TSV data
function createTable(data) {
    const table = document.createElement('table');

    data.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');

        row.forEach((cell, cellIndex) => {
            // Skip cells that are supposed to be merged with previous cells
            if (shouldSkipCell(rowIndex, cellIndex)) {
                return;
            }

            let cellElement = document.createElement(rowIndex === 0 ? 'th' : 'td');
            if (rowIndex === 0 || rowIndex === 2) {
                cellElement.colSpan = 3; // Merging A1-C1 and A2-C2
            } else if ((rowIndex >= 3 && rowIndex <= 9) || (rowIndex >= 11 && rowIndex <= 14) || (rowIndex >= 17 && rowIndex <= 21)) {
                cellElement.colSpan = 2; // Merging B-C for specified rows
            }

            // Handle special formatting for certain cells
            if ((rowIndex === 10 || rowIndex === 16) && cellIndex === 0) {
                cellElement.colSpan = 3; // Merging A-C for specific rows
                cellElement.style.fontWeight = 'bold'; // Making it bold
            } else if (cellIndex === 0) {
                cellElement.style.fontWeight = 'bold'; // Making A column bold except merged cells
            }

            // Insert the image if the cell contains an image link
            if (isImageLink(cell)) {
                const img = document.createElement('img');
                img.src = parseImageLink(cell);
                cellElement.appendChild(img);
            } else {
                cellElement.textContent = cell;
            }

            tr.appendChild(cellElement);
        });

        table.appendChild(tr);
    });

    return table;
}

// Helper function to determine if a cell should be skipped due to horizontal merging
function shouldSkipCell(rowIndex, cellIndex) {
    // Define the cells that are merged and should be skipped
    const skipCells = {
        3: [1, 2], 4: [1, 2], 5: [1, 2], 6: [1, 2], 7: [1, 2], 8: [1], 9: [1],
        11: [1, 2], 12: [1, 2], 13: [1, 2], 14: [1, 2],
        17: [1, 2], 18: [1, 2], 19: [1, 2], 20: [1, 2], 21: [1, 2]
    };
    return skipCells[rowIndex] && skipCells[rowIndex].includes(cellIndex);
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
