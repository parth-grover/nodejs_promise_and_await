var express = require('express');
var router = express.Router();
var main = require('../models/main');
var logger = require('../logger');
const { check, oneOf, validationResult, sanitizeBody } = require('express-validator');
const { buildCheckFunction } = require('express-validator');
const checkParams = buildCheckFunction(['params']);

/* GET home page. */
router.get('/:uri',
    oneOf([
        [
            checkParams('uri').not().isNumeric(),
        ]
    ]), async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.info(`Validation failed for inputs at externals${req.url}`);
            return res.status(400).json({
                status: "failed",
                message: "Invalid request framing.",
                errors: errors.array()
            });
        }

        try {
            const product = await main.get(req.params.uri);
            if (product) {
                const stock = await main.finished_stock(product["product_code"]);
                if (stock) {
                    return res.status(200).json({ status: 'success', message: 'Data found', data: stock })
                } else {
                    return res.status(401).json({ status: 'failed', message: 'No Stock found', data: null })
                }
            } else {
                return res.status(401).json({ status: 'failed', message: 'No product found', data: null })
            }
        } catch (err) {
            logger.error(err);
            return res.status(500).json({ status: 'failed', message: 'Unable to process request' });
        }



        /*main.get(req.params.uri).then(product => {
            return new Promise((resolve, reject) => {
                if (product)
                    resolve(product);
                else
                    reject(product);
            })
        }).then(product => {
            return main.finished_stock(product["product_code"]);
        }).then(stock => {
            if (stock) {
                return res.status(200).json({ status: 'success', message: 'Data found', data: stock })
            } else {
                return res.status(401).json({ status: 'sucess', message: 'No Stock found', data: null })
            }
        }).catch(err => {
            if (err === null)
                return res.status(401).json({ status: 'sucess', message: 'No product found', data: null })
            else
                return res.status(500).json({ status: 'failed', message: 'Unable to process request', error: err });
		})*/
        //main.get(req.params.uri);
    });

module.exports = router;
