const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");
const NodeCache = require("node-cache");

const API_KEY = "8cd9431b80865a7babf107bd7a03c58c"; // replace with yours
const cityName = "Lviv"; // replace with yours

const BOT_TOKEN = "6232514296:AAF1N8vpcb5sMyRdXLCccZ0fW10fo8Lb_vA"; // replace with yours

const cache = new NodeCache({ stdTTL: 300 });

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const keyboard = [
    [{ text: `Get ${cityName} Weather` }],
    [{ text: `Exchange` }],
  ];

  const replyMarkup = {
    keyboard: keyboard,
    resize_keyboard: true,
    one_time_keyboard: true,
  };
  bot.sendMessage(chatId, "Please choose an option:", {
    reply_markup: replyMarkup,
  });
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  let currencyRates;

  switch (messageText) {
    case `Get ${cityName} Weather`:
      const weatherButtons = [
        [{ text: "at intervals of 3 hours" }],
        [{ text: "at intervals of 6 hours" }],
        [{ text: "Back" }],
      ];

      await bot.sendMessage(chatId, "Please choose another option:", {
        reply_markup: {
          keyboard: weatherButtons,
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
      break;

    case "at intervals of 3 hours":
    case "at intervals of 6 hours":
      const interval = messageText === "at intervals of 3 hours" ? 3 : 6;
      const response = await getWeatherForecast(cityName, interval);
      bot.sendMessage(chatId, formatForecastMessage(response));
      break;

    case "Exchange":
      const exchangeButtons = [
        [{ text: "USD" }],
        [{ text: "EUR" }],
        [{ text: "Back" }],
      ];
      await bot.sendMessage(chatId, "Choose currency:", {
        reply_markup: {
          keyboard: exchangeButtons,
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
      break;

    case "Back":
      const mainButtons = [
        [{ text: `Get ${cityName} Weather` }],
        [{ text: `Exchange` }],
      ];
      await bot.sendMessage(chatId, "Please choose an option:", {
        reply_markup: {
          keyboard: mainButtons,
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
      break;
    case "USD":
      currencyRates = await getCurrencyRates();
      const usdRate = currencyRates.find(
        (rate) => rate.currencyCodeA === 840 || rate.currencyCodeB === 840
      );
      const usdMessage = `<b>USD Exchange Rate:</b>\n\nBuy: ${usdRate.rateBuy.toFixed(
        2
      )} UAH\nSell: ${usdRate.rateSell.toFixed(2)} UAH`;

      await bot.sendMessage(chatId, usdMessage, { parse_mode: "HTML" });
      break;
    case "EUR":
      currencyRates = await getCurrencyRates();
      const eurRate = currencyRates.find(
        (rate) => rate.currencyCodeA === 978 || rate.currencyCodeB === 978
      );
      const eurMessage = `<b>EUR Exchange Rate:</b>\n\nBuy: ${eurRate.rateBuy.toFixed(
        2
      )} UAH\nSell: ${eurRate.rateSell.toFixed(2)} UAH`;

      await bot.sendMessage(chatId, eurMessage, { parse_mode: "HTML" });
      break;
  }
});

function formatForecastMessage(forecast) {
  let message = "Weather Forecast:\n\n";

  forecast.forEach((weatherData) => {
    const { dt_txt, weather } = weatherData;
    const { main, description } = weather[0];
    message += `${dt_txt}\nMain: ${main}\nDescription: ${description}\n\n`;
  });

  return message;
}

async function getWeatherForecast(cityName, interval) {
  const API = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`;

  try {
    const response = await axios.get(API);
    const forecast = filterForecastByInterval(response.data.list, interval);
    return forecast;
  } catch (error) {
    console.error("Error fetching weather forecast:", error);
    throw error;
  }
}

function filterForecastByInterval(forecast, interval) {
  const filteredForecast = [];
  let prevTimestamp = null;

  forecast.forEach((data) => {
    const timestamp = data.dt_txt.split(" ")[1].split(":")[0];

    if (prevTimestamp === null || timestamp % interval === 0) {
      filteredForecast.push(data);
      prevTimestamp = timestamp;
    }
  });

  return filteredForecast;
}

async function getCurrencyRates() {
  const cachedRates = cache.get("currencyRates");
  if (cachedRates) {
    return cachedRates;
  }

  try {
    const response = await axios.get("https://api.monobank.ua/bank/currency");
    const currencyRates = response.data.filter(
      (currency) =>
        currency.currencyCodeA === 840 || currency.currencyCodeA === 978
    );

    cache.set("currencyRates", currencyRates);
    return currencyRates;
  } catch (error) {
    console.error("Error fetching currency rates:", error);
  }
}
