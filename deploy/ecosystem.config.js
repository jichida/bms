module.exports = {
  apps : [
      {
        name: "srvexport",
        script: "/root/bms/deploy/srvintervalexport/index.js",
        watch: true,
        env: {
          "NODE_ENV": "production",
          "DEBUG":"srvinterval:*",
          "DEBUG_COLORS":"1",
          "MONGO_URL":"mongodb://192.168.2.17:27007,192.168.2.18:27007/bmscatl",
          "mongos":"true",
          "logdir":"/root/bms/deploy/dist/exportdir",
          "exportdir":"exportdir=/root/bms/deploy/dist/exportdir"
        }
      }
  ]
}
