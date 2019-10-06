var api = class {
    static get baseUrl() {
        return "http://127.0.0.1:8080/api/";
    }

    static get timeout() {
        return 10000; // 10 seg
    }

    static fetch(url, init) {
        return new Promise((solve, reject) => {
            var timeout = setTimeout(() => {
                reject(new Error('Time out'));
            }, api.timeout);

            fetch(url, init)
                .then((response) => {
                    clearTimeout(timeout);
                    if (!response.ok) {
                        reject(new Error(response.statusText));
                    }
                    return response.json();
                })
                .then((data) => {
                    solve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}

api.room = class {
    static get url() {
        return api.baseUrl + "rooms/";
    }

    static add(room) {
        return api.fetch(api.room.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(room)
        });
    }

    static modify(room) {
        return api.fetch(api.room.url + room.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(room)
        });
    }

    static delete(id) {
        return api.fetch(api.room.url + id, {
            method: 'DELETE',
        });
    }

    static get(id) {
        return api.fetch(api.room.url + id);
    }

    static getAll() {
        return api.fetch(api.room.url);
    }
}

api.device = class {
  static get url() {
      return api.baseUrl + "devices/";
  }

  static add(device) {
      return api.fetch(api.device.url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify(device)
      });
  }

  static modify(device) {
      return api.fetch(api.device.url + device.id, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify(device)
      });
  }

  static delete(id) {
      return api.fetch(api.device.url + id, {
          method: 'DELETE',
      });
  }

  static get(id) {
      return api.fetch(api.device.url + id);
  }

  static getAll() {
      return api.fetch(api.device.url);
  }
}

api.routine = class {
  static get url() {
      return api.baseUrl + "routines/";
  }

  static add(routine) {
      return api.fetch(api.routine.url, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify(routine)
      });
  }

  static modify(routine) {
      return api.fetch(api.routine.url + routine.id, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify(routine)
      });
  }

  static delete(id) {
      return api.fetch(api.routine.url + id, {
          method: 'DELETE',
      });
  }

  static get(id) {
      return api.fetch(api.routine.url + id);
  }

  static getAll() {
      return api.fetch(api.routine.url);
  }
}