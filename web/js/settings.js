
// TODO: Multiple hosts
var HOST = new I.InfluxHost({
    host :"serusl03",
    port:8086,
    user: "root",
    pass: "root"
  });
var tree;
var TMPS;
var plots={};
var templates = ["slmon"/*,"sne_maps"*/];

