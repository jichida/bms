 config set maxmemory 30837462880

====检查数据====
#执行数据库
sudo docker run -it -v /root:/root mongo:3.4 bash
mongo --host 192.168.1.20 --port 27007
use bms
===============
db.getCollection('historydevices').find({"organizationid" : ObjectId("599af5dc5f943819f10509e6")},
{SN64:1,DataTime:1,DeviceId:1,NodeID:1,UpdateTime:1,recvpartition:1,recvoffset:1,sendpartition:1,indexrecvpartition:1,indexrecvoffset:1}).sort({'DataTime':-1}).limit(100)

db.getCollection('historydevices').find({"organizationid" : ObjectId("599af5dc5f943819f10509e6")},
{SN64:1,DataTime:1,DeviceId:1,NodeID:1,UpdateTime:1}).sort({'SN64':1}).limit(2)
db.getCollection('historydevices').find({"organizationid" : ObjectId("599af5dc5f943819f10509e6")},
{SN64:1,DataTime:1,DeviceId:1,NodeID:1,UpdateTime:1}).sort({'DataTime':-1}).limit(2)
db.getCollection('historydevices').find({"organizationid" : ObjectId("599af5dc5f943819f10509e6")},
{SN64:1,DataTime:1,DeviceId:1,NodeID:1,UpdateTime:1}).sort({'DataTime':1}).limit(2)

db.getCollection('historydevices').find({"organizationid" : ObjectId("599af5dc5f943819f10509e6"),SN64:5885001},
{SN64:1,DataTime:1,DeviceId:1,NodeID:1,UpdateTime:1}).sort({'SN64':-1}).limit(100)
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
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
{ "_id" : ObjectId("5a7dd5b1daa07f000173e59c"), "DataTime" : "2018-02-09 23:59:39", "DeviceId" : "1501102801", "NodeID" : "412", "SN64" : 5696408, "UpdateTime" : "2018-02-10 01:09:05", "recvpartition" : 344, "recvoffset" : 71 }
{ "_id" : ObjectId("5a7dd5753659a30001ca8104"), "DataTime" : "2018-02-09 23:59:39", "DeviceId" : "1501102801", "NodeID" : "124", "SN64" : 5696408, "UpdateTime" : "2018-02-10 01:08:05", "recvpartition" : 344, "recvoffset" : 56 }

打印topic中：db.historydevices 中344 分区中 位于55～72的值

{ "_id" : ObjectId("5a7de4924848dd0001a7eb1f"), "DataTime" : "2018-02-10 00:05:46", "DeviceId" : "1501104870", "NodeID" : "427", "SN64" : 5979419, "UpdateTime" : "2018-02-10 02:12:34", "indexrecvpartition" : 47, "indexrecvoffset" : 172374, "recvpartition" : 155, "recvoffset" : 667 }
{ "_id" : ObjectId("5a7de404ab98860001086a40"), "DataTime" : "2018-02-10 00:05:46", "DeviceId" : "1501104870", "NodeID" : "318", "SN64" : 5979419, "UpdateTime" : "2018-02-10 02:10:12", "indexrecvpartition" : 47, "indexrecvoffset" : 172374, "recvpartition" : 155, "recvoffset" : 667 }
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

docker run -it confluentinc/cp-kafka:4.0.0 bash
kafka-console-consumer --bootstrap-server 192.168.1.114:9092 --topic bmsindex --offset 10000 --partition 1 --max-messages 100
