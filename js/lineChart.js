// Create a scatter plot
// Fetch data from CSV file
async function getData() {
    // const response = await fetch('../data/mean-inhibition-zones.csv');    // data directory for local dev (LiveServer)
    const response = await fetch('/rp_Wang/data/mean-inhibition-zones.csv');    // data directory for GitHub pages
    const data = await response.text();
    
    // Array to store individual data points
    const points = [];

    // Split CSV into rows and process each row
    const table = data.split('\n').slice(1);
    
    table.forEach(row => {
        const columns = row.split(',');
        const hour = columns[0];

        // Parse data values for each light group
        const noneHour = parseFloat(columns[1]);
        const visibleHour = parseFloat(columns[2]);
        const UVHour = parseFloat(columns[3]);

        // Add a data point to the array
        points.push({
            x: hour,
            yNone: noneHour,
            yVisible: visibleHour,
            yUV: UVHour
        });
    });

    return points;
}

// Create scatter plot chart
async function createChart() {
    // Retrieve data points
    const points = await getData();
    const ctx = document.getElementById('myChart');
    
    // Create Chart instance
    const myChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            // Define datasets for each light group
            datasets: [
                {
                    label: 'No Light Group (Light Exposure in h, Mean Diameter in cm)',
                    data: points.map(point => ({ x: point.x, y: point.yNone })),
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    pointRadius: 5
                },
                {
                    label: 'Visible Light Group (Light Exposure in h, Mean Diameter in cm)',
                    data: points.map(point => ({ x: point.x, y: point.yVisible })),
                    backgroundColor: 'rgba(0, 102, 255, 0.2)',
                    borderColor: 'rgba(0, 102, 255, 1)',
                    pointRadius: 5
                },
                {
                    label: 'UV Light Group (Light Exposure in h, Mean Diameter in cm)',
                    data: points.map(point => ({ x: point.x, y: point.yUV })),
                    backgroundColor: 'rgba(0, 153, 51, 0.2)',
                    borderColor: 'rgba(0, 153, 51, 1)',
                    pointRadius: 5
                }
            ]
        },
        options: {
            showLine: true,
            responsive: true,    // Resize based on screen size
            maintainAspectRatio: false,
            scales: {            // Display options for x & y axes
                x:{
                    title:{
                        display:true,
                        color: 'black',
                        text:'Total Duration of Light Exposure (h)',    // x-axis title
                        font: {         // font properties
                            size: 20
                        },
                    },
                    beginAtZero: true,
                    ticks:{
                        font:{
                            size: 16
                        }
                    }
                },
                y: {
                    title:{
                        display: true,
                        color: 'black',
                        text: 'Zone of Inhibition Diameter (cm)',       // y-axis title
                        font:{
                            size: 12
                        },
                    },
                    beginAtZero: true,
                    ticks:{
                        font:{
                            size: 12
                        }

                    }
                }
            },
            plugins: {          // Display options
                title: {
                    display: true,
                    text: 'Mean Zone of Inhibition Diameter of Light Exposure Durations',
                    color: 'black',
                    font:{
                        size: 24
                    },
                    padding:{
                        top: 10,
                        bottom: 30
                    }
                },
                legend:{
                    align: 'start',
                    position: 'bottom'
                }
            }
        }
    });
}
createChart();