const form = document.getElementById("code-form");

//Event listener for "start voting" button
form.addEventListener('submit', e => {
    const id = {_id: document.getElementById("code-text").value};
    console.log(id);
    //call back end to get object from id
    fetch('http://localhost:3000/getPoll',{
        method: 'post',
        body: JSON.stringify(id),
        headers: new Headers({
            'Content-Type' :'application/json'
        })        
    })
    .then(response => response.json())
    .then(data =>{
        console.log("Check");
        console.log(data);
        localStorage.setItem("poll", JSON.stringify(data));
        window.location.replace( 'http://www.localhost:3000/vote_page.html');
    })
    .catch(err=>console.log(err));

    e.preventDefault();
    
});