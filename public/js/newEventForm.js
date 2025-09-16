const isRecurring = document.querySelector('.recurring-event');
const recurringDays = document.querySelector('.recurring-days-options');
const eventDate = document.querySelectorAll('.event-date input');

isRecurring?.addEventListener('change', ()=> {
    recurringDays.style.display = recurringDays.style.display === 'flex' ? 'none' : 'flex';
    for (let i=0; i< eventDate.length; i++) {
        if (eventDate[i].getAttribute('type') === 'datetime-local') {
            eventDate[i].setAttribute('type', 'time');
        } else {
            eventDate[i].setAttribute('type', 'datetime-local');
        }
    }
})