const EventModel = require("./event.model");
const { convertJSONToCSV } = require("../../utils/json2csv");

class Controller {
  constructor() {}
  //list event
  list() {
    return EventModel.find({});
  }

  // add event
  save(payload, files) {
    payload.meal_option = [
      { text: payload.meal_name_1 },
      { text: payload.meal_name_2 },
      { text: payload.meal_name_3 },
    ];

    if (files) {
      files.forEach((file) => {
        if (file.fieldname === "sponsor_logo") {
          payload.sponsor_logo = file.destination + "/" + file.filename;
        }
        if (file.fieldname === "meal_image_1") {
          payload.meal_option[0].image = file.destination + "/" + file.filename;
        }
        if (file.fieldname === "meal_image_2") {
          payload.meal_option[1].image = file.destination + "/" + file.filename;
        }
        if (file.fieldname === "meal_image_3") {
          payload.meal_option[2].image = file.destination + "/" + file.filename;
        }
      });
    }
    return EventModel.findOneAndUpdate(
      { date: payload.date, location: payload.location },
      payload,
      { new: true, upsert: true }
    );
  }

  //edit event but cannot be edited on event date (eventData !== Date.now())
  async updateById(id, payload, files) {
    payload.meal_option = [
      { text: payload.meal_name_1 },
      { text: payload.meal_name_2 },
      { text: payload.meal_name_3 },
    ];

    if (files) {
      files.forEach((file) => {
        if (file.fieldname === "sponsor_logo") {
          payload.sponsor_logo = file.destination + "/" + file.filename;
        }
        if (file.fieldname === "meal_image_1") {
          payload.meal_option[0].image = file.destination + "/" + file.filename;
        }
        if (file.fieldname === "meal_image_2") {
          payload.meal_option[1].image = file.destination + "/" + file.filename;
        }
        if (file.fieldname === "meal_image_3") {
          payload.meal_option[2].image = file.destination + "/" + file.filename;
        }
      });
    }
    let event = await this.getById(id);
    return new Date(event.date).setHours(0, 0, 0, 0) !==
      new Date().setHours(0, 0, 0, 0)
      ? await EventModel.updateOne({ _id: id }, payload)
      : null;
  }

  //delete event
  async removeById(id) {
    return EventModel.findOneAndRemove({ _id: id });
  }
  //download the list of meal bookings  for a specificc event on CSV(stream/net nodecore)
  async getById(id) {
    let data = await EventModel.findOne({ _id: id });
    return data;
  }

  async generateCSV(id) {
    try {
      let data = await EventModel.findOne({
        _id: id,
      }).populate("booking");
      let { booking, date, location, comment } = data;
      data = await convertJSONToCSV(
        JSON.stringify(booking),
        date,
        location,
        comment
      );
      console.log(data);
      return data;
    } catch (e) {
      console.log(e);
    }
  }
}
module.exports = new Controller();
