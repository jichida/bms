const kafka = require('node-rdkafka');


const initProducer = (globalconfig,pconfig,onErr)=> {
  return new Promise((resolve, reject) => {
    const producer = new kafka.Producer(globalconfig,pconfig);
    producer.on('ready', () => {
      //console.log('producer ready.');
      producer.setPollInterval(500)
      resolve(producer);
    })
    // producer.on('event.error', (err)=>{
    //     onErr(err);
    // });
    // producer.on('disconnected', () => {
    //   //console.log('producer disconnected.');
    //   process.exit(0)
    // });
    // producer.on('event.log', function(event) {
    //   //console.log(event)
    // })
    producer.connect();
  });
}


module.exports = initProducer;
