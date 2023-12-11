// Function to fetch TSV data from the Google Sheet
async function fetchTSVData(url) {
    const response = await fetch(url);
    const text = await response.text();
    return text.split('\n').map(row => row.split('\t'));
}

// Function to check and parse image link
function checkAndParseImage(cell, td) {
    if (isImageLink(cell)) {
        const img = document.createElement('img');
        img.src = parseImageLink(cell);
        img.style.maxWidth = '100px'; // or any other size
        td.appendChild(img);
    } else {
        td.textContent = cell;
    }
}

// Function to create a table with the TSV data
function createTable(data) {
    const table = document.createElement('table');
    table.classList.add('data-table'); // Add class for styling

    data.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((cell, cellIndex) => {
            // Create header row
            if (rowIndex === 0 && cellIndex === 0) {
                const th = document.createElement('th');
                th.setAttribute('colspan', '3');
                th.textContent = cell;
                tr.appendChild(th);
            } else if (rowIndex === 1 && cellIndex === 0) {
                const th = document.createElement('th');
                th.setAttribute('colspan', '3');
                checkAndParseImage(cell, th);
                tr.appendChild(th);
            } else if (rowIndex >= 2) {
                if (cellIndex === 0) {
                    const td = document.createElement('td');
                    td.textContent = cell;
                    td.style.fontWeight = 'bold'; // Make it bold as per spec
                    tr.appendChild(td);
                } else if (cellIndex === 1) {
                    // Merging B-C columns horizontally
                    const td = document.createElement('td');
                    td.setAttribute('colspan', '2');
                    checkAndParseImage(cell, td);
                    tr.appendChild(td);
                }
                // Skip cellIndex 2 since it's merged with cellIndex 1
            }
        });
        table.appendChild(tr);
    });

    // Apply styles for merged cells containing bold text
    const boldMergedCells = [10, 16]; // Rows which have merged cells with bold text
    boldMergedCells.forEach(rowIndex => {
        const row = table.rows[rowIndex];
        if (row) {
            const cell = row.cells[0];
            cell.setAttribute('colspan', '3');
            cell.style.fontWeight = 'bold';
        }
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
        container.innerHTML = ''; // Clear previous content
        container.appendChild(table);
    });
}

// Call the initialize function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeTable);
