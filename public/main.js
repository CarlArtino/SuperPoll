const form = document.getElementById("vote-form");
//const createPoll = document.getElementById("questions-form");


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
