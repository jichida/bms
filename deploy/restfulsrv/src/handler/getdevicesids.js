const _ = require('lodash');
const DBModels = require('../db/models');
const mongoose = require('mongoose');

const getdevicesids = (userid,callbackfn)=>{
  if(typeof userid === 'string'){
    userid = mongoose.Types.ObjectId(userid);
  }
  const dbModel = DBModels.UserModel;
  dbModel.findOne({ _id: userid })
    .populate([
      {
        path:'devicegroups',
        model: 'devicegroup',
        populate:[
        {
          path:'deviceids', select:'_id DeviceId', model: 'device'
        },
      ]
    }]).lean().exec((err, user)=> {
      // ////console.log(JSON.stringify(user));
      let deviceIds = [];
      let devicegroupIds = [];
      let adminflag = 0;
      let isall = false;
      if(!err && !!user){
        // user = user.toJSON();
        adminflag = _.get(user,'adminflag',0);
        if(adminflag === 1){
          isall = true;
        }
        else{
          const devicegrouplist = _.get(user,'devicegroups',[]);
          isall = _.findIndex(devicegrouplist,(v)=>{
            let match = v._id.toString() === '599b88f5f63f591defcf5f71';//全部设备
            return match;
          }) !== -1;
          if(!isall){
            _.map(devicegrouplist,(groupinfo)=>{
              devicegroupIds.push(mongoose.Types.ObjectId(groupinfo._id));
              let devicelist = _.get(groupinfo,'deviceids',[]);
              // ////console.log(`devicelist=>${JSON.stringify(devicelist)}`)
              _.map(devicelist,(deviceinfo)=>{
                // ////console.log(`deviceinfo=>${JSON.stringify(deviceinfo)}`)
                // ////console.log(`DeviceId=>${deviceinfo.DeviceId}`)
                deviceIds.push(deviceinfo.DeviceId);
              });
            });
          }
        }
      }
      //deviceIds去重
      // ////console.log(`deviceIds==>${JSON.stringify(deviceIds)}`)
      deviceIds = _.uniq(deviceIds);
      callbackfn({
        adminflag,
        devicegroupIds,
        deviceIds,
        isall
      });
  });
}


module.exports = getdevicesids;
