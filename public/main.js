const form = document.getElementById("vote-form");
form.addEventListener('submit', (e) => {
    const choice = document.querySelector('input[name=ans]:checked').nodeValue;
    const data = {ans:choice};

    fetch('http://locahost:300/poll', {
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