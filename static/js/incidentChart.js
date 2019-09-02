// This for grabbing the aggregrated data for the Line chart on the Federal page
let incidentURL = '/incidentList';
console.log(url);

fetch(incidentURL, fetchParams).then(function(response) {
        return response.json();
    }).then(function (disasters) {
        console.log(disasters)

        var incidentName = [];
        var count = [];
        var amount = [];
        
        disasters.forEach(function(disaster){
            incidentName.push(disaster[0]);
            count.push(disaster[1]);
            amount.push(disaster[2]);
        });

        console.log(incidentName);
    })
