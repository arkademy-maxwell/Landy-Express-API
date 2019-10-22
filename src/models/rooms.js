const conn = require("../config/databaase/database");

module.exports = {
  getRoom: (search, limit, page = 1, room) => {
    return new Promise((resolve, reject) => {
      conn.query(
        `SELECT room.id, room.room, room.description,room.address,facility.name as facility, room.image, room.price, room.quantity,room.created_date, room.updated_date FROM room JOIN facility ON room.facility_id = facility.id 
            ${search ? `WHERE room.room LIKE '%${search}%'` : ""} ${
          room ? `ORDER BY ${room}` : ""
        } ${limit ? `LIMIT ${limit} OFFSET ${(page - 1) * limit}` : ""}`,
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(new Error(err));
          }
        }
      );
    });
  },
  getByName: room => {
    return new Promise((resolve, reject) => {
      conn.query(
        "SELECT COUNT(id) AS room FROM room WHERE room = ?",
        [room],
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(new Error(err));
          }
        }
      );
    });
  },
  getAll: () => {
    return new Promise((resolve, reject) => {
      conn.query("SELECT COUNT(id) as Amount FROM room", (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(err));
        }
      });
    });
  },
  getById: id => {
    return new Promise((resolve, reject) => {
      conn.query("SELECT * FROM room WHERE id = ?", [id], (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(err));
        }
      });
    });
  },
  getDesc: room => {
    return new Promise((resolve, reject) => {
      conn.query(
        `SELECT room.id, room.room, room.description,room.address,facility.name as facility, room.image, room.price, room.quantity,room.created_date, room.updated_date FROM room JOIN facility ON room.facility_id = facility.id ${
          room ? `ORDER BY ${room} DESC` : ""
        } `,
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(new Error(err));
          }
        }
      );
    });
  },
  addRoom: data => {
    return new Promise((resolve, reject) => {
      conn.query("INSERT INTO room SET ?", data, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(err));
        }
      });
    });
  },
  updateRoom: (data, id) => {
    return new Promise((resolve, reject) => {
      //   conn.query("SELECT * from room WHERE id = ?", id, (err, resultSelect) => {
      //     if (resultSelect.length > 0) {
      conn.query(
        "UPDATE room SET ? WHERE id = ?",
        [data, id],
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(err);
          }
        }
      );
      //     } else {
      //       reject("ID NOT FOUND!");
      //     }
      //   });
    });
  },

  deleteRoom: id => {
    return new Promise((resolve, reject) => {
      conn.query("DELETE from room WHERE ?", [id], (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(new Error(err));
        }
      });
    });
  },
  reduceRoom: (id, qty) => {
    return new Promise((resolve, reject) => {
      conn.query("SELECT * from room WHERE id = ?", id, (err, result) => {
        if (result.length >= 0) {
          const quantity = result[0].qty - qty;
          if (quantity >= 0) {
            conn.query(
              "UPDATE room SET qty = ? WHERE id = ?",
              [quantity, id],
              (err, update) => {
                if (!err) {
                  resolve(result);
                } else {
                  reject(new Error(err));
                }
              }
            );
          } else {
            reject(new Error(err));
          }
        } else {
          reject(new Error(err));
        }
      });
    });
  }
};