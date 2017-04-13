#!/bin/sh
DOMAIN=flaviouemura.com
PORT=3000

# Find configured IPv4 addresses, skip localhost
IP=`ifconfig |grep -oE "(inet )([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)"|awk '{print $2}' | grep -v "127.0.0.1"`
echo "Your IP:       $IP"

# Replace periods with hyphens
HOSTNAME=`echo $IP | tr '.' '-'`
# Append the domain name
HOSTNAME="${HOSTNAME}.${DOMAIN}"
#HOSTNAME="10-0-10-15.${DOMAIN}"
echo "Hostname:      $HOSTNAME"
