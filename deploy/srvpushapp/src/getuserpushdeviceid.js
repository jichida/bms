const _ = require('lodash');
const DBModels = require('./handler/models.js');
const mongoose = require('mongoose');
const debug = require("debug")("alarmpush");
const getuserpushdeviceid = (did,callbackfn)=>{
  //根据DeviceId找到devicegroups
  const didobj = did;
  if(typeof did === 'string'){
    didobj = mongoose.Types.ObjectId(did)
  }
  debug(`getuserpushdeviceid->${did}`);
  const dbGroupModel = DBModels.DeviceGroupModel;
  dbGroupModel.find({deviceids:didobj}).lean().exec((err,groupidlist)=>{
    debug(`groupidlist->${JSON.stringify(groupidlist)}`);

    if(!err && !!groupidlist){
      let groupids = [];
      _.map(groupidlist,(group)=>{
        groupids.push(group._id);
      });
      //循环groupsid获得,{ $elemMatch: { $in:groupidlist } }
      const dbModel = DBModels.UserModel;
      dbModel.find({'alarmsettings.devicegroups':{ $elemMatch: { $in:groupids } }}).lean().exec((err,userlistresult)=>{
        debug(`userlistresult->${JSON.stringify(userlistresult)}`);

        if(!err && !!userlistresult){
          let userlist = [];
          _.map(userlistresult,(user)=>{
            userlist.push({
              userid:user._id.toString(),
              warninglevels:_.get(user,'alarmsettings.warninglevels',[])
            });
          });
          callbackfn(userlist);
        }
        else{
          callbackfn([]);
        }
      });
    }
    else{
      callbackfn([]);
    }
  });

};


module.exports = getuserpushdeviceid;
