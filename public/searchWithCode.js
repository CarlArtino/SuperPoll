const form = document.getElementById("code-form");

//Event listener for "start voting" button
form.addEventListener('submit', e => {
    const id = {_id: document.getElementById("code-text").value};

    //call back end to get object from id
    fetch('https://blooming-atoll-12908.herokuapp.com/getPoll',{
        method: 'post',
        body: JSON.stringify(id),
        headers: new Headers({
            'Content-Type' :'application/json'
        })        
    })
    .then(response => response.json())
    .then(data =>{
        console.log(data);
        localStorage.setItem("poll", JSON.stringify(data));
        window.location.replace( 'https://blooming-atoll-12908.herokuapp.com/vote_page.html');
    })
    .catch(err=>console.log(err));

    e.preventDefault();
    
});