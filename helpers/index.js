module.exports = (hbs) => {
  
  hbs.registerHelper("checkIfUpOrDown", perc => perc > 0 ? 'text-success': 'text-danger');
  hbs.registerHelper("amountFormatter", amount => amount.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  hbs.registerHelper("amountShortener", num => {
      if(num > 1000000 && num < 1000000000){
          return (num/1000000).toFixed(0) + 'M'; // convert to K for number from > 1000 < 1 million 
      }else if(num > 1000000000){
          return (num/1000000000).toFixed(0) + 'B';
      }else if(num < 1000000){
          return num.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ','); // if value < 1000, nothing to do
      }
  });

};
