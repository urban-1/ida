
// TODO: Multiple hosts, settings file from URL + mod_rewrite
var HOST = new I.InfluxHost({
    host :"serusl11",
    port:8086,
    user: "root",
    pass: "root",
    exclude:[""]
  });
var templates = ["dancer"];

// Refresh interval
// INT=3000;
