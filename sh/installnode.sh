#!/bin/bash
BASEPATH=$(cd `dirname $0`;pwd)
NODEFILENAME=node-v6.10.1-linux-x64.tar.gz
wget https://nodejs.org/dist/v6.10.1/node-v6.10.1-linux-x64.tar.gz
rm $NODEFILENAME -rf
tar -zxvf $NODEFILENAME.tar.gz
sudo rm /usr/sbin/node
sudo rm /usr/sbin/npm
sudo ln -s ${BASEPATH}/$NODEFILENAME/bin/node /usr/sbin/node
sudo ln -s ${BASEPATH}/$NODEFILENAME/bin/npm /usr/sbin/npm
