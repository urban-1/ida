#!/bin/bash

#
# ping www.google.com -c 4 -A | tail -n2
# ping www.google.com -c 4 -A | tail -n1  | cut -d',' -f1 | cut -d'=' -f2 | cut -d ' ' -f2
#

if [ $# -lt 1 ];
then
  echo "[start|stop] is needed"
  exit 1
fi

dn=`dirname $0`
. "$dn/vars.sh"
. "$dn/tools.sh"


#
# Ping 
# 
function pingSite(){
  # get data..
  pd=`ping $PINGFLAGS "$1" | tail -n2`
  
  
  drops=`echo -e "$pd" | head -n1 | cut -d',' -f3 | cut -d' ' -f2 | sed 's/%//g'`
  
  # Stats
  stats=`echo -e "$pd" | tail -n1  | cut -d',' -f1 | cut -d'=' -f2 | cut -d ' ' -f2`
  
  min=`echo $stats | cut -d'/' -f1`
  avg=`echo $stats | cut -d'/' -f2`
  max=`echo $stats | cut -d'/' -f3`
  
  val="[{\"name\": \"net.ping.$1\",
	 \"columns\": [\"min\",\"avg\",\"max\",\"drops\"],
	 \"points\": [[$min,$avg,$max,$drops]]
	}]";
	
  postData "$val" &
}

function startPing(){
  
  if [ ${#PING[@]} -eq 0 ]; then
    echo "WARNING: Pinging remote machine is enabled but there are no destinations configured..."
    echo "         Fix your vars.sh and populate the PING array."
    exit 1
  fi
  
  while [ true ];
  do
    for i in "${PING[@]}"
    do
      pingSite $i &
    done
    
    sleep $PINGINT
  done
}


case "$1" in
    "start")
      startPing &
    ;;
    "stop")
      killallme &
    ;;
    *)
      echo "Wrong argument '$1'. Exiting."
      exit 2
    ;;
esac

exit 0