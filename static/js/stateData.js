function getCountyData(stateName) {
    let stateURL = '/stateCounty/' + stateName;
    console.log(stateURL);

    var response = fetch(stateURL, fetchParams).then(function(countyResponse) {
            return countyResponse.json()
    });
    
    var countyDataArray = [];
    response.then(function(data) {
        console.log(data);
        data.forEach(function(datum) {
            countyDataArray.push(datum);
        })
    });
    console.log(countyDataArray);
    
    return countyDataArray;
};

function getIncidentData(stateName) {
    let stateURL = '/stateIncident/' + stateName;
    console.log(stateURL);

    var response = fetch(stateURL, fetchParams).then(function(incidentResponse) {
            return incidentResponse.json()
        })
    return response;
};