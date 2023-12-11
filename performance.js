// Function to fetch TSV data from the Google Sheet
async function fetchTSVData(url) {
    const response = await fetch(url);
    const text = await response.text();
    const rows = text.split('\n').map(row => row.split('\t'));
    return rows;
}

// Helper function to create a cell and append it to the row
function createCell(row, tagName, text, colSpan, isBold) {
    const cell = document.createElement(tagName);
    if (isImageLink(text)) {
        const img = document.createElement('img');
        img.src = parseImageLink(text);
        img.style.width = '200px'; // Set the desired width
        img.style.height = 'auto'; // Height will be set automatically
        img.style.display = 'block'; // Use block display to apply margin
        img.style.margin = 'auto'; // Center the image within the cell
        cell.appendChild(img);
    } else {
        cell.textContent = text;
    }
    if (colSpan) {
        cell.setAttribute('colspan', colSpan);
    }
    if (isBold) {
        cell.style.fontWeight = 'bold';
    }
    if (tagName === 'th') {
        cell.style.textAlign = 'center'; // Center the text in header cells
    }
    row.appendChild(cell);
}

// Function to create a table with the TSV data
function createTable(data) {
    const table = document.createElement('table');
    data.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((cell, cellIndex) => {
            let tagName = 'td';
            let colSpan = null;
            let isBold = false;

            // Determine if the current cell should be created based on specific merge patterns
            if (rowIndex === 0 && cellIndex === 0) {
                // Merged title cell A1:C1
                colSpan = 3;
                isBold = true;
                createCell(tr, 'th', cell, colSpan, isBold);
            } else if (rowIndex === 1 && cellIndex === 0) {
                // Merged image cell A2:C2
                colSpan = 3;
                createCell(tr, tagName, cell, colSpan, isBold);
            } else if (rowIndex >= 2 && cellIndex === 0) {
                // Column A cells should be bold
                isBold = true;
                createCell(tr, tagName, cell, colSpan, isBold);
            } else if (rowIndex >= 2 && cellIndex === 1) {
                // Cells B3:C3 to B21:C21 are merged horizontally
                colSpan = 2;
                createCell(tr, tagName, cell, colSpan, isBold);
            } else if ((rowIndex === 10 || rowIndex === 16) && cellIndex === 0) {
                // Merged bold cells A10:C10 and A16:C16
                colSpan = 3;
                isBold = true;
                createCell(tr, 'th', cell, colSpan, isBold);
            }
            // Cells in column C are skipped because they are merged with column B
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
        // Clear previous content
        container.innerHTML = '';
        // Create and append the new table
        const table = createTable(data);
        container.appendChild(table);
    });
}

// Call the initialize function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeTable);
