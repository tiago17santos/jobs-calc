let data = {
  name: "Tiago",
  avatar: "https://github.com/tiago17santos.png",
  "monthly-budget": 3000,
  "hours-per-day": 5,
  "days-per-week": 5,
  "vacation-per-year": 4,
  "value-hours": 70,
};

module.exports = {
    get(){
        return data
    },

    update(newData){
      data = newData;
    }
}