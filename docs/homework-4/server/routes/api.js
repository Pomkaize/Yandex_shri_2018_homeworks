const express = require('express');
const router = express.Router();
const path = require('path');
const { getJson } = require('../helper');

const allowedEventTypes = {
    info: true,
    critical: true
};
/* считаем, что json мы получили уже отсортированным с базы данных по времени */
let json = getJson(path.resolve(__dirname + '../../events.json')),
    events = json.events;

router.post('/api/events', function(req, res) {

    const types = req.body.type || null,
          pagination = req.body.pagination || null;
          /* check allowed types */

        /* types checks*/
        if(!types || !Array.isArray(types) || types.length === 0) {
            return res.status(400).json({ status: 'failed', message: `Bad types: \'${types}\'` })
        }

      types.forEach(function(type) {
         if(!allowedEventTypes[type]) {
            return res.status(400).json({ status: 'failed', message: `Bad type: \'${type}\'` })
         }
      });

    /* pagination checks */
        if(pagination) {
           if(!pagination.from) {
              return res.status(400).json({ status: 'failed', message: `Required parameter \'from'
              \ is empty`})
           }
        }
        /* filtered by certain type and from certain position */
      let result = events.filter((event, index)=>{
          if(!pagination) {
             return types.includes(event.type)
          }

          return index >= pagination.from - 1 && types.includes(event.type)
      });

      /* check that we have needed count of results */
      if(pagination && pagination.count) {
          if(pagination.count > result.length) {
              return res.status(400).json({ status: 'failed', message: `Count ${pagination.count} is too much`})
          }
          result = result.slice(0, pagination.count)
      }

   return res.status(200).json({ status: 'ok', events: result })
});

module.exports = router;