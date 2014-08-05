# IDA
===

Influxdb DAshboard

![Example Screenshot]
(https://raw.github.com/urban-1/ida/master/images/demo.png)

## Intro
 
This is an abstract influxdb dashboard using jqplot. The main concept is that a 
DB server is queried and all DBs and series are listed as a tree. Each series can 
be dragged and dropped into a floating DIV element. At that moment a template is 
loaded (templates/*) which has influx options and plotting options. The templates
have to be edited manually (JSON) atm... 

This is far from being a production system, it is however very easy to setup
(TODO: manual :) ) and one can get simple plots in 5-10 minutes

TODO: WTFM! (W from Write)

## Setup

We assume that you have already installed influxdb on any host in your network
and it is accessible (API port) from the IDA host. The installation steps are:

1. Clone the project (we prefer `/opt/ida`)
2. Setup your web server. If is apache, you can edit the config/ida file and
place it in the correct folder of your distro.
3. Edit the main web configuration (`web/js/config/default.cfg.js`) with the correct
influxdb host/port values.
4. If you have no data and you want to generate some, you can edit the scripts/vars.sh.
These are simple shell scripts that will log CPU,memory,disk,traffic and ping 
information to the influxdb. All series/data should be in dot format ie: 
hostname.net.if.eth0

At this point, visiting `http://<yourHost>/ida` you should see a list of DBs and 
series. If you followed step #4, then make sure that your web configuration 
includes "slmon" in the templates. These are basic templates for plotting monitoring
data.

## Project structure

The major files and config for the web are:

1. config/default.cfg.js: In here you specify the influxdb host settings and the 
templates that you want to use. An update/refresh interval can also be set here
but it is optional.

2. templates: All templates are located into this folder and the file name format is
temp.<name>.json.js. Each template defined in the cfg file will be load. When a series
is dropped in a plotting area, the template that matches closer the full series name 
will be used, examples:
 - series: `hostname.db.net.if.eth0`, matches template `net.if`
 - series: `hostname.db.net.if.lo`, matches template `net.if.lo` (overrides `net.if`)
 - series: `hostname.db.net.if.ra0`, matches template `hostname.db.net.if.ra0`
 - etc...


## Hacking
... (Urban Malaka)
