const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const getPaginatedDataFromModel = async (model, page, pageSize) => {
  const list = await model.find().limit(pageSize).skip(pageSize * (page - 1));
  const total = await model.countDocuments();
  return {
    list,
    total
  }
}

module.exports = {
  randomIntFromInterval,
  getPaginatedDataFromModel
}