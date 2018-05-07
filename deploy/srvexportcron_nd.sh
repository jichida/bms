pm2 start ./ecosystem.config.js
DEBUG=srvinterval:* DEBUG_COLORS=1 MONGO_URL=mongodb://192.168.2.17:27007,192.168.2.18:27007/bmscatl \
mongos=true logdir=/catlcluster/log exportdir=/catlcluster/exportdir \
pm2 start /root/bms/deploy/srvintervalexport/index.js

DEBUG=srvinterval:* DEBUG_COLORS=1 MONGO_URL=mongodb://192.168.2.17:27007,192.168.2.18:27007/bmscatl \
mongos=true logdir=/catlcluster/log exportdir=/catlcluster/exportdir \
node /root/bms/deploy/srvintervalexport/index.js

DEBUG=srvinterval:* DEBUG_COLORS=1 MONGO_URL=mongodb://192.168.2.17:27007,192.168.2.18:27007/bmscatl \
mongos=true logdir=/root/bms/deploy/dist/log exportdir=/root/bms/deploy/dist/exportdir \
node /root/bms/deploy/srvintervalexport/index.js
