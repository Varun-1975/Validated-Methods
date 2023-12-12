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

// Function to check if a string contains an HTML image tag
function isImageTag(str) {
    return str.includes('<img');
}

// Function to extract the image URL from an HTML image tag
function extractImageUrl(imageTag) {
    const matches = imageTag.match(/src="([^"]+)"/);
    return matches ? matches[1] : '';
}

// Function to create a table with the TSV data
function createTable(data) {
    const table = document.createElement('table');
    table.className = 'data-table'; // Add a class for CSS styling

    // Create the header row
    const headerRow = document.createElement('tr');
    let previousHeaderCell = null; // Keep track of the previous non-empty header cell for merging
    data[0].forEach((header, index) => {
        const th = document.createElement('th');
        th.textContent = header;
        th.style.textAlign = 'center'; // Center the text in the header row
        th.style.fontWeight = 'bold';   // Make the header text bold

        if (index > 0 && header.trim() === '' && previousHeaderCell) {
            previousHeaderCell.colSpan += 1; // Increase the colspan for merged header cells
        } else {
            headerRow.appendChild(th);
            previousHeaderCell = th; // Update the last non-empty header cell
        }
    });
    table.appendChild(headerRow);

    // Process the rest of the data starting from the second row
    data.slice(1).forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        let previousCell = null;

        row.forEach((cell, cellIndex) => {
            const td = document.createElement('td');

            // Check if the cell contains an img tag
            if (cell.includes('<img')) {
                // Create a div to hold the HTML content
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = cell.trim();
                const img = tempDiv.firstChild;
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                td.appendChild(img);
            } else {
                td.textContent = cell;
                if (cellIndex === 0) {
                    td.style.fontWeight = 'bold';
                }
            }

            // Apply styles and merging logic
            if (cell.trim() === '') {
                if (previousCell) {
                    previousCell.colSpan += 1;
                    if (previousCell.colSpan === 3) {
                        applyStylesToCell(previousCell); // Apply styles if colspan is 3
                    }
                }
            } else {
                tr.appendChild(td);
                previousCell = td;
            }
        });

        table.appendChild(tr); // Append the row to the table
    });

    return table;
}

// Function to apply styles to a cell
function applyStylesToCell(cell) {
    cell.style.textAlign = 'center'; // Center the text
    cell.style.fontWeight = 'bold';   // Make the text bold
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
