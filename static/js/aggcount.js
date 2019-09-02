// setting and testing route call.
let url = '/agCount';
console.log(url);
let fetchParams = {
    method: 'GET',
    mode:'cors'
};
// This for grabbing the aggregrated data for the Line chart on the Federal page
fetch(url, fetchParams).then(function(response) {
        return response.json();
    }).then(function (disasters) {
        console.log(disasters)

        var year = [];
        var count = [];
        var amount = [];

        
        disasters.forEach(function(disaster){
            year.push(disaster[0]);
            count.push(disaster[1]);
            amount.push(disaster[2]);
        

        console.log(amount);

let disaggchart = {
  gui: {
    contextMenu: {
      button: {
        visible: false
      }
    }
  },  
  graphset :[ 
    {
      type: "line",
      "plot": {
        "line-color": "#E92727",
        "marker": {
          "background-color": "#E92727",
          "border-color": "white",
          "border-width": 2
        }
      },
      title : {
        text : "Number of Disasters and Amount Spent Cleaning Them Up (2000 - 2019)",
        wrapText : true,
        adjustLayout : true
      },
      height : "45%",
      width : "100%",
      x : 0,
      y : 0,
      plotarea : {
        margin : 'dynamic'
      },
      scaleX : {
        visible : false, 
        zooming : true 
      },
      scaleY : {
        values : "150:6500:250",
        "thousands-separator":",",
        label: {
        "text": "Number of Disasters",
        "font-color": "black"
        }, 
      },
      zoom : { 
        shared : true
      },
      crosshairX :{ 
        shared : true,
        scaleLabel :{
          visible : false 
        }
      },
      tooltip :{
        visible : true
      },
      series : [
      {
            values : count,
            text: "Number of Disasters"  
      }
    ]
    },
    {
      type: "line",
      "plot": {
        "line-color": "#2494D4",
        "marker": {
          "background-color": "#2494D4",
          "border-color": "white",
          "border-width": 2
        }
      },
      height : "55%",
      width : "100%",
      x : 0,
      y : "45%",
      plotarea : {
        margin : 'dynamic'
      },
      scaleX : {
        zooming : true,
        maxItems : 10,
        "min-value": 2000
      },
      scaleY : {
        values : "34000000:22000000000:100000000",
        "thousands-separator":",",
        "format":"%v",
        "short": true,
        label: {
        "text": "Dollars Spent on Clean Up"
    },
      },
      zoom : {
        shared : true
      },
      crosshairX :{
        shared : true
      },
      tooltip :{
        visible : true
      },
      preview : {
        margin : "258px 20px 20px 148px",
        adjustLayout : true
      },
      scrollX:{},
    series : [
        {
            values : amount,
            "format":"$%v",
            "short":true,
            "text": "Dollars Spent"                    
        }
    ]
  }
  ]
}; 
  
  zingchart.render({
      id:"dis-by-year",
      height:'100%',
      width:'100%',
      data: disaggchart
  });
})
});