module.exports = {
  login: {
    username: "sdfsdf",
    password: "hej",
    url: "https://booking1.sunfleet.com/login.aspx",
    fields: [
      "__VIEWSTATE",
      "__VIEWSTATEGENERATOR",
      "__EVENTVALIDATION",
      "ctl00_ContentPane_Button1"
    ]
  },
  pools: {
    url: "https://www.sunfleet.com/umbraco/surface/CarPools/GetCarPools",
    streets: ["Sickla Kanalgata", "eeh", "Midskeppsgatan", "Aktergatan"]
  }
};
