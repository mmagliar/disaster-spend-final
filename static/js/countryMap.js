// Function to create maps
function mainMapCreator(mapInfo, popupData) {
  // Creating map object
  var map = L.map(mapInfo['div'], {
    center: mapInfo['center'],
    zoom: mapInfo['zoom'],
    zoomControl: false
  });

  // Disable controls to make static maps
  map.touchZoom.disable();
  map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();
  map.boxZoom.disable();
  map.keyboard.disable();
  if (map.tap) map.tap.disable();
  
  // Adding tile layer
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: mapInfo['attribution'],
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(map);

  // Define a style
  var myStyle = {
    fillColor: 'rgba(19, 112, 22, 0)',
    weight: 1,
    opacity: 1,
    color: 'black',
    dashArray: '3',
    fillOpacity: 0.7
  };

  // Read in geojson data
  var statesData = new L.GeoJSON.AJAX("/static/json/us-states.json", {
    style:myStyle, 
    onEachFeature: function(feature, layer) {
      // Add mouseover and click event
      layer.on('mouseover', function() {
        layer.setStyle({fillColor: "rgba(233, 39, 39, 0.7)"});
      });
      layer.on('mouseout', function() {
        layer.setStyle({fillColor: "rgb(19, 112, 22, 0)"});
      });
      layer.on('click', clickChanger);
      
      // Filter out current state data
      var thisState;
      popupData.forEach(function(datum) {
        if (datum[0] === feature.properties.NAME) { thisState = datum };
      });
      
      // Bind popups to states
      layer.bindPopup(`<h1>${thisState[0]}</h1><hr id='pop-hr'><p>Total Number of Disasters: ${numberWithCommas(thisState[1])}</p><p>Total Amount Spent on Disasters: \$ ${numberWithCommas(Math.round(thisState[2]))}</p>`);
    }
  });
  console.log(statesData);
  
  // Add state objects to map
  statesData.addTo(map);
};

// Function to create maps
function stateMapCreator(choroplethData) {
  // Calculate steps for choropleth coloring
  var colorSteps = stepCalc(choroplethData);
  console.log(colorSteps);
  
  // Creating map object
  var map = L.map('state-map', {
    center: [38.0,-96.0],
    zoom: 5
  });
  
  // Adding tile layer
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(map);

  // Read in geojson data
  var countyData = new L.GeoJSON.AJAX("/static/json/us-counties.json", {
    onEachFeature: function(feature, layer) {
      // Filter out current county data from choroplethData
      var currentCounty = ['', 0, 0, 0];
      var regex = new RegExp(feature.properties.NAME + '*');
      for (let i = 0; i < choroplethData.length; i++) {
        if (regex.test(choroplethData[i][0])) {
          currentCounty = choroplethData[i];
          currentCounty[0] = feature.properties.NAME;
          break;
        };
      };

      layer.bindPopup(`<h1>${currentCounty[0]} County</h1><hr><p>Total Number of Disasters: ${numberWithCommas(currentCounty[1])}</p><p>Total Amount Spent on Disasters: \$ ${numberWithCommas(Math.round(currentCounty[2]))}</p><p>Average Amount Spent Per Disaster: \$ ${numberWithCommas(Math.round(currentCounty[3]))}</p>`)
    },
    filter: stateFilter,
    style: function(feature, layer) { return style(feature, choroplethData, colorSteps); }
  });
  console.log(countyData);
  
  // Add counties to state map
  setTimeout(function(){ countyData.addTo(map); }, 1000);

  // Wait for everything to finish then move the state map to show the state and counties
  setTimeout(function(){ map.fitBounds(countyData.getBounds()); }, 500);
};

// Formatter for currency, credit to Elias Zamaria (https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript)
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Calculates the step values for the color selector
function stepCalc(data) {
  // Get all county averages
  var holder = [];
  data.forEach(function(datum) { holder.push(datum[3]); });

  // Calculate the average of averages
  var total = 0;
  for (let i = 0; i < holder.length; i++) {
    total += holder[i];
  };
  var average = total / holder.length;

  // Calculate the step differences for above and below average
  var maxSpent = Math.max(...holder);
  var minSpent = Math.min(...holder);
  var lowerSteps = Math.round((average - minSpent) / 4);
  var upperSteps = Math.round((maxSpent - average) / 4);
  
  // Calculate the cutoffs for color steps
  var stepArr = [];
  
  for (let i = 1; i < 5; i++) {
    stepArr.push(lowerSteps * i); 
  };
  
  for (let i = 1; i < 4; i++) {
    stepArr.push((upperSteps * i) + average);
  };
  
  return stepArr;
};

