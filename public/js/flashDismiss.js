const flashMessages = document.getElementsByClassName('flash-message');

for(let i=0; i<flashMessages.length; i++) {
    flashMessages.item(i)?.addEventListener('click', ()=>{
        flashMessages.item(i).style = 'display: none;';
    })
}