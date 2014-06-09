#!/bin/bash

#
# Monitor running services, either pgrep or tcp/ip
#

if [ $# -lt 1 ];
then
  echo "[start|stop] is needed"
  exit 1
fi

dn=`dirname $0`
. "$dn/vars.sh"
. "$dn/tools.sh"

function startSrvMon(){
  while [ true ];
  do
  
    val="";
    while read line
    do 
      sname=`echo $line | cut -d'|' -f1`
      type=`echo $line | cut -d'|' -f2`
      
      # assume down!
      status=0;
      
      case "$type" in
	"grep")
	  g=`echo $line | cut -d'|' -f3`
	  status=`ps -ef |  grep "$g" | grep -v "grep" | wc -l`
	;;
	"net")
	  ptype=`echo $line | cut -d'|' -f3`
	  ip=`echo $line | cut -d'|' -f4`
	  port=`echo $line | cut -d'|' -f5`
	  
	  pattr="";
	  if [ "$ptype" == "u" ];
	  then
	    pattr="-u";
	  fi
	  
	  status=`nmap -T5 $pattr -p$port $ip | tail -n 3 | head -n1 | awk -F' *' '{
	    if ($2=="open") print 1;
	    else print 0;
	  }'`
	  
	  ;;
	*)
	  echo "Unknown service monitoring type '$type'"
	  continue;
	  ;;
      esac
      
      # build value
      [[ "$val" != "" ]] && val="$val,";
      
      val="$val {\"name\":\"srv.$sname\", \"columns\": [\"status\"], \"points\": [[$status]]}"
      
    done < "$dn/srv.conf"
    
    curl -X POST -d "[$val]" \
	"http://$HOST:$PORT/db/$DB/series?u=$USER&p=$PASS" &
    
    sleep $SRVINT;
  done
}

case "$1" in
    "start")
      startSrvMon &
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