// Color selector for choropleth
function colorSelector(d, steps) {
  if (d > steps[6]) {
    return '#ff0000';
  }
  else if (d > steps[5]) {
    return '#e54000';
  }
  else if (d > steps[4]) {
    return '#cb5700';
  }
  else if (d > steps[3]) {
    return '#af6600';
  }
  else if (d > steps[2]) {
    return '#927000';
  }
  else if (d > steps[1]) {
    return '#757700';
  }
  else if (d > steps[0]) {
    return '#4c7d00';
  }
  else if (d <= steps[0]) {
    return '#008000';
  }
  else {
    return '#222222';
  };
};

// Creates style object for choropleth
function style(feature, cData, steps) {
  var thisCounty = 0;

  // Grab average money spent per disaster for color selection
  for (let el of cData) {
    if (el[0] == feature.properties.NAME) {
      thisCounty = el[[3]]
      break;
    }
  }
    
  var c = colorSelector(thisCounty, steps);

  return {
      fillColor: c,
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
  };
}

// Filters data on state
function stateFilter(feature) {
  if (feature.properties.STATE === selected.target.feature.properties.STATE) { return true };
};


function clickChanger(e) {
  // Handle whether a state has been clicked yet or not
  if (selected == null) {
    // Nothing has been selected yet so generate map and add what was selected

    // Show the containing element
    var mapAndChartContainer = document.getElementById('state-info-container');
    mapAndChartContainer.classList.remove("hide");
    document.getElementById('state-map-container').classList.remove('hide');
    document.getElementById('state-map').classList.remove('hide');
    document.getElementById('county-disaster-pie').classList.remove('hide');
    document.getElementById('radarChart').classList.remove('hide');
    // document.getElementById('state-bar-chart').classList.remove('hide');
    // document.getElementById('barChart').classList.remove('hide');

    // Highlight selected on country map
    selected = e;
    selected.target.bringToFront();
    selected.target.setStyle({
      fillColor: 'rgba(233, 39, 39, 0.7)',
      color: 'rgba(36, 148, 212, 1)',
      dashArray: '0',
      weight: 3
    });

    // Use name of selected state to retrieve county data
    var filterName = selected.target.feature.properties.NAME;

    // Get county data for selected state
    var cDA = getCountyData(filterName);
    console.log(cDA);

    // Get data for chart generation
    var filteredIncidentData = getIncidentData(filterName);
    console.log(filteredIncidentData);
    
    // var filteredYearData = getYearData(filterName);
    // console.log(filteredYearData);

    // Generate state map
    setTimeout(function(){ stateMapCreator(cDA); }, 300);
    
    // Generate radar chart
    radar(filteredIncidentData, filterName);
    
  }
  else {
    // Update the country map with newly selected state
    selected.target.setStyle({
      color: 'black',
      dashArray: '3',
      weight: 1,
      fillOpacity: 0.7,
      fillColor: 'rgba(19, 112, 22, 0)'
    });
    selected = e;
    selected.target.bringToFront();
    selected.target.setStyle({
      color: 'rgba(36, 148, 212, 1)',
      dashArray: '0',
      weight: 3,
      fillColor: 'rgba(233, 39, 39, 0.7)'
    });

    // Delete old state map
    var currentMap = document.getElementById('state-map');
    var mapParent = document.getElementById('state-map-container');
    mapParent.removeChild(currentMap);

    // Create html for new state map
    newMapDiv = document.createElement('div');
    mapParent.insertBefore(newMapDiv, mapParent.firstChild);
    newMapDiv.setAttribute('id','state-map');
    newMapDiv.setAttribute('class','col-6');
    
    // Use name of selected state to retrieve county data
    var filterName = selected.target.feature.properties.NAME;

    // Get county data for selected state
    var cDA = getCountyData(filterName);
    console.log(cDA);

    // Get county data for selected state
    var cDA = getCountyData(filterName);
    console.log(cDA);

    // Get data for chart generation
    var filteredIncidentData = getIncidentData(filterName);
    console.log(filteredIncidentData);

    // Generate state map
    setTimeout(function(){ stateMapCreator(cDA); }, 300);
    
    // Generate new radar chart
    updateRadar(filteredIncidentData, filterName);
  };
};

// Information for maps to be created
var maps = [{
  div: "country-map",
  center: [38.0,-96.0],
  zoom: 5,
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>"
},
{
  div: "alaska-map",
  center: [64.1, -162.0],
  zoom: 3,
  attribution: ''
},
{
  div: "hawaii-map",
  center: [20.6, -157.6],
  zoom: 6,
  attribution: ''
}];

// Global variables
var selected = null;
let countryURL = '/countryData';
let fetchParams = {
    method: 'GET',
    mode:'cors'
};

// Call for data to make the country map popups
fetch(countryURL, fetchParams).then(function(response) {
  return response.json();
  }).then(function (disasters) {
    console.log(disasters);

    // Create the maps
    maps.forEach(function(map) {
      console.log(map);
      mainMapCreator(map, disasters);
    });
});