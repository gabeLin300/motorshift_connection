const accTypeSelect = document.getElementById('acc-type-selection');
const nameFields = document.getElementsByClassName('name-field');
const companyName = document.querySelector('.company-name');

accTypeSelect?.addEventListener('change', ()=>{
    if (accTypeSelect.options[accTypeSelect.selectedIndex].value === "Business") {
        companyName.style = 'display:flex;';
        companyName.getElementsByTagName('input')[0].removeAttribute('disabled');
    } else {
        companyName.style = 'display:none;';
        companyName.getElementsByTagName('input')[0].setAttribute('disabled','');
    }
})
