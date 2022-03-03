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
  hbs.registerHelper("round2", amount => amount.toFixed(2));
  hbs.registerHelper("round4", amount => amount.toFixed(4));
  hbs.registerHelper("roundSatochi", amount => amount.toFixed(8));
  //hbs.registerHelper("checkIfUpOrDownFormatted", amount => (amount.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ',')) > 0 ? 'text-success': 'text-danger');
  hbs.registerHelper("DateFormater", date => date?date.toLocaleDateString("fr"):date); 
};
