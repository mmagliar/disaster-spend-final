function radar(incidentData, nameOfState) {
    var rD = [];
    var rL = [];
    var rS = [];
    var sumD = 0;
    var sumS = 0;

    incidentData.then(function(events) {
        
        // Calculate percentages of disaster type and amount spent
        events.forEach(function(event) {
            sumS += event[2];
            sumD += event[1];
        });

        events.forEach(function(event) {
            rS.push(event[2] / sumS * 100);
            rD.push(event[1] / sumD * 100);
            rL.push(event[0]);
        });

        // Set chart data and styling
        var radarData = {
            datasets: [{
                label: 'Percent of Disasters',
                lineTension: 0.1,
                backgroundColor: "rgba(233, 39, 39, 0.4)",
                borderColor: "rgba(233, 39, 39, 0.7)",
                borderWidth: 0,
                pointBackgroundColor: "rgba(233, 39, 39, 0.4)",
                pointBorderColor: "rgba(233, 39, 39, 0.7)",
                pointRadius: 4,
                pointHoverRadius: 10,
                pointHoverBackgroundColor: "rgba(233, 39, 39, 0.4)",
                pointHoverBorderColor: "rgba(233, 39, 39, 0.7)",
                data: rD
            },
            {
                label: 'Percent Spent',
                lineTension: 0.1,
                backgroundColor: "rgba(36, 148, 212, 0.4)",
                borderColor: "rgba(36, 148, 212, 0.7)",
                borderWidth: 0.5,
                pointBackgroundColor: "rgba(36, 148, 212, 0.4)",
                pointBorderColor: "rgba(36, 148, 212, 0.7)",
                pointRadius: 4,
                pointHoverRadius: 10,
                pointHoverBackgroundColor: "rgba(36, 148, 212, 0.4)",
                pointHoverBorderColor: "rgba(36, 148, 212, 0.7)",
                data: rS
            }
        ],
            labels: rL
        };

        var radarOptions = {
            title: {
                display: true,
                fontSize: 20,
                fontColor: 'rgba(0, 0, 0, 1)',
                text: `Percent Spent vs Percent of Disaster by Type in ${nameOfState}`
            },
            scale: {
                angleLines: {
                    color: 'rgba(200, 200, 200, 0.4)',
                    linewidth: 1
                },
                gridLines: {
                    color: 'rgba(150, 150, 150, 0.4)'
                },
                pointLabels: {
                    fontColor: 'rgba(0, 0, 0, 1)',
                    fontSize: 10
                },
                ticks: {
                    backdropColor: 'rgba(0,0,0,0)',
                    fontColor: 'rgba(0, 0, 0, 0.6)'
                },
                scaleLabel: {
                    fontcolor: 'rgba(0, 0, 0, 0.4)',
                    fontSize: 9
                }
            },
            legend: {
                position: 'right',
                labels: {
                    usePointStyle: true,
                    fontColor: 'rgba(0, 0, 0, 1)'
                }
            },
            tooltips : {

                callbacks : {
                    label : function(tooltipItem, data) {
                        return data.datasets[tooltipItem.datasetIndex].label + ': ' + Math.round(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]) + '%';
                    }
                }
            }
        };

        // Get reference to containing element
        var ctx = document.getElementById('radarChart').getContext("2d");

        // Make the chart
        var myRadarChart = new Chart(ctx, {
            type: 'radar',
            data: radarData,
            options: radarOptions
        });
    });
};

function updateRadar(incidentData, nameOfState) {
    // Delete old chart
    var chartParent = document.getElementById('county-disaster-pie');
    chartParent.innerHTML = '';

    // Create html for new chart
    var newChartCanvas = document.createElement('canvas');
    document.getElementById('county-disaster-pie').appendChild(newChartCanvas);
    newChartCanvas.setAttribute('id','radarChart');
    newChartCanvas.setAttribute('height',712);
    newChartCanvas.setAttribute('width',712);
    
    // Create new chart
    radar(incidentData, nameOfState);
};