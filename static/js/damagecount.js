let damcounturl = '/damTotscount';
console.log(damcounturl);
let fetchParams1 = {
    method: 'GET',
    mode:'cors'
};
// This for grabbing the aggregrated data for the Bar chart on the Federal page
fetch(damcounturl, fetchParams1).then(function(response1) {
        return response1.json();
    }).then(function (disasters1) {
        console.log(disasters1)

        var category = [];
        var count1 = [];
        var amount1 = [];

        
        disasters1.forEach(function(disaster1){
            category.push(disaster1[0]);
            count1.push(disaster1[1]);
            amount1.push(disaster1[2]);
        

        console.log(count1);

let damtotchart = {
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
        text : "Number of Projects Resulting from Storms (2000 - 2019)",
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
    "thousands-separator":",",  
    label: {
     "text": "Repairs Performed",
     "font-color": "black",
     "font-size": 16
 }},
 "scale-x": {
    "labels": category,
    "item":{  
        "font-angle":-45    
    }  
  },
  series: [
    {
      values: count1
    }
    ]}]
};
    zingchart.render({
        id:"damTotsCount",
        height:'100%',
        width:'100%',
        data: damtotchart
    });
})
});