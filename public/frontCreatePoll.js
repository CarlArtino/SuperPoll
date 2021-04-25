const form = document.getElementById("questions-form");
//create poll function that calls the backend funciton
form.addEventListener('submit', e=> {
    
    //Format data from inputs
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const numOfQuestions = document.getElementById("numOfQuestions").value;

    const questions = [];

    for(let i = 0; i<numOfQuestions; ++i)
    {
        let questionTemp = document.getElementById(i.toString()+"0").value;
        let choices = [];
        for(let j=1; j<=4; ++j){
            choices.push(document.getElementById(i.toString()+j.toString()).value);
        }
        let choicesTemp = [...choices];
        const obj = {
            question: questionTemp,
            choices: choicesTemp
        };
        
        questions.push(obj);
        choices.length = 0;

    }

      //Data for db
      const data = {
          title: title,
          author: author,
          questions: questions
      };
      console.log(data);
      //call backend
      fetch('http://localhost:3000/createPoll',{
          method: 'post',
          body: JSON.stringify(data),
          headers: new Headers({
              'Content-Type' :'application/json'
          })        
      })
      .then(response => response.json())
      .then(data =>{
          console.log("Check");
          console.log(data);
      })
      .catch(err=>console.log(err));
    e.preventDefault();
});
  