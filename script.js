document.addEventListener('DOMContentLoaded', () => {
    initializeTable();
});

async function fetchTSVData(url) {
    const response = await fetch(url);
    const text = await response.text();
    return text.split('\n').map(row => row.split('\t'));
}

function createTable(data) {
    const table = document.createElement('table');
    table.className = 'data-table';
    
    const headerRow = document.createElement('tr');
    data[0].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    data.slice(1).forEach(row => {
        const tr = document.createElement('tr');
        row.forEach((cell, index) => {
            const td = document.createElement('td');

            if (index === 3 && isValidUrl(cell)) {
                // Create a 'Preview' link for the 4th column
                const previewLink = document.createElement('a');
                previewLink.href = "#";
                previewLink.textContent = "Preview";
                previewLink.classList.add('preview-link');
                previewLink.setAttribute('data-url', cell);
                td.appendChild(previewLink);
            } else {
                td.textContent = cell;
            }

            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    return table;
}

async function initializeTable() {
    const container = document.getElementById('data-container');
    if (!container) {
        console.error('Data container element not found');
        return;
    }

    const tsvUrl = container.getAttribute('data-sheet-url');
    if (!tsvUrl) {
        console.error('No data-sheet-url found');
        return;
    }

    const data = await fetchTSVData(tsvUrl);
    container.innerHTML = '';
    const table = createTable(data);
    container.appendChild(table);
}

document.addEventListener('click', event => {
    if (event.target.matches('.preview-link')) {
        event.preventDefault();
        const url = event.target.getAttribute('data-url');
        if (isValidUrl(url)) {
            openPreviewWindow(url);
        }
    }
});

async function openPreviewWindow(url) {
    // Lazy load preview window content
    setTimeout(async () => {
        const previewContainer = document.getElementById('preview-container');
        if (!previewContainer) {
            console.error('Preview container element not found');
            return;
        }

        previewContainer.innerHTML = '';
        const data = await fetchTSVData(url);
        const table = createTable(data);
        previewContainer.appendChild(table);

        adjustPreviewStyles(true);
    }, 0);
}

function closePreviewWindow() {
    adjustPreviewStyles(false);
}

function adjustPreviewStyles(isOpen) {
    const previewArea = document.querySelector('.preview-area');
    const tableArea = document.querySelector('.table-area');

    if (isOpen) {
        previewArea.style.display = 'block';
        previewArea.style.flex = '1';
        tableArea.style.flex = '1';
    } else {
        previewArea.style.display = 'none';
        previewArea.style.flex = '0';
        tableArea.style.flex = '1';
    }
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}
