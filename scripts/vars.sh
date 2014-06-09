#!/bin/bash

#
# Configuration
#

# Database...
DBPRE="mon"
HOST="localhost";
PORT=8086;
USER="root";
PASS="root";

# Intervals... to be increased for production...
CPUINT=5	# CPU INTERVAL
MEMINT=60	# MEMORY INTERVAL
IFINT=2		# NET INTERFACE
DISKINT=60	# DISK INTERVAL
DISKIOINT=5	# DISK IO INTERVAL
SRVINT=60	# service status


# Enabled modules
MODS=("mem" "cpus" "if" "disks" "diskio" "srv");
IFACES=("eth0" "lo");
DISKS=("vgdata-data" "ubuntu-root");
DISKIO=("vgdata-data" "ubuntu-root", "ubuntu-swap_1");


#
# Auto generated variables
#
DN="/dev/null"
DB="$DBPRE.`hostname`"


