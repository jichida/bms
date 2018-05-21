import _ from 'lodash';
import {requestpostwithtoken} from '../../util/util.js';

const fetchgwsetting = (uri,jsondata)=>{
	return new Promise((resolve,reject) => {
		const token = localStorage.getItem('admintoken');
		requestpostwithtoken(`${uri}`,token,jsondata,(issuccess,errmsg)=>{
			resolve({
				issuccess,
				errmsg
			});
		});
	});

}

export default fetchgwsetting;
