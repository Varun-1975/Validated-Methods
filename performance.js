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
            // Create the header row with merged cells
            if (rowIndex === 0 && cellIndex === 0) {
                const th = document.createElement('th');
                th.setAttribute('colspan', '3');
                th.textContent = cell;
                th.style.textAlign = 'center';
                th.style.fontWeight = 'bold';
                tr.appendChild(th);
                return; // Skip the rest of the cells in the header row
            }

            // Handle the image row with merged cells
            if (rowIndex === 1 && cellIndex === 0) {
                const th = document.createElement('th');
                th.setAttribute('colspan', '3');
                const img = document.createElement('img');
                img.src = parseImageLink(cell);
                img.style.display = 'block';
                img.style.marginLeft = 'auto';
                img.style.marginRight = 'auto';
                img.style.width = '200px'; // Set the image size
                th.appendChild(img);
                tr.appendChild(th);
                return; // Skip the rest of the cells in the image row
            }

            // Skip cells that are meant to be merged
            if (rowIndex > 1 && cellIndex > 0) return;

            // Handle bold cells and merged cells for the rest of the table
            const td = document.createElement('td');
            if (cellIndex === 0) {
                td.style.fontWeight = 'bold'; // Bold for the first column
            }
            if (rowIndex > 1 && cellIndex === 1) {
                td.setAttribute('colspan', '2'); // Merge horizontally for specified cells
            }
            td.textContent = cell;
            tr.appendChild(td);
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
