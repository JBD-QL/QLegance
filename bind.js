'use strict';

let QLegance = (()=>{
  let controller = document.querySelector('[ql-ctrl]');
  let elements = controller.querySelectorAll('[ql-type], [ql-list]');

  class Binder{
    constructor(elements){
      let server = '';
      let len = elements.length;
      let fields, type;

      for(let i = 0; i < len; i++){
        type = this.getAttr(elements[i]);
        fields = elements[i].querySelectorAll('[ql-field]');

        this[type] = {};
        this[type].type_name = type;
        this[type].element = elements[i];
        this[type].data = elements[i].value; //not implemented
        this[type].element.addEventListener('change', this, false); //not coming into play
        // this[type].fields = [];
        this[type].fields = '';
        this[type].populate = populate;

        for(let n = 0; n < fields.length; n++){
          //fields[n].style.display = 'none';
          // this[type].fields.push(this.getAttr(fields[n]));
          this[type].fields += this.getAttr(fields[n]) + '\n';
        }
      }

      this.setServer = (serv) => { 
        server = serv; 
        const introspectiveQuery = `
          {
            __schema {
              mutationType {
                name
                fields {
                  name
                  type {
                    name
                  }
                  args {
                    name
                    defaultValue
                    type {
                      kind
                      name
                      ofType {
                        name
                        kind
                      }
                    }
                  }
                }
              }
            }
          }
        `;

        this.sendQuery(introspectiveQuery)
          .then((res) => {
            console.log(res);
            const data = res.data.__schema.mutationType.fields;
            console.log(data);
            const mutationTypes = {}; 
            for (let i = 0; i < data.length; i += 1) {
              if (!mutationTypes[data[i].type.name]) {
                mutationTypes[data[i].type.name] = {};
              }
              mutationTypes[data[i].type.name][data[i].name] = {
                args : {}
              };
              for (let j = 0; j < data[i].args.length; j += 1) {
                if (data[i].args[j].type.kind === "NON_NULL") {
                  mutationTypes[data[i].type.name][data[i].name].args[data[i].args[j].name] = {
                    type: data[i].args[j].type.ofType.name,
                    required: true
                  };
                } else {
                  mutationTypes[data[i].type.name][data[i].name].args[data[i].args[j].name] = {
                    type: data[i].args[j].type.name,
                    required: false
                  };
                }
              }
            }
            const mutationTypeKeys = Object.keys(mutationTypes);
            // console.log('binder:', binder);
            // console.log('mutationTypes:', mutationTypes);
            for (let binderKey in binder) {
              // console.log(key)
              if (mutationTypeKeys.includes(binderKey)) {
                for (let mutationKey in mutationTypes[binderKey]) {
                  console.log(mutationTypes[binderKey])
                  binder[binderKey][mutationKey] = function() {return};
                }
              }
            }
            // console.log('binder:', binder);
          });
        // type, fields of type
        // this will be an array of objects, with each object being a mutation field
        // key being type, value being a nested object with mutation fields and fields of type
        // loop through ql-types in binder
        // for each ql-type find the matching mutation fields
      };

      this.getServer = () => { return server; };

      this.sendQuery = (query, data) => {
        return new Promise((resolve, reject) => {
          let xhr = new XMLHttpRequest();

          xhr.open("POST", server, true);
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.send(JSON.stringify({query: query}));

          xhr.onreadystatechange = () => {
            if(xhr.status === 200 && xhr.readyState === 4){
              let response = JSON.parse(xhr.response);
              this.cacheQuery(query, response.data);
              resolve(response);
            }else if(xhr.status > 400 && xhr.status < 500){
              reject(xhr.status)
            }
          };
        });
      };

      this.query = (query) => {
        return new Promise((resolve, reject) => {
          let xhr = new XMLHttpRequest();
          let queryStr = "query" + query;
          xhr.open("POST", server, true);
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.send(JSON.stringify({query: queryStr}));

          xhr.onreadystatechange = () => {
            if(xhr.status === 200 && xhr.readyState === 4){
              let response = JSON.parse(xhr.response);
              this.cacheQuery(query, response.data);
              resolve(response);
            }else if(xhr.status > 400 && xhr.status < 500){
              reject(xhr.status)
            }
          };
        });
      };
    }

    cacheQuery(query, data){
      let hash = JSON.stringify('QLegance:' + this.hashFunction(query));
      localStorage[hash] = JSON.stringify(data);
    }

    resolveCache(){

    }

    hashFunction(string){
      let h = 5, len = string.length;
      for(let i = 0; i < len; i++){
        h = h*16 + string[i].charCodeAt();
      }
      return h;
    }

    diffQuery(){

    }

    handlEvent(event){
      if(event.type === 'change'){
        this.change(event);
      }
    }

    change(event){
      if(!event.target) return;
      let element = event.target;
      let type = this.getAttr(element);
      this[type].data = element.value;
      this[type].element.value = element.value;
    }

    getAttr(element){
      return element.getAttribute('ql-type') || element.getAttribute('ql-list') || element.getAttribute('ql-field');
    }
  }

  function populate(data){
    let fields = this.element.querySelectorAll('[ql-field]');
    let collection = document.getElementById("list").getAttribute("ql-list");
    let users = data[collection];
    console.log("this: ", data[collection].length);
    console.log("we want this: ", data);
    let user;
    let fieldName;
    let element;
    let elementType;
    let lenInner;
    let lenOuter =  users.length || 1;
    let input;

    for(let i = 0; i < lenOuter; i++){
      input = null;
      lenInner =  users[i] ? Object.keys(users[i]).length : Object.keys(users).length;
      user = users[i] || users;

      for(let n = 0; n < lenInner; n++){
        element = document.createElement(fields[n].nodeName);

        if(fields[n].nodeName.toLowerCase() === 'input'){
          elementType = fields[n].getAttribute('type').toLowerCase();
           input = 'value';
           element.setAttribute('type', elementType);
        }else{
          input = 'innerHTML';
        }

        fieldName = binder.getAttr(fields[n]);
        element[input] = user[fieldName];
        element.setAttribute('ql-field', fieldName);

        fields[n].remove();
        this.element.append(element);
      }
    }
  }

  const binder = new Binder(elements);
  console.log('binder:', binder);
  return binder;
})();
