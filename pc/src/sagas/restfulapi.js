import config from '../env/config';
// import streamSaver from 'streamsaver';
import map from 'lodash.map';
const fetchurl =`${config.serverurlrestful}`;

const getForm =(url, target, values, method)=> {
  function grabValues(x) {
    const path = [];
    let depth = 0;
    const results = [];

    function iterate(x) {
      switch (typeof x) {
        case 'function':
        case 'undefined':
        case 'null':
          break;
        case 'object':
          if (Array.isArray(x))
            for (let i = 0; i < x.length; i++) {
              path[depth++] = i;
              iterate(x[i]);
            }
          else
            map(x,(i)=>{
              path[depth++] = i;
              iterate(x[i]);
            });
          break;
        default:
          results.push({
            path: path.slice(0),
            value: x
          })
          break;
      }
      path.splice(--depth);
    }
    iterate(x);
    return results;
  }
  let form = document.createElement("form");
  form.method = method;
  form.action = url;
  form.target = target;

  values = grabValues(values);

  for (let j = 0; j < values.length; j++) {
    let input = document.createElement("input");
    input.type = "hidden";
    input.value = values[j].value;
    input.name = values[j].path[0];
    for (let k = 1; k < values[j].path.length; k++) {
      input.name += "[" + values[j].path[k] + "]";
    }
    form.appendChild(input);
  }
  return form;
};

const statusHelper = (response)=> {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

const restfulapi = {
  getexcelfile({type,query}){
    return new Promise((resolve,reject) => {
      const form = getForm(`${fetchurl}/${type}`, "_blank", query, "post");

      document.body.appendChild(form);
      form.submit();
      form.parentNode.removeChild(form);
      resolve();
      //  fetch(`${fetchurl}/${type}`, {
      //   method  : 'POST',
      //   headers : {
      //     'Content-Type'  : 'application/json'
      //   },
      //   body    : JSON.stringify(query)
      // })
      // .then(res => {
      // 	const fileStream = streamSaver.createWriteStream(`${type}.csv`)
      // 	const writer = fileStream.getWriter()
      // 	// Later you will be able to just simply do
      // 	// res.body.pipeTo(fileStream)
      //
      // 	const reader = res.body.getReader()
      // 	const pump = () => reader.read()
      // 		.then(({ value, done }) => done
      // 			// close the stream so we stop writing
      // 			? writer.close()
      // 			// Write one chunk, then get the next one
      // 			: writer.write(value).then(pump)
      // 		)
      //
      // 	// Start the reader
      // 	pump().then(() =>{
      //     resolve();
      //   });
      // });
    });
  },
  getdevicegeo (userData) {
    return fetch(`${fetchurl}/getdevicegeo`)
    .then(statusHelper)
    .then(response => response.json());
  },
  gethistorytrack (userData) {
    return fetch(`${fetchurl}/gethistorytrack`, {
      method  : 'POST',
      headers : {
        'Accept'        : 'application/json',
        'Content-Type'  : 'application/json'
      },
      body    : JSON.stringify(userData)
    })
    .then(statusHelper)
    .then(response => response.json());
  },
};


export default restfulapi;
