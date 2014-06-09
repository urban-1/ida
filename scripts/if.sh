#!/bin/bash

if [ $# -lt 1 ];
then
  echo "[start|stop] is needed"
  exit 1
fi

dn=`dirname $0`
. "$dn/vars.sh"
. "$dn/tools.sh"



function startIfs(){
  
  if [ ${#IFACES[@]} -eq 0 ]; then
    echo "WARNING: Interface monitoring is enabled but there are no interfaces defined..."
    echo "         Fix your vars.sh and populate the IFACES array."
    exit 1
  fi
  
  lines=0
  ifs=$((`cat /proc/net/dev | wc -l` -2))
  mon=0
  
  sar -n DEV $IFINT | while read line
  do
  
    if [ $lines -gt $ifs ] && [ $mon -eq 0 ];then
      echo "  WARNING: No interface name match... exiting"
      exit 1
    fi

    line=`echo -e "$line" |tail -n1`
    # Skip empty
    if [ "$line" == "" ];then
      continue;
    fi
    # Skip 1st
    if [ "`echo "$line" | awk -F' *' '{print $1}'`" == "Linux" ];then
      continue;
    fi
    
    iface=`echo "$line" | awk -F' *' '{print $3}'`;
    # Skip headers
    if [ "$iface" == "IFACE" ];then
      continue;
    fi
    
    if [ $lines -le $ifs ];then
      lines=$(($lines+1))
    fi
    
    # ensure iface is in array
    ifin=`elementInArray "$iface" "${IFACES[@]}"`
    
    if [ "$ifin" == "0" ]; then
      continue;
    fi

    if [ $lines -le $ifs ];then
      echo "  - Starting monitoring interface '$iface'"
      mon=1
    fi
    
    # rxpck/s   txpck/s    rxkB/s    txkB/s   rxcmp/s   txcmp/s  rxmcst/s
    rxpps=`echo "$line" | awk -F' *' '{print $4}'`
    txpps=`echo "$line" | awk -F' *' '{print $5}'`
    
    rx=`echo "$line" | awk -F' *' '{print $6}'`
    tx=`echo "$line" | awk -F' *' '{print $7}'`
    
    rx=`echo "($rx * 8 * 1024)/1" | bc`
    tx=`echo "($tx * 8 * 1024)/1" | bc`
    
  
    postData "[ {\"name\":\"net.if.$iface\",
  		    \"columns\":[\"rx\",\"tx\",\"pxpps\",\"txpps\"],
  		    \"points\":[[$rx,$tx,$rxpps,$txpps]]  } ]" &
  
  done
}




case "$1" in
    "start")
      startIfs &
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
