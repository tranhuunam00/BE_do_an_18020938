const axios = require("axios");
const constants = require("../constants/constants");
const logger = require("../utils/logger");

const query = {
  redirect_uri: "http://localhost:5003/api/google/return-calender",
  prompt: `consent`,
  response_type: "code",
  client_id:
    constants.CALENDER_CLIENT_KEY ||
    "538083935372-25hfb8q8gute01d17orr12d0139hk159.apps.googleusercontent.com",
  scope:
    "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar",
  access_type: "offline",
};

const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
  constants.CALENDER_CLIENT_KEY,
  constants.CALENDER_SECRET_KEY
);

//fe handle because redie
const authGoogle = async () => {
  const queryString = new URLSearchParams(query).toString();
  axios
    .get(`https://accounts.google.com/o/oauth2/v2/auth?${queryString}`)
    .then(function (response) {})
    .catch(function (error) {})
    .then(function () {});
};
///
///
const getTokenGoogleAPi = async (query) => {
  query.redirect_uri = constants.CALENDER_REDIRECT_URI;
  query.client_id = constants.CALENDER_CLIENT_KEY;
  query.client_secret = constants.CALENDER_SECRET_KEY;
  query.grant_type = "authorization_code";

  const queryString = new URLSearchParams(query).toString();
  const res = await new Promise((resolve, reject) => {
    axios
      .post(`https://oauth2.googleapis.com/token?${queryString}`)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        reject(false);
      });
  });
  return res;
};

const createGoogleCalender = async (refreshToken) => {
  try {
    oAuth2Client.setCredentials({
      refresh_token: refreshToken,
    });
    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    const eventStartTime = new Date();
    eventStartTime.setDate(eventStartTime.getDay() + 1);

    const eventEndTime = new Date();
    eventEndTime.setDate(eventEndTime.getDay() + 1);
    eventEndTime.setMinutes(eventEndTime.getMinutes() + 40);

    const event = {
      summary: `đi tắm`,
      location: `30 Cầu Giấy St, Hà Nội, CA 94118`,
      description: `sự kiện này rất quan trọng nè`,
      colorId: 1,
      start: {
        dateTime: eventStartTime,
        timeZone: "Asia/Ho_Chi_Minh",
      },
      end: {
        dateTime: eventEndTime,
        timeZone: "Asia/Ho_Chi_Minh",
      },
    };
    const createRes = await new Promise((resolve, reject) => {
      calendar.freebusy.query(
        {
          resource: {
            timeMin: eventStartTime,
            timeMax: eventEndTime,
            timeZone: "Asia/Ho_Chi_Minh",
            items: [{ id: "primary" }],
          },
        },
        async (err, res) => {
          if (err) {
            logger.error("Free Busy Query Error: ", err);
            reject(err);
          }

          // Create an array of all events on our calendar during that time.
          const eventArr = res.data.calendars.primary.busy;

          if (eventArr.length === 0) {
            const calender = await new Promise((resolve, reject) => {
              calendar.events.insert(
                { calendarId: "primary", resource: event },
                (err) => {
                  if (err) {
                    logger.error("Error Creating Calender Event:", err);
                    reject(false);
                  }
                  logger.debug("Create Calender Success");
                  resolve(true);
                }
              );
            });
            resolve({ status: calender });
          } else {
            logger.debug(`Create Calender -> this time have busy`);
            reject("this time have busy");
          }
        }
      );
    });
    return createRes;
  } catch (err) {
    logger.debug(`[createGoogleCalender] error ${err}`);
    return { status: false, err: err };
  }
};
module.exports = { authGoogle, getTokenGoogleAPi, createGoogleCalender };
