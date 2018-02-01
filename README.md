# bms

按分钟统计语句:
db.historydevices.aggregate(
[
{
    $match:
    {
        DeviceId:"1635101264"
    }
},
{
    $group:
    {
        _id:
        {
            ticktime:
            {
                $substrBytes: [ "$DataTime", 0, 16 ]
            }
        },
            tickv:
            {
                $avg: "$BAT_U_HVS"
            },
            ticka:
            {
                $avg: "$BAT_I_HVS"
            }

    }
}
]);
