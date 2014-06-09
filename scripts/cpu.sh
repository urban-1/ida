#!/bin/bash

dn=`dirname $0`
. "$dn/vars.sh"
. "$dn/tools.sh"

if [ $# -lt 1 ];
then
  echo "Core number is needed... Use ALL for average"
  exit
fi

core="-P $1"
s=$1
if [ "$1" == "ALL" ];
then
  core=""
  s=""
fi



while read line
do

  line=`echo -e "$line" |tail -n1`
  # Skip empty
  if [ "$line" == "" ];then
    continue;
  fi
  # Skip 1st
  if [ "`echo "$line" | awk -F' *' '{print $1}'`" == "Linux" ];then
    continue;
  fi
  # Skip headers
  if [ "`echo "$line" | awk -F' *' '{print $3}'`" == "CPU" ];then
    continue;
  fi

  
  # sys, user, idle    
  U=`echo "$line" | awk -F' *' '{print $4}'`
  S=`echo "$line" | awk -F' *' '{print $6}'`
  I=`echo "$line" | awk -F' *' '{print $9}'`
  T=`echo "$U $S"  | awk '{printf "%f", $1 + $2}'`

  postData "[ {\"name\":\"cpu.cpu$s\",
		    \"columns\":[\"total\",\"user\",\"system\",\"idle\"],
		    \"points\":[[$T,$U,$S,$I]]  } ]"  &
done < <(sar $core $CPUINT)

exit 0
