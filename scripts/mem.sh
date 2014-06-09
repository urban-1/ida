#!/bin/bash 
dn=`dirname $0`
. "$dn/vars.sh"
. "$dn/tools.sh"

if [ $# -lt 1 ];
then
  echo "[start|stop] is needed"
  exit 1
fi

function startMem(){
  while [ true ];
  do
    used=`free -b | grep Mem | awk -F' *' '{print $3}'`
    free=`free -b | grep Mem | awk -F' *' '{print $4}'`
    sused=`free -b | grep Swap | awk -F' *' '{print $3}'`
    sfree=`free -b | grep Swap | awk -F' *' '{print $4}'`
    
   postData "[ {\"name\":\"mem.ram\",
		  \"columns\":[\"used\",\"free\"],
		  \"points\":[[$used,$free]]  },
		  {\"name\":\"swap\",
		  \"columns\":[\"used\",\"free\"],
		  \"points\":[[$sused,$sfree]] }
		  ]"  &

    sleep $MEMINT;
  done
}


case "$1" in
    "start")
      startMem &
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

