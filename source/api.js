/* Class for APi handler */
/* Base address for the API */
var api = class {
  static get baseUrl() {
    return "http://127.0.0.1:8080/api/";
  }

  static get timeout() {
    return 60 * 1000;
  }

  /* Data fetch from API */
  static fetch(url, init) {
    return new Promise((resolve, reject) => {
      var timeout = setTimeout(() => {
        reject(new Error('Time out'));
      }, api.timeout);

      fetch(url, init)
        .then((response) => {
          clearTimeout(timeout);
          return response.json();
        })
        .then((data) => {
          if (data.result || data.devices) {
            resolve(data);
          } else {
            reject(`${data.error.description}`);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /* Wrapper for get on api.fetch */
  static get(url) {
    return api.fetch(url)
  }

  /* Wrapper for post on api.fetch */
  static post(url, data) {
    return api.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(data)
    });
  }

  /* Wrapper for put on api.fetch */
  static put(url, data) {
    return api.fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(data)
    });
  }

  /* Wrapper for delete on api.fetch */
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

  /* To create a device, create device and then add to room */

  /* Adds a device to a specific room */
  static addDevice(roomId, deviceId, param) {
    return api.post(api.room.url + roomId + '/devices/' + deviceId, (param === undefined) ? "{}" : param);
  }

  /* Deletes a device given an id */
  static deleteDevice(deviceId) {
    return api.delete(api.room.url + 'devices/' + deviceId);
  }
}

api.device = class {
  static get url() {
    return api.baseUrl + "devices/";
  }

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
  static exec(id) {
    return api.put(api.routine.url + id + '/execute', []);
  }
}

/* NOTE: call all this functions with await function() */

/*  Gets all the elements of key */
function getAll(key) {
  switch (key) {
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

/* Creates a room */
function createRoom(name, image, fav) {
  return api.room.add({
    "name": name,
    "meta": {
      "image": image,
      "favorite": fav
    }
  });
}

/* Creates a device */
function createDevice(name, type, fav) {
  return api.device.add({
    "type": {
      "id": type
    },
    "name": name,
    "meta": {
      "favorite": fav
    }
  });
}

/* Deletes a room */
function deleteRoom(id) {
  return api.room.delete(id);
}

/* Deletes a device */
function deleteDevice(id) {
  return api.device.delete(id);
}

/* Adds a device to a room */
function addDeviceToRoom(roomId, deviceId) {
  return api.room.addDevice(roomId, deviceId);
}

/* Deletes a device from a room */
function deleteDeviceFromRoom(deviceId) {
  return api.room.deleteDevice(deviceId);
}

/* Gets room given an ID */
function getRoom(id) {
  return api.room.get(id);
}

/* Modifies a room */
function modifyRoom(room) {
  return api.room.modify(room);
}

/* Gets all devices from room */
function getRoomDevices(roomId) {
  return api.room.getDevices(roomId);
}

/* Gets specific device */
function getDevice(id) {
  return api.device.get(id);
}

function modifyDevice(id, name, fav) {
  return api.device.modify({
    "id": id,
    "name": name,
    "meta": {
      "favorite": fav
    }
  });
}

/* Gets all devices from specific type */
function getAllFromType(id) {
  return api.device.getAllFromType(id);
}

/* Executes action on API (post) */
function execAction(id, action, param) {
  return api.device.execAction(id, action, param);
}

/* Adds a routine */
function addRoutine(name, actions, img) {
  var routine = { name: name,
                  actions: actions,
                  meta: {img: img}};
  return api.routine.add(routine);
}

/* Executes a routine */
function execRoutine(id) {
  return api.routine.exec(id);
}

/* Gets specific type */
function getType(id) {
  return api.deviceType.get(id);
}