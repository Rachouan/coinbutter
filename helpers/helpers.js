class Helper{
    amountFormatter(amount){
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    concatString(str){
        return str.replace(/\s+/g, '-').toLowerCase();
    }
}

const helper = new Helper();

module.exports = helper;