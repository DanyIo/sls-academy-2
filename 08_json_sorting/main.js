const axios = require("axios");

const endpoints = [
  "https://jsonbase.com/sls-team/json-793",
  "https://jsonbase.com/sls-team/json-955",
  "https://jsonbase.com/sls-team/json-231",
  "https://jsonbase.com/sls-team/json-931",
  "https://jsonbase.com/sls-team/json-93",
  "https://jsonbase.com/sls-team/json-342",
  "https://jsonbase.com/sls-team/json-770",
  "https://jsonbase.com/sls-team/json-491",
  "https://jsonbase.com/sls-team/json-281",
  "https://jsonbase.com/sls-team/json-718",
  "https://jsonbase.com/sls-team/json-310",
  "https://jsonbase.com/sls-team/json-806",
  "https://jsonbase.com/sls-team/json-469",
  "https://jsonbase.com/sls-team/json-258",
  "https://jsonbase.com/sls-team/json-516",
  "https://jsonbase.com/sls-team/json-79",
  "https://jsonbase.com/sls-team/json-706",
  "https://jsonbase.com/sls-team/json-521",
  "https://jsonbase.com/sls-team/json-350",
  "https://jsonbase.com/sls-team/json-64",
];

async function findIsDone(data) {
  if (typeof data === "object") {
    if ("isDone" in data) {
      return data.isDone;
    }

    for (const key in data) {
      const result = await findIsDone(data[key]);
      if (result !== null) {
        return result;
      }
    }
  }

  return null;
}

async function queryEndpoint(endpoint) {
  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(`[Fail] ${endpoint}: The endpoint is unavailable`);
    return null;
  }
}

async function queryEndpoints() {
  let trueCount = 0;
  let falseCount = 0;

  for (const endpoint of endpoints) {
    let result = null;
    let retryCount = 0;

    while (retryCount < 3 && result === null) {
      result = await findIsDone(await queryEndpoint(endpoint));
      retryCount++;
    }

    const status = result === null ? "The endpoint is unavailable" : `isDone - ${result}`;
    const output = result ? "[Success]" : "[Fail]";
    console.log(`${output} ${endpoint}: ${status}`);

    result ? trueCount++ : falseCount++;
  }

  console.log(`Found True values: ${trueCount}`);
  console.log(`Found False values: ${falseCount}`);
}

queryEndpoints();
