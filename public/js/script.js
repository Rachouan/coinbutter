const transactionForm = document.querySelectorAll('.transactionForm form');

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
  },
  false
);
