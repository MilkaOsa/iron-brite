const createError = require("http-errors");
const Event = require("../models/event.model");

module.exports.list = (req, res, next) => {
  Event.find()
    .then((events) => res.json(events))
    .catch((error) => next(error));
};

module.exports.create = (req, res, next) => {
  const { body } = req;

  Event.create({
    title: body.title,
    description: body.description,
    startDate: body.startDate,
    endDate: body.endDate,
  })
    .then((event) => res.status(201).json(event))
    .catch((error) => next(error));
};

module.exports.detail = (req, res, next) => {
  const { id } = req.params;
  Event.findById(id)
    .then((event) => {
      if (!event) next(createError(404, "Event not found"));
      else res.json(event);
    })
    .catch((error) => next(error));
};

module.exports.delete = (req, res, next) => {
  const { id } = req.params;
  Event.findByIdAndDelete(id)
    .then((event) => {
      if (!event) next(createError(404, "Event not found"));
      else res.status(204).send();
    })
    .catch((error) => next(error));
};

module.exports.update = (req, res, next) => {
  const { id } = req.params;
  const { body } = req;

  const permittedParams = ["title", "description", "startDate", "endDate"];

  Object.keys(body).forEach((key) => {
    if (!permittedParams.includes(key)) delete body[key];
  });

  Event.findByIdAndUpdate(id, body, { runValidators: true, new: true })
    .then((event) => {
      if (!event) next(createError(404, "Event not found"));
      else res.status(201).json(event);
    })
    .catch((error) => next(error));
};
