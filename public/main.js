const Pusher = require("pusher");

const form = document.getElementById("vote-form");


//form submit event
form.addEventListener('submit', e => {
    const choice = document.querySelector('input[name=ans]:checked').nodeValue;
    const data = {ans:choice};

    fetch('http://locahost:3000/poll', {
        method: 'post',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type' :'application/json'     
        })
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err =>  console.log(err));

e.preventDefault();
})

let dataPoints = [
    {label : 'choice1', y: 0},
    {label : 'choice2', y: 0},
    {label : 'choice3', y: 0},
];

const chartContainer = document.querySelector('#chartContainer');

if(chartContainer) {
    const chart = new CanvasJS.Chart('chartContainer', {
        theme: 'theme1',
        title : {
            text: 'OS Results'
        },
        data: [
            {
                type: 'column',
                dataPoints: dataPoints
            }
        ]
    });
    chart.render();

    //Enable pusher logging
    Pusher.logToConsole = true;

    var pusher = new Pusher('99e3e80d23017c44ddc4', {
        cluster: 'us2' ,
        encrypted: true
    });

    var channel = pusher.subscribe('poll');
    channel.bind('vote', function(data) {
        dataPoints = dataPoints.map(x=> {
            if(x.label == data.os){
                x.y += data.points;
                return x;
            }
            else {
                return x;
            }
        });
        chart.render();
    })
}
