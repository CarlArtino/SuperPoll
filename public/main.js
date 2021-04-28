const form = document.getElementById("vote-form");
//const createPoll = document.getElementById("questions-form");

var pollQuestion;

//form submit event
function submitVote(counter) {
    const choice = document.querySelector('input[name=ans]:checked').value;
    const poll = JSON.parse(localStorage.getItem('poll'));
    const id = poll._id;
    const question = poll.questions[counter].question;
    const data = {ans:choice,
                  id: id,
                  question: question
                };

    fetch('https://super-poll.herokuapp.com/poll', {
        method: 'post',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type' :'application/json'
        })
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err =>  console.log(err));

    document.getElementById(`answers${counter}`).remove();
    document.getElementById(`finish-vote-${counter}`).remove();

}

function redirectToHomePage()
{
    
    window.location.href = 'https://super-poll.herokuapp.com/index.html';
    return false;
}

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
   input.setAttribute('value', value);
   
    
   label.appendChild(input);
   label.appendChild(span);
   p.appendChild(label);
   return p;

}

//this creates the submit button
const moveSubmitButton = (counter)=> {
    {
        var submit = document.createElement("input");
        submit.setAttribute('type', 'button');
        submit.setAttribute('id', `finish-vote-${counter}`);
        submit.setAttribute('onClick', `submitVote(${counter})`);
        submit.setAttribute('value', "Submit");
        submit.setAttribute("style", style="margin-top: 30px; margin-left:5% ");
        submit.setAttribute("class", "btn btn-primary btn-md rounded-pill mt-5");
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
const fillQuestionForm = (questionObject, counter) => {
    answerId = 1;
    questionId =1;
        const form = document.getElementById("vote-form");
        
        if(questionObject != null) {
            // adding question to form
            const q = createQuestionElements(questionId, questionObject.question);
             form.appendChild(q);
             questionId++;
             const div = document.createElement('div');
             div.setAttribute('id', `answers${counter}`);
             form.appendChild(div);
             const choices = questionObject.choices;

             //adding all options
             for(i = 0; i < choices.length; i++ ) {
                 const ans = createEmbbededChoiceElement(answerId,choices[i]);
                 div.appendChild(ans);
                 answerId++;
             }  
             
             form.appendChild(moveSubmitButton(counter));
        }
}



function loadQuestion(){
        //get object from local storage
        const poll = JSON.parse(localStorage.getItem('poll'));

        const title = document.getElementById("title");
        title.innerHTML = poll.title;

        const author = document.getElementById("author");
        author.innerHTML = `By ${poll.author}`;

        const votes = [];
        const pollQuestions = [];
        const choices = [];
        const chartContainers = [];
        for(let i = 0; i<poll.questions.length; ++i)
        {
            pollQuestions.push(poll.questions[i].question);
            votes.push(poll.questions[i].votes);
            choices.push(poll.questions[i].choices);
        }
                

        for(let counter = 0; counter<poll.questions.length; ++counter){
            fillQuestionForm(poll.questions[counter], counter);


            //Below: All things related to chart
            let totalVotes = votes[counter].length;

            //Create array parallel to choices that holds the number of votes
            let voteCounts = new Array(choices[counter].length).fill(0);
            for(let i = 0; i<votes[counter].length; ++i)
            {
                for(let j = 0; j<choices[counter].length; ++j)
                {
                    if(votes[counter][i] == choices[counter][j])
                    {
                        voteCounts[j]++;
                    }
                }
            }

            let dataPoints = new Array();
            
            for(let i = 0; i<choices[counter].length; ++i)
            {
                dataPoints.push({label: choices[counter][i], y: voteCounts[i]});
            }

            chartContainers[counter] = document.createElement('div');
            chartContainers[counter].setAttribute('id', `chartContainer${counter}`);
            chartContainers[counter].setAttribute('style', "height:300px; width:100%");
            form.appendChild(chartContainers[counter]);

            if(chartContainers[counter]) {
                const chart = new CanvasJS.Chart(`chartContainer${counter}`, {
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
                    ],
                    counter: counter
                });
                chart.render();

            //Enable pusher logging
            Pusher.logToConsole = true;

            var pusher = new Pusher('fd467d20d3b0858ce2a6', {
                cluster: 'us2' ,
                encrypted: true
            });

            var channel = pusher.subscribe('poll');
            channel.bind('vote', data=>{
                dataPoints = dataPoints.map(x=> {
                    const index = poll.questions.findIndex(item=>{
                        return item.question==data.ques;
                    });
                        if(x.label == data.ans && chart.options.counter == index){
                            totalVotes++;
                            x.y += 1;
                            return x;
                        }
                        else {
                            return x;
                        }
                });
                chart.options.title.text = `Total Votes ${totalVotes}`;
                chart.render();
            });
        }

    }
}
