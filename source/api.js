var api = class {
  static get baseUrl() {
    return "http://127.0.0.1:8080/api/";
  }

  static get timeout() {
    return 60 * 1000;
  }

  static fetch(url, init) {
    return new Promise((resolve, reject) => {
      var timeout = setTimeout(() => {
        reject(new Error('Time out'));
      }, api.timeout);

      fetch(url, init)
        .then((response) => {
          clearTimeout(timeout);
          // if (!response.ok) {
          //   reject(new Error(response.statusText));
          // }
          return response.json();
        })
        .then((data) => {
          if (data.result) {
            resolve(data);
          } else{
            reject(`${data.error.description}`);
            //reject(new Error(`'${data.error.description}' (code: '${data.error.code}')`));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  static get(url) {
    return api.fetch(url)
  }

  static post(url, data) {
    return api.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(data)
    });
  }

  static put(url, data) {
    return api.fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(data)
    });
  }

  static delete(url) {
    return api.fetch(url, {
      method: 'DELETE',
    });
  }
}

api.room = class {
  static get url() {
    return api.baseUrl + "rooms/";
  }

  /* Room model FULL
  {
    "id": "4ec10fa6991b9754",
    "name": "dasdsadsa",
    "meta": {
      "image": "game_room_01.jpg",
      "favorite": false
    }
  }
  */

  /* CREATE Room model
  {
    "name": "kitchen",
    "meta": {
      "image": "game_room_01.jpg",
      "favorite": false
    }
  }
  */
  /* Create a new room */
  static add(room) {
    return api.post(api.room.url, room);
  }

  /* Update a specific room */
  static modify(room) {
    return api.put(api.room.url + room.id, room);
  }

  /* Delete an existing room */
  static delete(id) {
    return api.delete(api.room.url + id);
  }

  /* Retrieve a specific room */
  static get(id) {
    return api.get(api.room.url + id);
  }

  /* Retrieve all rooms */
  static getAll() {
    return api.get(api.room.url);
  }

  /* Retrieve DEVICES from a specific room */
  static getDevices(id) {
    return api.get(api.room.url + id + '/devices');
  }

  // To create a device, create device and then add to room
  // Para que es el body --> Para nada en principio
  /* Adds a device to a specific room */
  static addDevice(roomId, deviceId, param) {
    return api.post(api.room.url + roomId + '/devices/' + deviceId, (param === undefined) ? "{}" : param);
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
    return api.post(api.device.url, device);
  }

  /* Update an existing device */
  static modify(device) {
    return api.put(api.device.url + device.id, device);
  }

  /* Delete an existing device */
  static delete(id) {
    return api.delete(api.device.url + id);
  }

  /* Retrieve state from a specific device */
  static getState(id) {
    return api.get(api.device.url + id + '/state');
  }

  /* Retrieve events from a specific device */
  static getEvents(id) {
    return api.get(api.device.url + id + '/events');
  }

  /* Retrieve a specific device */
  static get(id) {
    return api.get(api.device.url + id);
  }

  /* Retrieve all devices */
  static getAll() {
    return api.get(api.device.url);
  }

  /* Retrieve devices from a specific deviceType */
  static getAllFromType(id) {
    return api.get(api.device.url + 'devicetypes/' + id);
  }

  /* Executes an action in a specific device with params {[]} */
  static execAction(id, action, param) {
    return api.put(api.device.url + id + '/' + action, ((param === undefined) ? "{}" : param));
  }
}

api.deviceType = class {
  static get url() {
    return api.baseUrl + "devicetypes/";
  }

  /* Retrieve a specific type */
  static get(id) {
    return api.get(api.deviceType.url + id);
  }

  /* Retrieves all deviceTypes */
  static getAll() {
    return api.get(api.deviceType.url);
  }
}

api.routine = class {
  static get url() {
    return api.baseUrl + "routines/";
  }

  /* Create a new routine */
  static add(routine) {
    return api.post(api.routine.url, routine);
  }

  /* Update an existing routine */
  static modify(routine) {
    return api.put(api.routine.url + routine.id, routine);
  }

  /* Delete an existing routine */
  static delete(id) {
    return api.delete(api.routine.url + id);
  }

  /* Retrieve a specific routine */
  static get(id) {
    return api.get(api.routine.url + id);
  }

  /* Retrieve all routines */
  static getAll() {
    return api.get(api.routine.url);
  }

  /* Executes a specific routine */
  // Para que es el body?? --> En principio para nada
  static exec(id, param) {
    return api.put(api.routine.url + id + '/execute', ((param === undefined) ? "{}" : param));
  }
}

/* Para todas estas funciones, debo llamarlas usando:
    await ...
*/
function getAll(key) {
  switch(key) {
    case "Room":
      return api.room.getAll();
    case "Device":
      return api.device.getAll();
    case "Type":
      return api.deviceType.getAll();
    case "Routine":
      return api.routine.getAll();
  } 
}

function createRoom(name, image, fav) {
  return api.room.add({
    "name": name,
    "meta": {
      "image": image,
      "favorite": fav
    }
  });
}

function createDevice(name, type, fav) {
  return api.device.add({
    "type": {
      "id": type
    },
    "name": name,
    "meta": {
      "favorite": fav
    }
  })
}

function addDeviceToRoom(roomId, deviceId) {
  return api.room.addDevice(roomId, deviceId);
}

function getRoom(id) {
  return api.room.get(id);
}

function modifyRoom(room) {
  return api.room.modify(room);
}

function getRoomDevices(roomId) {
  return api.room.getDevices(roomId);
}

/*
let rta = await createRoom(this.name, this.images[this.image], false)
.catch((error) => {
  this.errorMsg = error[0].toUpperCase() + error.slice(1);
  console.error(this.errorMsg);
});
if (rta) {
  this.resetVar();
  this.$root.$emit('Finished add', 0);
} else {
  this.error = true;
}
*/