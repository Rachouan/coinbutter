class Helper{
    amountFormatter(amount){
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
}

const helper = new Helper();

module.exports = helper;