====检查数据====
#执行数据库
sudo docker run -it -v /root:/root mongo:3.4 bash
mongo --host 192.168.1.20 --port 27007
use bms
===============
db.getCollection('historydevices').find({"organizationid" : ObjectId("599af5dc5f943819f10509e6")},
{SN64:1,DataTime:1,DeviceId:1,NodeID:1,UpdateTime:1}).sort({'SN64':-1}).limit(1)
db.getCollection('historydevices').find({"organizationid" : ObjectId("599af5dc5f943819f10509e6")},
{SN64:1,DataTime:1,DeviceId:1,NodeID:1,UpdateTime:1}).sort({'SN64':1}).limit(2)
db.getCollection('historydevices').find({"organizationid" : ObjectId("599af5dc5f943819f10509e6")},
{SN64:1,DataTime:1,DeviceId:1,NodeID:1,UpdateTime:1}).sort({'DataTime':-1}).limit(2)
db.getCollection('historydevices').find({"organizationid" : ObjectId("599af5dc5f943819f10509e6")},
{SN64:1,DataTime:1,DeviceId:1,NodeID:1,UpdateTime:1}).sort({'DataTime':1}).limit(2)
===============
db.historydevices.findOne({
  "organizationid" : ObjectId("599af5dc5f943819f10509e6"),
  "DataTime":{
      "$gte":"2018-02-09 08:00:00",
      "$lte":"2018-02-09 12:00:00"
  }
},{SN64:1,DataTime:1,DeviceId:1,NodeID:1,UpdateTime:1});
db.historydevices.aggregate([
    {
        $match:
        {
            "organizationid" : ObjectId("599af5dc5f943819f10509e6"),
            "DataTime":{
                $gte:'2018-02-09 08:00:00',
                $lte:'2018-02-09 12:00:00'
            }
        }
    },
    {
        $group:
        {
            _id:
            {
                ticktime:
                {
                    $substrBytes: [ "$DataTime", 0, 13 ]
                }
            },
            count:
            {
                $sum: "$_id"
            },
        }
    },
    {
        $sort: {
            "_id.ticktime": 1
        }
    }
]);
