document.addEventListener("DOMContentLoaded", () =>{
    //simple date object to format in a more readable way to user
    const eventDate = document.querySelectorAll(".event-time");
    if(eventDate) {
        eventDate.forEach(element => {
            element.textContent = new Date(element.textContent).toString();
        })
    }
});
