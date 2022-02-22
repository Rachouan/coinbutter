class Helper{
    amountFormatter(amount){
        return amount.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    concatString(str){
        return str.replace(/\s+/g, '-').toLowerCase();
    }
}

const helper = new Helper();

module.exports = helper;