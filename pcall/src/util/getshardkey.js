import moment from 'moment';

export const gettimekey =(timestart,timeend)=> {
  const timekeysz = [];
  const momentstart = moment(timestart);
  const timeendday = moment(timeend).format('YYYY-MM-DD 23:59:59');
  const momentend = moment(timeendday);
  let momenti;
  for(momenti =momentstart ;momenti <= momentend;  ){
    const timekey = momenti.format('YYMMDD');
    timekeysz.push(timekey);
    momenti = momenti.add(1, 'days');
  }
  //console.log(`timekeysz--->${JSON.stringify(timekeysz)}`);
  return timekeysz;
}
