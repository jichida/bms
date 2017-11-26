export default (previousState = {
  warningrulelevel0:'',
  warningrulelevel1:'',
  warningrulelevel2:'',
}, { type, payload }) => {
    if (type === 'SYSTEM_SAVE_SUCCESS') {
        return payload.systemconfig;
    }
    else if (type === 'SYSTEM_LOAD_SUCCESS') {
        return payload.systemconfig;
    }
    return previousState;
}
