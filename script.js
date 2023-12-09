document.addEventListener('DOMContentLoaded', function() {
    fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTW_hkDjkw6dtvyE2IkMAORsWlmZVUZi4rVr7Rnx5tQU1iVV4M--nbSGh4VXZbF9PCx2X8Q9ZQSgKIC/pub?gid=1992089391&single=true&output=tsv')
        .then(response => response.text())
        .then(data => {
            const dataArray = parseTSV(data);
            displayData(dataArray);
        }).catch(error => {
            console.error('Error fetching data: ', error);
        });
});

function parseTSV(tsv) {
    const lines = tsv.trim().split('\n');
    const headers = lines.shift().split('\t');

    return lines.map(line => {
        const data = line.split('\t');
        return headers.reduce((obj, nextKey, index) => {
            obj[nextKey] = data[index];
            return obj;
        }, {});
    });
}

function displayData(dataArray) {
    const container = document.getElementById('data-container');
    if (!container) {
        console.error('Data container element not found');
        return;
    }

    // Create a table
    const table = document.createElement('table');
    
    // Optional: Create a header row based on keys from the first data object
    const headerRow = document.createElement('tr');
    Object.keys(dataArray[0]).forEach(key => {
        const headerCell = document.createElement('th');
        headerCell.textContent = key;
        headerRow.appendChild(headerCell);
    });
    table.appendChild(headerRow);

    // Create a row for each data object
    dataArray.forEach(item => {
        const row = document.createElement('tr');
        Object.values(item).forEach(value => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        });
        table.appendChild(row);
    });

    container.appendChild(table);
}
