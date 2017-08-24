const fetch = require("node-fetch");
const fs = require("fs");
const to = require("await-to-js").default;
const cheerio = require("cheerio");
const FormData = require("form-data");

const config = require("./config");
const { contains } = require("./helpers");

const getData = async (type, url) => await (await fetch(url))[type]();

const filterPools = (pools, streets) =>
  pools.filter(
    pool => streets.filter(street => pool.name.indexOf(street) > -1).length
  );

const getFilteredPools = async ({ pools }) =>
  filterPools(await getData("json", pools.url), pools.streets);

const isLogin = $ => contains("login", $("title").text());
const isWrongCredentials = $ => contains("wrong", $("#ctl00_snackbar").text());
const isBookingPage = $ => contains("bookingsystem", $("title").text());

const login = async ({ username, password, url }, fields) => {
  const body = new FormData();

  for (let field in fields) {
    if (fields.hasOwnProperty(field)) {
      body.append(field, fields[field]);
    }
  }

  body.append("ctl00$ContentPane$userid", username);
  body.append("ctl00$ContentPane$password", password);

  return await (await fetch(url, {
    method: "POST",
    body
  })).text();
};

const init = async (conf, cb) => {
  let err, data, pools, $;

  console.log("Getting pools...");
  [err, pools] = await to(getFilteredPools(conf));
  if (err) return cb("Couldn't get pools");

  console.log("Getting login page...");
  [err, data] = await to(getData("text", conf.login.url));
  if (err) return cb("Login page not found");

  $ = cheerio.load(data);

  if (isLogin($)) {
    const fields = conf.login.fields.reduce(
      (obj, field) => ({
        ...obj,
        [$(`input#${field}`).attr("name")]: $(`input#${field}`).val()
      }),
      {}
    );

    console.log("Logging in...");
    [err, data] = await to(login(conf.login, fields));
    if (err) return cb("Login failed");
  } else {
    return cb("Tried to fetch login page but got something else...");
  }

  $ = cheerio.load(data);

  if (isWrongCredentials($)) return cb("Wrong username or password");

  if (isBookingPage($)) {
    // book...
  } else {
    return cb("Assumed the booking page but got something else...");
  }
};

init(config, (err, res) => {
  if (err) console.error("Something went wrong: ", err);
  else console.info(res);
});
