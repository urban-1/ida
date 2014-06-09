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
    echo "WARNING: Disk monitoring is enabled but there are no partitions defined..."
    echo "         Fix your vars.sh and populate the DISKS array."
    exit 1
  fi
  
  first=1
  while [ true ];
  do
    val="";
    
    # Loop DF output
    while read line
    do
      # works only for field 1!
      dname=`echo "$line" | cut -d' ' -f1 | awk -F'\/' '{print $NF}' `
      
      if [ `elementInArray "$dname" "${DISKS[@]}"` -eq 0 ]; then
	continue;
      fi
      
      # 1K-block used (bytes) | free (bytes)
      T=`echo "$line" | awk -F' *' '{printf "%.0f",$2*1024}'`
      U=`echo "$line" | awk -F' *' '{printf "%.0f",$3*1024}'`
      F=`echo "$line" | awk -F' *' '{printf "%.0f",$4*1024}'`
      
      [[ "$val" != "" ]] && val="$val,";
      
      val="$val {\"name\":\"disks.$dname\",
		\"columns\":[\"total\",\"used\",\"free\"],
		\"points\":[[$T,$U,$F]] } "
      
      if [ $first == 1 ]; then 
	echo "  - Starting monitoring on partition '$dname'"
      fi
      
    done < <(df)
    
    first=0;
    
    
    curl -X POST -d "[$val]" \
	    "http://$HOST:$PORT/db/$DB/series?u=$USER&p=$PASS" &
    val="";
    
    sleep $DISKINT
  done 
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
