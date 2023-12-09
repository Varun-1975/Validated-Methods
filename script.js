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
    dataArray.forEach(item => {
        // Create elements for each item and append to container
        // Example: Create a div for each row
        const dataDiv = document.createElement('div');
        dataDiv.className = 'data-row';
        dataDiv.textContent = JSON.stringify(item); // Format as needed
        container.appendChild(dataDiv);
    });
}