const jsonfile = require("jsonfile");
const fs = require("fs");
const path = require("path");

const DATA_FOLDER = (src) => path.join(__dirname, "../data", src);

const files = fs.readdirSync(DATA_FOLDER("")).filter((f) => !f.startsWith("."));
const data = files.map((file) => {
  return jsonfile.readFileSync(DATA_FOLDER(file));
});

console.log(data.length);
const MIN_LAT = Math.min(...data[0].map((item) => item.location.lat));
const MIN_LON = Math.min(...data[0].map((item) => item.location.lon));
const MAX_LAT = Math.max(...data[0].map((item) => item.location.lat));
const MAX_LON = Math.max(...data[0].map((item) => item.location.lon));

const TOTAL_BIKES = Math.max(...data[0].map((item) => item.empty + item.bikes));

const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};

const mapRange = (value, x1, y1, x2, y2) =>
  ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

const minData = Object.values(
  data
    .flat()
    .map((item) => {
      return {
        id: item.id,
        x: mapRange(item.location.lon, MIN_LON, MAX_LON, 0, 1),
        y: mapRange(item.location.lat, MIN_LAT, MAX_LAT, 0, 1),
        globalValue: mapRange(item.bikes, 0, TOTAL_BIKES, 0, 1),
        value: clamp(
          mapRange(item.bikes, 0, item.empty + item.bikes, 0, 1),
          0,
          1
        ),
      };
    })
    .reduce((prev, curr) => {
      if (!prev[curr.id]) {
        prev[curr.id] = {
          id: curr.id,
          x: curr.x,
          y: curr.y,
          globalValues: [],
          values: [],
        };
      }

      prev[curr.id].values.push(curr.value);
      prev[curr.id].globalValues.push(curr.globalValue);
      return prev;
    }, {})
).map((item) => ({
  ...item,
  values: item.values,
  globalValues: item.globalValues,
}));

const dates = files
  .map((f) => f.split(".").shift())
  .map((d) => new Date(parseInt(d)))
  .map((d) => ({
    date: d.getDate(),
    month: d.getMonth(),
    hour: d.getHours(),
    minute: d.getMinutes(),
  }));

const names = data[0].reduce(
  (prev, curr) => ({
    ...prev,
    [curr.id]: curr.name,
  }),
  {}
);

jsonfile.writeFileSync(path.join(__dirname, "values.json"), minData);
jsonfile.writeFileSync(path.join(__dirname, "dates.json"), dates);
jsonfile.writeFileSync(path.join(__dirname, "names.json"), names);
