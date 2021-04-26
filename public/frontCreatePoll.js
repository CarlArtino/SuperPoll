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
          console.log("code is: ",data);
          deleteForm(data);
      })
      .catch(err=>console.log(err));
    e.preventDefault();
});

const deleteForm = (code) => {
    const form = document.getElementById("questions-form");
    form.remove();
    
    const container = document.getElementById("center-point");
    
    const pollContainer = document.createElement("h1");
    // pollContainer.setAttribute("id", "poll-code");
    // pollContainer.setAttribute("class", "mw-100 mh-100 text-xl-center");
    
    // pollContainer.innerHTML = "Success!!\n" +"\nYour New Poll Code is:\n" + code;
    container.setAttribute("class", "justify-content-center")
    container.appendChild(createText("Success!!", null));
    container.appendChild(createBr());
    container.appendChild(createText("Your new poll code is:" ));
    container.appendChild(createBr());
    container.appendChild(createText(code, "bg-success", true));

}

function createText(text, color, isLink) {
    const textElement = document.createElement("h1");

    textElement.innerHTML = text;
    textElement.setAttribute("class", color + " text-center");
    // if(isLink == true) {
    //     const link = document.createElement("a");
    //     link.setAttribute("href", "/?" + code);
    //     link.appendChild(textElement);
    //     return link;
    // }

    return textElement;
}

createBr = () => {
    return document.createElement("br");
}
  