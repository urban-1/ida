#!/bin/bash

dn=`dirname $0`
. "$dn/vars.sh"

if [ $# -lt 1 ];
then
  echo "[start|stop] is needed"
  exit 1
fi

function start() {
  cpus=`lscpu | grep '^CPU(s):' | awk -F' *' '{print $2}'`
  for ((i=0; i<$cpus; i++))
  do
    echo "  - CPU $i "
    $dn/cpu.sh "$i" &
  done
  
  echo "  - CPU ALL "
  $dn/cpu.sh "ALL" &
}

function stop(){
  killall 'cpu.sh' 2> $DN
}

case "$1" in
    "start")
      start;
    ;;
    "stop")
      stop;
    ;;
    *)
      echo "Wrong argument '$1'. Exiting."
      exit 2
    ;;
esac

exit 0


