const DATE_TIME_CONFIG = {
  UTC: {
    timeZone: "UTC",
    format: "yyyy-mm-dd",
    locale: "en-US",
    hour12: false
  },
  INDIA: {
    timeZone: "Asia/Kolkata",
    format: "yyyy-mm-dd",
    locale: "en-US",
    hour12: false
  }
};

class DateTimeFormatter {
  constructor(date, tenant) {
    this.date = date;
    this.config = DATE_TIME_CONFIG[tenant];
  }

  getLocaleDateTimeStr() {
    const { locale, timeZone } = this.config;
    return new Date(this.date).toLocaleString(locale, { timeZone });
  }

  // getLocaleDateStr() {
  //   const { locale, timeZone } = this.config;
  //   return new Date(this.date).toLocaleDateString(locale, { timeZone });
  // }

  formatyyyymmdd() {
    const convertedDate = this.getLocaleDateTimeStr();
    const dateObj = new Date(convertedDate);
    const yyyy = dateObj.getFullYear();
    const mm = `0${dateObj.getMonth() + 1}`.slice(-2);
    const dd = `0${dateObj.getDate()}`.slice(-2);
    return `${yyyy}-${mm}-${dd}`;
  }
}

module.exports = DateTimeFormatter;
