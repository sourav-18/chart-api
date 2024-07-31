const dateFormat = require("dateformat");

exports.getCurrentDateWithTimeString = () => {
  const date = new Date();
  const format = "yyyy-mm-dd HH:MM:ss";
  return dateFormat(
    new Date(date.toString()).toLocaleString("en-US", {
      timeZone: "Asia/Calcutta",
    }),
    format
  );
};
