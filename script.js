//new.js
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
    data.slice(1).forEach(row => {
    let tr = document.createElement('tr');
    row.forEach((cell, cellIndex) => {
        // Check for merged cells
        if (cell.trim() === '' && lastNonEmptyCell[cellIndex] != null) {
            lastNonEmptyCell[cellIndex].rowSpan += 1; // Increment rowspan for merging
        } else {
            let td = document.createElement('td');

            // Handling the 4th column for the 'Preview' link
            if (cellIndex === 3 && isValidUrl(cell)) {
                let previewLink = document.createElement('a');
                previewLink.href = "#";
                previewLink.textContent = "Preview";
                previewLink.addEventListener('click', function(event) {
                    event.preventDefault();
                    openPreviewWindow(cell);
                });
                td.appendChild(previewLink);
            } else {
                // For other cells, just display the text
                td.textContent = cell;
            }

            // Add class to specific columns for styling (columns 2 and 3)
            if (cellIndex === 1 || cellIndex === 2) {
                td.classList.add(`column-${cellIndex + 1}`);
            }

            tr.appendChild(td);
            lastNonEmptyCell[cellIndex] = td; // Update the last non-empty cell for this column
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

async function fetchTSVData(url) {
    const response = await fetch(url);
    const text = await response.text();
    return text.split('\n').map(row => row.split('\t'));
}

// Helper function to check if a string is an image link
function isImageLink(str) {
    return str.startsWith('https://go.drugbank.com/structures/');
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
        let previousCell = null; // To keep track of the last non-empty cell for merging

        row.forEach((cell, cellIndex) => {
            const td = document.createElement('td');
            
            // Set the text content or create an image for the cell
            if (rowIndex === 0 && isImageLink(cell)) {
                const img = document.createElement('img');
                img.src = cell;
                img.alt = 'Image';
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                td.appendChild(img);
	    }
            //Open in new Tab
	    if (rowIndex === 0 && newTabOpen(cell)) {
                let openLink = document.createElement('a');
                openLink.href = "#";
                openLink.textContent = "View in New Tab";
                openLink.addEventListener('click', function(event) {
                    event.preventDefault();
                    openNewTab(cell);
                });
                td.appendChild(previewLink);
            } else {
                td.textContent = cell;
                // Make the first column bold
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

function openNewTab(url) {
    window.open(url, '_blank'); // Open the URL in a new tab
}

// Function to apply styles to a cell
function applyStylesToCell(cell) {
    cell.style.textAlign = 'center'; // Center the text
    cell.style.fontWeight = 'bold';   // Make the text bold
}
// Function to initialize the data fetching and table creation
function initializeTable() {
    // Retrieve the URL from the data-sheet-url attribute of the data-container element
    const container = document.getElementById('data-container');
    const tsvUrl = container.getAttribute('data-sheet-url');

    fetchTSVData(tsvUrl).then(data => {
        container.innerHTML = ''; // Clear any existing content
        const table = createTable(data);
        container.appendChild(table); // Append the new table to the container
    });
}


function openPreviewWindow(url) {
    const previewContainer = document.getElementById('preview-container');

    // Clear existing content
    previewContainer.innerHTML = '';

    // Fetch TSV data and create a table
    fetchTSVData(url).then(data => {
        const table = createTable(data);
        previewContainer.appendChild(table);
    });

    // Adjust styles for preview area
    const previewArea = document.querySelector('.preview-area');
    previewArea.style.display = 'block';
    previewArea.style.width = '50%'; // Adjust as needed
    previewArea.style.flex = '1';

    // Adjust styles for table area
    const tableArea = document.querySelector('.table-area');
    tableArea.style.flex = '1';

}

function closePreviewWindow() {

    // Adjust styles to hide preview area
    const previewArea = document.querySelector('.preview-area');
    previewArea.style.display = 'none';
    previewArea.style.width = '0';
    previewArea.style.flex = '0';

    // Reset table area styles
    const tableArea = document.querySelector('.table-area');
    tableArea.style.flex = '1';
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}
