
const getpartition = (key)=>{
  let index = 0;
  if(typeof key === 'string'){
    try{
      index = parseInt(key);
      index = index%48;
    }
    catch(e){
      index = 0;
    }
  }
  return index;
}

const p = getpartition('1501103291');
console.log(p);
