

const getFieldname = (cantype,errorcode)=>{

	if(cantype === 0 || cantype === 1){
		//0/1-->51
		return `AL_Trouble_Code_51_${errorcode}`;
	}
	else if(cantype === 1){
		//2-->6.0
		return `AL_Trouble_Code_60_${errorcode}`;
	}
	else{
		return `AL_Trouble_Code_${errorcode}`;
	}
}

module.exports = getFieldname;
