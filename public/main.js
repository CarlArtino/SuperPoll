const form = document.getElementById("vote-form");

//create poll function that calls the backend funciton
function createPoll(){
    //This is all dummy test data
    //data will need to be filled with values from user input
    const data = {
        title: 'Test Poll',
        author: 'Dom',
        questions: [
            {
                question: 'Is this right',
                choices:['yes', 'no']
            },
            {
                question: 'Do you like Dogs',
                choices: ['Yes', 'No','Maybe']
            }
        ]      
    }
    //call backend
    fetch('http://localhost:3000/createPoll',{
        method: 'post',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type' :'application/json'     
        })
    })
    .then(response =>{
        console.log(response.json());
    })
    .catch(err=>console.log(err));
}

//form submit event
form.addEventListener('submit', e => {
    const choice = document.querySelector('input[name=ans]:checked').value;
    const data = {ans:choice};
    
    fetch('http://localhost:3000/poll', {
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
});

fetch('http://localhost:3000/poll')
    .then(response => response.json())
    .then(data => {
        const votes = data.votes;
        const totalVotes = votes.length;
        // Count vote points - acc/current
        const voteCounts = votes.reduce(
            (acc, vote) => (
                (acc[vote.ans] = (acc[vote.ans] || 0) + parseInt(vote.points)), acc
                ), 
                {}
            );

        let dataPoints = [
            {label : 'choice1', y: voteCounts.choice1},
            {label : 'choice2', y: voteCounts.choice2},
            {label : 'choice3', y: voteCounts.choice3},
        ];
        
        const chartContainer = document.querySelector('#chartContainer');
        
        if(chartContainer) {
            const chart = new CanvasJS.Chart('chartContainer', {
                animationEnabled: true,
                theme: 'theme1',
                title : {
                    text: `Total Votes ${totalVotes}`
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
        
            var pusher = new Pusher('fd467d20d3b0858ce2a6', {
                cluster: 'us2' ,
                encrypted: true
            });
        
            var channel = pusher.subscribe('poll');
            channel.bind('vote', function(data) {
                dataPoints = dataPoints.map(x=> {
                    if(x.label == data.ans){
                        x.y += data.points;
                        return x;
                    }
                    else {
                        return x;
                    }
                });
                chart.render();
            });
        }
    });


