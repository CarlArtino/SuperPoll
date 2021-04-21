//create poll function that calls the backend funciton
function createPoll() {
    theQuestion =document.forms["questions-form"].getElementsByTagName("input")[0].value
    answer1 =document.forms["questions-form"].getElementsByTagName("input")[1].value;
    answer2 = document.forms["questions-form"].getElementsByTagName("input")[2].value;
    answer3 = document.forms["questions-form"].getElementsByTagName("input")[3].value;
    answer4 = document.forms["questions-form"].getElementsByTagName("input")[4].value;
      //This is all dummy test data
      //data will need to be filled with values from user input
      const data = {
          title: null,
          author: null,
          questions: [
              {
                  question:theQuestion ,
                  choices:[answer1, answer2, answer3, answer4]
              }
          ]
      }
      console.log(data);
      //call backend
      fetch('http://localhost:3000/createPoll',{
          method: 'post',
          body: JSON.stringify(data),
          headers: new Headers({
              'Content-Type' :'application/json'
          })
      })
      .then(response =>{
          console.log("Check");
          console.log(response);
          console.log(response.json());
      })
      .catch(err=>console.log(err));
  
  
  }
  