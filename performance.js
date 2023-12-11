// Function to fetch TSV data from the Google Sheet
async function fetchTSVData(url) {
    const response = await fetch(url);
    const text = await response.text();
    // Split the text into rows, then split each row into columns
    return text.split('\n').map(row => row.split('\t'));
}

// Function to create a table with the TSV data
function createTable(data) {
    const table = document.createElement('table');
    table.className = 'data-table'; // Add a class for CSS styling

    // Iterate over each row of data
    data.forEach((row, rowIndex) => {
        const tr = document.createElement('tr'); // Create a new table row

        // Iterate over each cell in the row
        row.forEach((cell, cellIndex) => {
            const cellElement = document.createElement(rowIndex === 0 ? 'th' : 'td');
            // Set the text content of the cell
            cellElement.textContent = cell;
            tr.appendChild(cellElement); // Append the cell to the row
        });

        table.appendChild(tr); // Append the row to the table
    });

    return table;
}

// Function to initialize the data fetching and table creation
function initializeTable() {
    // The URL should point to your TSV data
    const tsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTi_0g4fsZHLownRxEBfnrAGnzIHRLNOkqVN_ibgrUHDxhXD5WdL3LhlHnrEn0PnGivZjIvjQQ2UL7i/pub?gid=0&single=true&output=tsv'; // Replace with the actual URL

    fetchTSVData(tsvUrl).then(data => {
        const container = document.getElementById('data-container');
        container.innerHTML = ''; // Clear any existing content
        const table = createTable(data);
        container.appendChild(table); // Append the new table to the container
    });
}

// Event listener to run the initializeTable function after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeTable);
