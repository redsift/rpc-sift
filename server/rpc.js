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
  const inLookup = got.lookup;
  for (var inl of inLookup) {
    var d = inl.data
    console.log("This are the lookup data:", d.key)
    if(d.value){
      console.log("value:", d.value.toString())
    }
  }
  var promises = [];

  for (var d of inData.data) {
    if (d.value) {
      try {
        // parse raw request
        var req = JSON.parse(d.value);
        //console.log("request:",req);
        var res = {
          name: "api_rpc",
          key : d.key,
          value: {
              status_code: 200,
              header: req.header,
              body: req.body
            }}
        promises.push(
          new Promise((resolve, reject) => {
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

  const settings = inLookup[2].data.value ?
    JSON.parse(inLookup[2].data.value) :
    null;

  console.log('[rpc-sift|rpc.js] settings:', JSON.stringify(settings, null, 4));

  promises.push(new Promise( (resolve) => {resolve({
    name: 'settings',
    key: 'user',
    value: settings,
  })}));

  return promises;
};
