const form = document.getElementById("vote-form");
//const createPoll = document.getElementById("questions-form");

var pollQuestion;

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

createEmbbededChoiceElement = (inputId, value)=> {

   const p= document.createElement('p');
   const label = document.createElement('label');
   const input = document.createElement('input');
   const span = document.createElement('span');

   span.setAttribute('for', 'option-' + inputId);
   span.innerHTML  =value;

   input.setAttribute('type', 'radio');
   input.setAttribute('name', 'ans');
   input.setAttribute('id','option-' + inputId);
   
    
   label.appendChild(input);
   label.appendChild(span);
   p.appendChild(label);
   return p;

}

//this creates the submit button
const moveSubmitButton = ()=> {
    {
        document.getElementById('finish-vote').remove();

        var submit = document.createElement("input");
        submit.setAttribute('type', 'submit');
        submit.setAttribute('id', 'finish-vote');
        return submit;
    }
}

//this creates the question element
createQuestionElements = (questionId, question) => {
    const h1 = document.createElement('h1');
    h1.setAttribute('id', "question-" + questionId );
    h1.innerHTML = question;
    return h1;
} 

// create question elements
const fillQuestionForm = (questionObject) => {
    answerId = 1;
    questionId =1;
        const form = document.getElementById("vote-form");
        
        if(questionObject != null) {
            // adding question to form
            const q = createQuestionElements(questionId, questionObject.questions[0].question);
             form.appendChild(q);
             questionId++;
            
             const choices = questionObject.questions[0].choices;

             console.log("printing out choices" + choices)
             //adding all options
             for(i = 0; i < choices.length; i++ ) {
                 console.log("Creating options" + choices[i]);
                 const ans = createEmbbededChoiceElement(answerId,choices[i]);
                 console.log("Choice is" + ans);
                 form.appendChild(ans);
                 answerId++;
             }  
             
             form.appendChild(moveSubmitButton());
        }
}

setQuestion = function() {
    if(pollQuestion != null)
    document.getElementById('the-question').innerHTML = pollQuestion;
    else document.getElementById('the-question').innerHTML = 'Poll';
}

setPossibleAnswers = (possibleAnswers) => {
    //for( i =0; i <4 ; i++) {
    document.getElementById("question-1").innerHTML = possibleAnswers.questions[0].choices[0];
    document.getElementById("question-2").innerHTML = possibleAnswers.questions[0].choices[1];
    document.getElementById("question-3").innerHTML = possibleAnswers.questions[0].choices[2];


    //}
}

function loadQuestion(){
        //get object from local storage
        const poll = JSON.parse(localStorage.getItem('poll'));
        console.log(poll.questions);
        const votes = poll.questions[0].votes;
        pollQuestion = poll.questions[0].question;

        

        // //this sets the question;
        // setQuestion();

        // //set the answers
        // setPossibleAnswers(poll);

        fillQuestionForm(poll);

        console.log(votes);
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
}
