#!/bin/bash

dn=`dirname $0`
. "$dn/vars.sh"

if [ $# -lt 1 ];
then
  echo "[start|stop|restart] is needed"
  exit 1
fi

function doAct(){
  act="$1";

  for i in ${MODS[@]}
  do
    echo " * ${act^}ing module '$i'"
    "$dn/$i.sh" "$act" 
  done
}


case "$1" in
    "start")
      doAct $1;
    ;;
    "stop")
      doAct $1;
    ;;
    "restart")
      doAct 'stop';
      sleep 1
      doAct 'start';
    ;;
    *)
      echo "Wrong argument '$1'. Exiting."
      exit 2
    ;;
esac




exit 0

