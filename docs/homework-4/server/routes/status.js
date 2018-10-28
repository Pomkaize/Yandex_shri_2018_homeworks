const express = require('express');
const router = express.Router();
const { get2Digit } = require('../helper');

router.use(function(req, res, next) {
       let now = new Date(),
           startTime = req.app.get('startTime'),
           workingTime = now - startTime;

           /* calculate params from difference */
           let seconds = Math.floor((workingTime/1000) % 60),
               minutes = Math.floor((workingTime/(1000*60)) % 60),
               hours = Math.floor((workingTime/(1000*60*60)) % 60);

           const result = `${get2Digit(hours)}:${get2Digit(minutes)}:${get2Digit(seconds)}`;

       res.status(200).json({status: 'ok', runtime: result})
});

module.exports = router;