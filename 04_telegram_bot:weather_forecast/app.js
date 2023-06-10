const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");

const API_KEY = "8cd9431b80865a7babf107bd7a03c58c"; // replace with yours
const cityName = "Lviv"; // replace with yours

const BOT_TOKEN = "6232514296:AAF1N8vpcb5sMyRdXLCccZ0fW10fo8Lb_vA"; // replace with yours

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const keyboard = [[{ text: `Get ${cityName} Weather` }]];

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

  if (messageText === `Get ${cityName} Weather`) {
    const additionalButtons = [
      [{ text: "at intervals of 3 hours" }],
      [{ text: "at intervals of 6 hours" }],
    ];

    const replyMarkup = {
      keyboard: additionalButtons,
      resize_keyboard: true,
      one_time_keyboard: true,
    };

    bot.sendMessage(chatId, "Please choose another option:", {
      reply_markup: replyMarkup,
    });
  } else if (
    messageText === "at intervals of 3 hours" ||
    messageText === "at intervals of 6 hours"
  ) {
    const interval = messageText === "at intervals of 3 hours" ? 3 : 6;
    const response = await getWeatherForecast(cityName, interval);
    bot.sendMessage(chatId, formatForecastMessage(response));

    const keyboard = [[{ text: `Get ${cityName} Weather` }]];
    const replyMarkup = {
      keyboard: keyboard,
      resize_keyboard: true,
      one_time_keyboard: true,
    };

    await bot.sendMessage(chatId, "Please choose an option:", {
      reply_markup: replyMarkup,
    });
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
