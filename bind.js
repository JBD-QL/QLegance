'use strict';

let QLegance = (()=>{
  class Binder{
    constructor(){
      let server = '';

      this.setServer = (serv) => { 
        server = serv;
        this.introspect();
      };

      this.getServer = () => { return server; };

      this.sendQuery = (query) => {
        return new Promise((resolve, reject) => {
          let xhr = new XMLHttpRequest();

          xhr.open("POST", server, true);
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.send(JSON.stringify({query: query}));

          xhr.onreadystatechange = () => {
            if(xhr.status === 200 && xhr.readyState === 4){
              let response = JSON.parse(xhr.response);
              // this.cacheQuery(query, response.data);
              resolve(response);
            }else if(xhr.status > 400 && xhr.status < 500){
              reject(xhr.status)
            }
          };
        });
      };

      this.query = (string) => {
        return this.sendQuery("query" + string);
      };

      this.mutate = (string) => {
        return this.sendQuery("mutation" + string);
      };
    }
    // end of constructor

    introspect() {
      const introspectiveQuery = `
        {
          __schema {
            mutationType {
              name
              fields {
                name
                type {
                  name
                  kind
                }
                args {
                  name
                  defaultValue
                  type {
                    kind
                    name
                    ofType {
                      kind
                      name
                    }
                  }
                }
              }
            }
            queryType {
              name
              fields {
                name
                type {
                  name
                  kind
                }
                args {
                  name
                  defaultValue
                  type {
                    kind
                    name
                    ofType {
                      kind
                      name
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
          // console.log(res);
          const fields = res.data.__schema.mutationType.fields.concat(res.data.__schema.queryType.fields);
          console.log('fields:', fields);
          this.types = {};
          // loop through fields
          for (let i = 0; i < fields.length; i += 1) {
            this.typeFieldConstructor(fields[i]);
            this.methodConstructor(fields[i]);
          }
          console.log(this);
        });
    }

    typeFieldConstructor(field) {
      if (!this.types[field.type.name]) {
        if (field.type.name) {
          this.types[field.type.name] = [];
        } else {
          this.types[field.type.kind] = [];
        }
      }
      if (field.type.name) {
        // console.log('valid type');
        this.types[field.type.name].push(field.name);
      } else {
        this.types[field.type.kind].push(field.name);
      }
    }

    methodConstructor(field) {

    }
  }
  // end of bind class

  const binder = new Binder();
  console.log('binder:', binder);
  return binder;
})();