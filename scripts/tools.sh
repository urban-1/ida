#!/bin/bash

#
# Check if a string exists in an array. Would work with 
# numbers too. 
# 
# ref:http://stackoverflow.com/questions/3685970/bash-check-if-an-array-contains-a-value
#
function elementInArray () {
  local e
  for e in "${@:2}"; do 
    if [ "$e" == "$1" ];then
      echo "1"
      return;
    fi
  done
  
  echo "0";
  return;
} 

#
# Kill all scripts LIKE me! Not the PID ($$) only
#
function killallme(){
  sleep 0.1
  killall `basename $0`
}