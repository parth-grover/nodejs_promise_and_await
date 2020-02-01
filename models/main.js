var mysqldb = require('../mysqldb');
var logger = require('../logger');
const main = {
}

main.get = (uri) => {
	return new Promise((resolve, reject) => {
		mysqldb.query("SELECT *  FROM `table_name` WHERE product_uri = ?", uri, function (err, result) {
			if (err) {
				reject(err);
			}
			else if (result.length)
				resolve(result[0]);
			else
				resolve(null);
		});
	})
}



main.finished_stock = (product_code) => {
	return new Promise((resolve, reject) => {
		mysqldb.query("select * from `table_name` where product_code = ?", product_code, (err, result) => {
			if (err) {
				reject(err);
			}
			else if (result.length)
				resolve(result);
			else
				resolve(null);
		})
	})
}

module.exports = main;