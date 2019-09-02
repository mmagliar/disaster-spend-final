let damamounturl = '/damTotsAmount';
console.log(damamounturl);
let fetchParams2 = {
    method: 'GET',
    mode:'cors'
};
// This for grabbing the aggregrated data for the Bar chart on the Federal page
fetch(damamounturl, fetchParams2).then(function(response2) {
        return response2.json();
    }).then(function (disasters2) {
        console.log(disasters2)

        var category1 = [];
        var count2 = [];
        var amount2 = [];

        
        disasters2.forEach(function(disaster2){
            category1.push(disaster2[0]);
            count2.push(disaster2[1]);
            amount2.push(disaster2[2]);
        

        console.log(count2);

let damtotchartamount = {
  gui: {
    contextMenu: {
      button: {
        visible: false
      }
    }
  }, 
  graphset :[{  
    type: "bar3d",
    title : {
        text : "Cost of Projects Resulting from Storms (2000 - 2019)",
        wrapText : true,
        adjustLayout : true
      },
    plot:{
    aspect:"cylinder",
    "animation":{
        "effect":"11",
        "method":"3",
        "sequence":"ANIMATION_BY_PLOT_AND_NODE",
        "speed":10
    },
    "styles":["#2494D4","#2494D4","#E92727","#2494D4","#2494D4","#E92727","#2494D4","#2494D4"],
    "alpha":0.7
  },
  plotarea : {
    margin : 'dynamic'
  },
  scaleY : {
    values : "34000000:25000000000:100000000", 
    "short": true, 
    "format":"$%v",
    label: {
     "text": "Cost of Repairs",
     "font-color": "black",
     "font-size": 16
 }},
 "scale-x": {
    "labels": category1,
    "item":{  
        "font-angle":-45    
    }  
  },
  series: [
    {
      values: count2,
      "format":"$%v",
      "short":true
    }
    ]}]
};
    zingchart.render({
        id:"damTotsAmount",
        height:'100%',
        width:'100%',
        data: damtotchartamount
    });
})
});