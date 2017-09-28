/**
 * RPC Demo Sift. DAG's 'Node1' node implementation
 */
'use strict';

// Entry point for DAG node
// got ={
//   in: ... // contains the key/value pairs that match the given query
//   with: ... // key/value pairs selected based on the with selection
//   lookup: ... // an array with result of lookup for a specific key
//   query: ... // an array containing the key hierarchy
// }
// for more info have a look at:
// http://docs.redsift.com/docs/server-code-implementation
module.exports = function (got) {
  const inData = got.in;
  var promises = [];

  var rpcUUID;
  got.lookup.forEach(function (lookup) {
    if (lookup.data.key === 'rpc/uuid') {
      rpcUUID = lookup.data.value.toString();
    }
    if (lookup.data.key === 'user/permissions') {
      console.log('permissions = ', lookup.data.value.toString());
    }
  });

  for (var d of inData.data) {
    if (d.value) {
      try {
        // parse raw request
        var req = JSON.parse(d.value);
        //console.log("request:",req);
        var res = {key : rpcUUID/*d.key*/, value: {
                status_code: 200,
                header: req.header,
                body: req.body
              }};
        promises.push(
          new Promise(function (resolve, reject) {
              //console.log("response:", JSON.stringify(res));
              resolve(res);
          })
        );
      } catch (ex) {
        console.error('bot.js: Error parsing value for: ', d.key);
        console.error('bot.js: Exception: ', ex);
        continue;
      }
    }
  }

  return promises;
};
