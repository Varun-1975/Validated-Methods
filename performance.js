// Function to fetch TSV data from the Google Sheet
async function fetchTSVData(url) {
    const response = await fetch(url);
    const text = await response.text();
    return text.split('\n').map(row => row.split('\t'));
}

// Helper function to check if a string is an image link
function isImageLink(str) {
    return str.startsWith('https://cdn.discordapp.com/attachments/');
}

// Function to create a table with the TSV data
function createTable(data) {
    const table = document.createElement('table');
    table.className = 'data-table'; // Add a class for CSS styling

    // Create the header row
    const headerRow = document.createElement('tr');
    let previousHeaderCell = null; // Keep track of the previous non-empty header cell for merging
    data[0].forEach((header, index) => {
        if (index > 0 && header.trim() === '' && previousHeaderCell) {
            // Increase the colspan for merged header cells
            previousHeaderCell.colSpan += 1;
        } else {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
            previousHeaderCell = th; // Update the last non-empty header cell
        }
    });
    table.appendChild(headerRow);

    // Process the rest of the data starting from the second row
    data.slice(1).forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        let previousCell = null; // To keep track of the last non-empty cell for merging

        row.forEach((cell, cellIndex) => {
            if (cell.trim() === '') {
                // If the cell is empty, increase the colspan of the previous cell
                if (previousCell) previousCell.colSpan += 1;
            } else {
                const cellTagName = rowIndex === 0 && cellIndex === 0 ? 'th' : 'td';
                const cellElement = document.createElement(cellTagName);
                
                // Set the text content or create an image for the cell
                if (rowIndex === 0 && isImageLink(cell)) {
                    const img = document.createElement('img');
                    img.src = cell;
                    img.alt = 'Image';
                    img.style.maxWidth = '100%';
                    img.style.height = 'auto';
                    cellElement.appendChild(img);
                } else {
                    cellElement.textContent = cell;
                }

                tr.appendChild(cellElement); // Append the cell to the row
                previousCell = cellElement; // Set this cell as the last non-empty cell
            }
        });

        table.appendChild(tr); // Append the row to the table
    });

    return table;
}

// Function to initialize the data fetching and table creation
function initializeTable() {
    const tsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTi_0g4fsZHLownRxEBfnrAGnzIHRLNOkqVN_ibgrUHDxhXD5WdL3LhlHnrEn0PnGivZjIvjQQ2UL7i/pub?gid=0&single=true&output=tsv'; // Replace with the actual URL to your TSV data

    fetchTSVData(tsvUrl).then(data => {
        const container = document.getElementById('data-container');
        container.innerHTML = ''; // Clear any existing content
        const table = createTable(data);
        container.appendChild(table); // Append the new table to the container
    });
}

// Event listener to run the initializeTable function after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeTable);
