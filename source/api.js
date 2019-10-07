var Api = class {
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

  /* Room model
  {
    "id": "4ec10fa6991b9754",
    "name": "dasdsadsa",
    "meta": {
      "image": "game_room_01.jpg",
      "favorite": false
    }
  }
  */
  /* Create a new room */
  static add(room) {
    return api.fetch(api.room.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(room)
    });
  }

  /* Update a specific room */
  static modify(room) {
    return api.fetch(api.room.url + room.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(room)
    });
  }

  /* Delete an existing room */
  static delete(room) {
    return api.fetch(api.room.url + room.id, {
      method: 'DELETE',
    });
  }

  /* Retrieve all rooms */
  static getAll() {
    return api.fetch(api.room.url);
  }

  /* Retrieve DEVICES from a specific room */
  static getDevices(room) {
    return api.fetch(api.room.url + room.id + '/devices');
  }

  // To create a device, create device and then add to room
  // Para que es el body??
  /* Adds a device to a specific room */
  static addDevice(room, device, param) {
    return api.fetch(api.room.url + room.id + '/devices/' + device.id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify((param === undefined) ? "{}" : param)
    });
  }
  
}

api.device = class {
  static get url() {
    return api.baseUrl + "devices/";
  }

  /* Device model FULL
  {
    "id": "06aff9e3be2fb763",
    "name": "table ladsamp",
    "type": {
      "id": "go46xmbqeomjrsjr",
      "name": "lamp"
    },
    "state": {
      "status": "off",
      "color": "FFFFFF",
      "brightness": 100
    },
    "meta": {
      "favorite": false
    }
  }
  */
  /* CREATE Device model
  {
    "type": {
      "id": "go46xmbqeomjrsjr"
    },
    "name": "table ladsamp",
    "meta": {"favorite":false}
  }
  */
  /* Create a new device */
  static add(device) {
    return api.fetch(api.device.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(device)
    });
  }

  /* Update an existing device */
  static modify(device) {
    return api.fetch(api.device.url + device.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(device)
    });
  }

  /* Delete an existing device */
  static delete(device) {
    return api.fetch(api.device.url + device.id, {
      method: 'DELETE',
    });
  }

  /* Retrieve state from a specific device */
  static getState(device) {
    return api.fetch(api.device.url + device.id + '/state');
  }

  /* Retrieve events from a specific device */
  static getEvents(device) {
    return api.fetch(api.device.url + device.id + '/events');
  }

  /* Retrieve all devices */
  static getAll() {
    return api.fetch(api.device.url);
  }

  /* Retrieve devices from a specific deviceType */
  static getAllFromType(deviceType) {
    return api.fetch(api.device.url + 'devicetypes/' + deviceType.id);
  }

  /* Executes an action in a specific device with params {[]} */
  static execAction(device, action, param) {
    return api.fetch(api.device.url + device.id + '/' + action, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify((param === undefined) ? "{}" : param)
    });
  }
}

api.deviceType = class {
  static get url() {
    return api.baseUrl + "devicestypes/";
  }

  /* Retrieves all deviceTypes */
  static getAllTypes() {
    return api.fetch(api.deviceType.url);
  }
}

api.routine = class {
  static get url() {
    return api.baseUrl + "routines/";
  }

  /* Create a new routine */
  static add(routine) {
    return api.fetch(api.routine.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(routine)
    });
  }

  /* Update an existing routine */
  static modify(routine) {
    return api.fetch(api.routine.url + routine.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(routine)
    });
  }

  /* Delete an existing routine */
  static delete(routine) {
    return api.fetch(api.routine.url + routine.id, {
      method: 'DELETE',
    });
  }

  /* Retrieve all routines */
  static getAll() {
    return api.fetch(api.routine.url);
  }

  /* Executes a specific routine */
  // Para que es el body??
  static exec(routine, param) {
    return api.fetch(api.routine.url + routine.id + '/execute', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify((param === undefined) ? "{}" : param)
    });
  }
}