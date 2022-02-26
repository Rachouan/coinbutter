class Helper{
    amountFormatter(amount){
        return amount.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    concatString(str){
        return str.replace(/\s+/g, '-').toLowerCase();
    }
    round(num) {
        var m = Number((Math.abs(num) * 100).toPrecision(15));
        return Math.round(m) / 100 * Math.sign(num);
    }
}

const helper = new Helper();

module.exports = helper;