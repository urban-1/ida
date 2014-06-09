#!/bin/bash

#
# select * from disks where name='/dev/mapper/vgdata-data'
# select distinct(name) from disks
#

if [ $# -lt 1 ];
then
  echo "[start|stop] is needed"
  exit 1
fi

dn=`dirname $0`
. "$dn/vars.sh"
. "$dn/tools.sh"

function startDisks(){
  
  if [ ${#DISKS[@]} -eq 0 ]; then
    echo "WARNING: Disk IO monitoring is enabled but there are no partitions defined..."
    echo "         Fix your vars.sh and populate the DISKIO array."
    exit 1
  fi
  
  lines=0
  mon=0
  dnum=`sar -p -d 1 1 | grep -v "Average" | grep -v "^$" | grep -v Linux | wc -l`

    
  # Loop SAR output
  while read line
  do
    if [ $lines -gt $dnum ] && [ $mon -eq 0 ];then
      echo "  WARNING: No disk name match... exiting"
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
    
    dname=`echo "$line" | awk -F' *' '{print $3}'`;
    # Skip headers
    if [ "$dname" == "DEV" ];then
      continue;
    fi
    
    if [ $lines -le $dnum ];then
      lines=$(($lines+1))
    fi
    
    # ensure iface is in array
    din=`elementInArray "$dname" "${DISKIO[@]}"`
    
    if [ "$din" == "0" ]; then
      continue;
    fi

    if [ $lines -le $dnum ];then
      echo "  - Starting monitoring IO on disk '$dname'"
      mon=1
    fi
    
    # tps  rd_sec/s  wr_sec/s  avgrq-sz  avgqu-sz     await     svctm     %util
    tps=`echo "$line" | awk -F' *' '{print $4}'`
    rdsec=`echo "$line" | awk -F' *' '{print $5}'`
    
    wrsec=`echo "$line" | awk -F' *' '{print $6}'`
    wait=`echo "$line" | awk -F' *' '{print $9}'`
    util=`echo "$line" | awk -F' *' '{print $11}'`
    
  
    curl -X POST -d "[ {\"name\":\"io.$dname\",
  		    \"columns\":[\"tps\",\"read\",\"write\",\"wait\",\"util\"],
  		    \"points\":[[$tps,$rdsec,$wrsec,$wait,$util]]  } ]" \
  		"http://$HOST:$PORT/db/$DB/series?u=$USER&p=$PASS" &
  done < <(sar -p -d $DISKIOINT)
}


case "$1" in
    "start")
      startDisks &
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
