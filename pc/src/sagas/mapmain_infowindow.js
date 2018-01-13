/**
 * Created by wangxiaoqing on 2017/5/27.
 */
import config from '../env/config';

if (config.softmode === 'pc') {
    module.exports = require('./mapmain_infowindow.pc.js');//暂时调试
} else {
    module.exports = require('./mapmain_infowindow.app.js');
}
