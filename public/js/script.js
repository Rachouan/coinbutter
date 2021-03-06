const transactionForm = document.querySelectorAll('.transactionForm form');
const darkmode = document.querySelectorAll('.darkmode-switch');
const root = document.querySelector(':root');
const storage = window.localStorage;
let theme = storage.getItem('theme') || 'light';

function updateTotal(price,amount,total){
  const totalValue = price.value * amount.value;
  total.value = totalValue.toFixed(2);
}
$(document).ready(function() {
  function formatState (state) {
    if (!state.id) {
      return state.text;
    }
    var url = state.element.dataset.image;
    var $state = $(
      `<span><img src="${url}" class="coin-icon me-2" />${state.text}</span>`
    );
    return $state;
  };
  $('.coinSelect').select2({
    templateResult: formatState
  });
  $(".js-example-templating").select2({
    
  });
  
})

document.addEventListener(
  "DOMContentLoaded",
  () => {

    root.dataset.theme = theme;
    feather.replace();
    
    const swiper = new Swiper('.swiper', {
      // Default parameters
      slidesPerView: 'auto',
      spaceBetween: 10,
    });

    darkmode.forEach(mode => {
      
      if(theme === 'light'){
        if(mode.getAttribute('id') === 'darkmodeoff') mode.checked = true;
      }else if(theme === 'dark'){
        if(mode.getAttribute('id') === 'darkmodeon') mode.checked = true;
      }

      mode.addEventListener('change',e =>{
        theme = e.currentTarget.value.toLowerCase() === 'on' ? 'dark':'light'; 
        root.dataset.theme = theme;
        storage.setItem('theme',theme);
      })
    })

    transactionForm.forEach(form =>{
      const coinSelection = form.querySelector('.coinSelect');
      
      //coinSelection.select2();
      const priceField = form.querySelector('#price');
      const amountField = form.querySelector('#amount');
      const totalField = form.querySelector('#total');

      priceField.addEventListener('keyup', (e) => {
        updateTotal(priceField,amountField,totalField);
      });

      amountField.addEventListener('keyup', (e) => {
        updateTotal(priceField,amountField,totalField);
      });

      coinSelection.addEventListener('change', (e) => {
        var cp = e.target.options[e.target.selectedIndex].dataset.coinPrice;
        console.log(cp);
        priceField.value = cp;
        updateTotal(priceField,amountField,totalField);
      });
    })
    
    const charts = document.querySelectorAll('.chart');
    charts.forEach(chart => new Chart().createChart(chart,chart.dataset.graph.split(',')));
    //const chart = new Chart();
    //chart.createChart('.chart',[5,10,15,30,1,3,5,20]);
  },
  false
);
