// Function to fetch TSV data from the Google Sheet
async function fetchTSVData(url) {
    const response = await fetch(url);
    const text = await response.text();
    return text.split('\n').map(row => row.split('\t'));
}

// Function to create a table with the TSV data
function createTable(data) {
    const table = document.createElement('table');
    let previousCell = null;
    let mergeCount = 0;

    data.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((cell, cellIndex) => {
            // Handling horizontal merged cells
            if (cell === previousCell) {
                mergeCount++;
                return;
            } else if (mergeCount > 0) {
                previousCell.colSpan = mergeCount + 1;
                mergeCount = 0;
            }

            const td = document.createElement('td');
            // Check if the cell contains an image link and handle it
            if (isImageLink(cell)) {
                const img = document.createElement('img');
                img.src = parseImageLink(cell);
                td.appendChild(img);
            } else {
                td.textContent = cell;
            }

            tr.appendChild(td);
            previousCell = td;
        });
        // Reset for next row
        previousCell = null;
        mergeCount = 0;
        table.appendChild(tr);
    });

    // Final check for the last cell in the table
    if (mergeCount > 0) {
        previousCell.colSpan = mergeCount + 1;
    }

    return table;
}

// Helper function to check if a string is an image link
function isImageLink(str) {
    return str.includes('cdn.discordapp.com/attachments/');
}

// Function to parse the provided image link format
function parseImageLink(link) {
    // Adjust the parsing logic based on the provided link format
    const baseUrl = link.split('?')[0];
    return baseUrl;
}

// Example usage
const tsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTi_0g4fsZHLownRxEBfnrAGnzIHRLNOkqVN_ibgrUHDxhXD5WdL3LhlHnrEn0PnGivZjIvjQQ2UL7i/pub?gid=0&single=true&output=tsv';
fetchTSVData(tsvUrl).then(data => {
    const table = createTable(data);
    document.body.appendChild(table);
});
