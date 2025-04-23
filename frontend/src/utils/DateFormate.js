// src/utils/DateFormate.js

export const DateFormate = (date, m, t, day) => {
  // Initialize the options object
  let options = {};

  // Dynamically add properties to the options object based on flags
  if (day) {
    options.weekday = "short"; // Displays weekday (Mon, Tue, etc.)
  }

  if (m) {
    options.year = "numeric"; // '2024'
    options.month = "2-digit"; // 'Nov'
    options.day = "numeric"; // '14'
  }

  if (t) {
    options.hour = "numeric"; // '9'
    options.minute = "numeric"; // '06'
    options.second = "numeric"; // '40'
    options.hour12 = true; // 12-hour clock (AM/PM)
  }

  // Return the formatted date
  return new Date(date).toLocaleString("en-US", options);

  /* {new Date(register.application_date).toLocaleString(
                      "en-US",
                      {
                        weekday: "short", // Optional: displays weekday (Mon, Tue, etc.)
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true, // This ensures the AM/PM format
                      }
                    )} */
};
