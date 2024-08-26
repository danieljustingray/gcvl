function generateBoxPlot() {
    const inputElement = document.getElementById('dataInput');
    const inputData = inputElement.value.trim();

    if (!isValidInput(inputData)) {
        alert('Voer alstublieft getallen gescheiden door ; met , voor decimalen in.');
        return;
    }

    // Replace commas with dots in the input data
    const data = inputData.split(';').map(numStr => parseFloat(numStr.trim().replace(',', '.')));

    if (data.length < 4) {
        alert('Voer minstens 4 getallen in om een boxplot te genereren.');
        return;
    }

    renderBoxPlot(data);
}

function isValidInput(input) {
    const regex = /^(\s*-?\d+(\,\d+)?\s*;\s*)*-?\d+(\,\d+)?\s*$/;
    return regex.test(input);
}

function calculateStatistics(data) {
    const sortedData = data.sort((a, b) => a - b);
    const median = findMedian(sortedData);
    const q1 = findMedian(sortedData.slice(0, Math.floor(sortedData.length / 2)));
    const q3 = findMedian(sortedData.slice(Math.ceil(sortedData.length / 2)));
    return { median, q1, q3 };
}

function findMedian(sortedData) {
    const middle = Math.floor(sortedData.length / 2);
    if (sortedData.length % 2 === 0) {
        return (sortedData[middle - 1] + sortedData[middle]) / 2;
    } else {
        return sortedData[middle];
    }
}

function renderBoxPlot(data) {
    const plotData = [{
        x: data,
        type: 'box',
        orientation: 'h',
        boxpoints: 'all',
        jitter: 0.3,
        pointpos: -1.8,
        marker: { color: 'rgb(7,40,89)' },
        line: { color: 'rgb(7,40,89)' }
    }];

    const layout = {
        title: 'Aangepaste Horizontale Boxplot',
        xaxis: { title: 'Waarden' },
        margin: { t: 50, r: 20, l: 150 } // Adjust as needed
    };

    const statistics = calculateStatistics(data);
    const statisticsElement = document.getElementById('statistics');
    statisticsElement.innerHTML = `Mediaan: ${statistics.median.toFixed(2)} <br>
                                   Q1: ${statistics.q1.toFixed(2)} <br>
                                   Q3: ${statistics.q3.toFixed(2)}`;

    Plotly.newPlot('boxplot', plotData, layout);
}

function transformInput() {
    let inputValue = document.getElementById('inputField').value;

    inputValue = inputValue.replace(/\./g, ',');

    inputValue = inputValue.replace(/\s+/g, ';');

    inputValue = inputValue.replace(/\t+/g, ';');

    inputValue = inputValue.replace(/;{2,}/g, ';');

    inputValue = inputValue.replace(/^;+|;+$/g, '');

    document.getElementById('inputField').value = inputValue;
}

function copyNumbers() {
    const inputField = document.getElementById('inputField');

    inputField.select();
    inputField.setSelectionRange(0, 99999);

    document.execCommand('copy');

    inputField.blur();
}

document.getElementById('count-button').addEventListener('click', async () => {
    const url = document.getElementById('url-input').value;
    if (!url) {
      alert('Please enter a URL.');
      return;
    }
  
    try {
      const response = await fetch(url);
      const text = await response.text();
      const wordCount = countWords(stripHTML(text));
      document.getElementById('result').textContent = `Word Count: ${wordCount}`;
    } catch (error) {
      console.error('Error fetching the URL:', error);
      document.getElementById('result').textContent = 'Error fetching the URL.';
    }
  });
  
  function stripHTML(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }
  
  function countWords(text) {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }
  