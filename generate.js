const fs = require("fs");

const secondsToTime = (timeInSeconds) => timeInSeconds * 1000;

const getAmplitudeArraySize = (config) =>
  parseInt(config.time / config.interval);

const generateAmplitude = (config) =>
  new Array(getAmplitudeArraySize(config) + 1).fill(0).map((_, index) => ({
    id: index,
    t: secondsToTime(index * config.interval),
    value: config.normedFunction(index * config.interval),
    selected: false,
  }));

const frequencyOffset = (config) => getAmplitudeArraySize(config) + 2;

const generateFrequency = (config) => [
  {
    id: frequencyOffset(config),
    t: 0,
    value: config.frequency,
    selected: false,
  },
];

const template = (amplitude, frequency) => ({
  duration: 3000,
  selected: true,
  selectedTimeRange: {
    active: false,
    time1: 0,
    time2: 0,
  },
  parameters: {
    amplitude: {
      valueScale: [0, 1],
      data: amplitude,
    },
    frequency: {
      valueScale: [50, 500],
      data: frequency,
    },
  },
});

const generateFile = (config) =>
  `data:text/json;charset=utf8, ${JSON.stringify(
    template(generateAmplitude(config), generateFrequency(config))
  )}`;

const config = {
  multiplier: 0.1,
  frequency: 250,
  time: 0.2,
  interval: 0.04,
};
config.normedFunction = (x) => {
  const ratio = Math.PI / config.time;
  return Math.sin(x * ratio) * config.multiplier;
};

console.log(generateFile(config));
