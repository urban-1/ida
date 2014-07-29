
// // TODO: Multiple hosts, settings file from URL + mod_rewrite
// var HOST = new I.InfluxHost({
//     host :"serusl03",
//     port:8086,
//     user: "root",
//     pass: "root",
//     exclude:["mon.serusl06"]
//   });
// var templates = ["slmon"];



var HOST = new I.InfluxHost({
    host :"scampus",
    port:8086,
    user: "root",
    pass: "root",
    exclude:["urban"]
  });
var templates = ["maps"];


