// Function to fetch TSV data from the Google Sheet
async function fetchTSVData(url) {
    const response = await fetch(url);
    const text = await response.text();
    return text.split('\n').map(row => row.split('\t'));
}

// Helper function to check if a string is an image link
function isImageLink(str) {
    // Here we're checking if the string is a link to an image based on the provided pattern
    return str.startsWith('https://cdn.discordapp.com/attachments/');
}

// Function to create a table with the TSV data
function createTable(data) {
    const table = document.createElement('table');
    table.className = 'data-table'; // Add a class for CSS styling

    // Create the header row
    const headerRow = document.createElement('tr');
    data[0].forEach((header) => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Start with the second row, since the first row is the header
    data.slice(1).forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        let previousCell = null;

        row.forEach((cell, cellIndex) => {
            if (rowIndex === 0 && cellIndex === 0) {
                // Skip the first cell of the second row, since it's an image
                const td = document.createElement('td');
                td.colSpan = row.length;
                const img = document.createElement('img');
                img.src = cell;
                img.alt = 'Image';
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                td.appendChild(img);
                tr.appendChild(td);
            } else if (cell.trim() === '') {
                if (previousCell) previousCell.colSpan += 1;
            } else {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
                previousCell = td;
            }
        });

        table.appendChild(tr);
    });

    return table;
}

// Function to initialize the data fetching and table creation
function initializeTable() {
    const tsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTi_0g4fsZHLownRxEBfnrAGnzIHRLNOkqVN_ibgrUHDxhXD5WdL3LhlHnrEn0PnGivZjIvjQQ2UL7i/pub?gid=0&single=true&output=tsv'; // Replace with the actual URL

    fetchTSVData(tsvUrl).then(data => {
        const container = document.getElementById('data-container');
        container.innerHTML = '';
        const table = createTable(data);
        container.appendChild(table);
    });
}

// Event listener to run the initializeTable function after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeTable);
