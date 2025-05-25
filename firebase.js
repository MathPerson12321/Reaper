import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {getDatabase,ref,get,set,push,onValue} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {}; //You don't get to see this

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export function writeData(path, data) {
    return set(ref(db, path), data);
}

export function readData(path) {
  return get(ref(db, path));
}

export function recieveData(path,callback) {
    return onValue(ref(db,path),callback);
}

export {ref,db};
