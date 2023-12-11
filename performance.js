// Function to fetch TSV data from the Google Sheet
async function fetchTSVData(url) {
    const response = await fetch(url);
    const text = await response.text();
    return text.split('\n').map(row => row.split('\t'));
}

// Function to create a table with the TSV data
function createTable(data) {
    const table = document.createElement('table');
    table.className = 'data-table'; // Add a class for CSS styling

    data.forEach((row) => {
        const tr = document.createElement('tr'); // Create a new table row
        let previousCell = null; // To keep track of the last non-empty cell

        row.forEach((cell) => {
            if (cell.trim() === '') {
                // If the cell is empty, increase the colspan of the previous cell
                if (previousCell) previousCell.colSpan += 1;
            } else {
                // If the cell is not empty, create a new cell
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td); // Append the cell to the row
                previousCell = td; // Set this cell as the last non-empty cell
            }
        });

        table.appendChild(tr); // Append the row to the table
    });

    return table;
}

// Function to initialize the data fetching and table creation
function initializeTable() {
    // The URL should point to your TSV data
    const tsvUrl = 'https://example.com/path/to/your/data.tsv'; // Replace with the actual URL

    fetchTSVData(tsvUrl).then(data => {
        const container = document.getElementById('data-container');
        container.innerHTML = ''; // Clear any existing content
        const table = createTable(data);
        container.appendChild(table); // Append the new table to the container
    });
}

// Event listener to run the initializeTable function after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeTable);
