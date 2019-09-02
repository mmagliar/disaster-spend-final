// Formatter for currency, credit to Elias Zamaria (https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript)
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// from data.js
var tableData = data;

// Get a reference to the table and table body
var tbody = d3.select("tbody");

function buildTable(table) {
    var num;
    if (table.length > 1000) {
        num = 1000;
    } else {
        num = table.length;
    }

    for (let index = 0; index < num; index++) {
        const element = table[index];
        // console.log(element);
        var tableRow = tbody.append('tr');
        Object.entries(element).forEach(([key,value]) => {
            if (key == 'Sum_totalObligated') {
                var formattedNum = numberWithCommas(+value);
                tableRow.append('td').text(`$${formattedNum}`);
            }
            else {
                tableRow.append('td').text(value);
            }
        }); 
    }
}

buildTable(tableData);

// Select the Filter Table button
var submit = d3.select("#filter-btn");
submit.on("click", function() {
    // Prevent the page from refreshing
    d3.event.preventDefault();
    // Get the value property of the input element
    var inputValueMonth = d3.select("#monthDeclared").property("value");
    var inputValueYear = d3.select("#fyDeclared").property("value");
    var inputValueState = d3.select("#state").property("value");
    var inputValueCounty = d3.select("#county").property("value");
    var inputValueType = d3.select("#incidentType").property("value");

    // Filtered data array
    var filteredData = tableData 
    statesDict = {
        'ak': 'alaska',
        'al': 'alabama',
        'ar': 'arkansas',
        'az': 'arizona',
        'ca': 'california',
        'co': 'colorado',
        'ct': 'connecticut',
        'dc': 'district of columbia',
        'de': 'delaware',
        'fl': 'florida',
        'ga': 'georgia',
        'hi': 'hawaii',
        'ia': 'iowa',
        'id': 'idaho',
        'il': 'illinois',
        'in': 'indiana',
        'ks': 'kansas',
        'ky': 'kentucky',
        'la': 'louisiana',
        'ma': 'massachusetts',
        'md': 'maryland',
        'me': 'maine',
        'mi': 'michigan',
        'mn': 'minnesota',
        'mo': 'missouri',
        'ms': 'mississippi',
        'mt': 'montana',
        'nc': 'north carolina',
        'nd': 'north dakota',
        'ne': 'nebraska',
        'nh': 'new hampshire',
        'nj': 'new jersey',
        'nm': 'new mexico',
        'nv': 'nevada',
        'ny': 'new york',
        'oh': 'ohio',
        'ok': 'oklahoma',
        'or': 'oregon',
        'pa': 'pennsylvania',
        'ri': 'rhode island',
        'sc': 'south carolina',
        'sd': 'south dakota',
        'tn': 'tennessee',
        'tx': 'texas',
        'ut': 'utah',
        'va': 'virginia',
        'vt': 'vermont',
        'wa': 'washington',
        'wi': 'wisconsin',
        'wv': 'west virginia',
        'wy': 'wyoming'
    }

    if (inputValueMonth) {
        filteredData = filteredData.filter(sighting => sighting.monthDeclared == inputValueMonth);
    };
    if (inputValueYear) {
        filteredData = filteredData.filter(sighting => sighting.fyDeclared == inputValueYear);
    };
    if (inputValueState) {
        loweredState = inputValueState.toLowerCase()
        if (!statesDict.hasOwnProperty(loweredState)) {
            filteredData = filteredData.filter(sighting => sighting.state.toLowerCase() === loweredState);
        } else {
            requestedState = statesDict[loweredState];
            filteredData = filteredData.filter(sighting => sighting.state.toLowerCase() === requestedState);
        };
    };
    if (inputValueCounty) {
        filteredData = filteredData.filter(sighting => sighting.county.toLowerCase() === inputValueCounty.toLowerCase());
    };
    if (inputValueType) {
        filteredData = filteredData.filter(sighting => sighting.incidentType.toLowerCase() === inputValueType.toLowerCase());
    };

    // Clear table and message if it exists
    tbody.html("");
    d3.select("h2").html("");

    if(filteredData === undefined || filteredData.length == 0) {
        d3.select("tbody").select('tr').select('td').text("No data! Try again!").style("font-size", "16px");
        var tableRow = tbody.append('tr');
        tableRow.append('td').text("No data! Try again!").style("font-size", "16px");
    }
    else {
        // Display new table with filtered data
        buildTable(filteredData);
    }
});

// Select the Reset button
var submit = d3.select("#un-filter-btn");
submit.on("click", function() {
    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Clear table and message if it exists
    tbody.html("");
    d3.select("span").html("");

    // Clear filters
    d3.select("#monthDeclared").value = "";
    d3.select("#fyDeclared").value = "";
    d3.select("#state").node().value = "";
    d3.select("#county").node().value = "";
    d3.select("#incidentType").node().value = "";
    
    // Rebuild full table
    buildTable(tableData);
})