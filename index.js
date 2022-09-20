const puppeteer = require("puppeteer");
const express = require("express");
const cheerio = require("cheerio"); // 1.0.0-rc.12
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// USER INPUT DATA //

const emailID = "sampleemail@gmail.com";
const password = "samplepassword";
const fullName = "Sample fullname";
const phoneNumber = "+35312345678";
const message =
  "Lorem Ipsum - type your short and crisp message which explains a bit about you";

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

app = express(); // Initializing app

/// FILL FORM WEB SCRAP FUNCTION ///
const fillForm = async (targetlink) => {
  console.log("filling form for: ", targetlink);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on("request", (req) => {
    if (
      req.resourceType() == "stylesheet" ||
      req.resourceType() == "font" ||
      req.resourceType() == "image"
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.goto(targetlink);
  const elements = await page.$x("//button[normalize-space()='Accept All']");
  await elements[0].click();
  console.log("cookies accepted");

  const signIn = await page.waitForXPath("//a[contains(., 'Sign in')]");
  await Promise.all([
    signIn.evaluate((el) => el.click()),
    page.waitForNavigation(),
  ]);

  console.log("Sign in clicked");
  await page.waitForSelector("#username");
  await page.type("#username", emailID);
  await page.type("#password", password);
  await page.click('[name="login"]');
  await page.waitForNavigation();
  console.log("Signed in");

  emailagent = [
    "//button[normalize-space()='Email Agent']",
    "//button[normalize-space()='Email']",
  ];
  const a = await page.$x("//button[normalize-space()='Email Agent']");
  const b = await page.$x("//button[normalize-space()='Email']");
  var formfillbutton = [];
  if (a.length > 0) {
    formfillbutton = a;
  } else {
    formfillbutton = b;
  }

  await formfillbutton[0].evaluate((c) => c.click());
  console.log("Email agent clicked");

  const fullnameSelector = "#keyword1";
  const emailSelector = "#keyword2";
  const phonenoSelector = "#keyword3";
  const messageSelector = "#message";
  await page.waitForSelector(fullnameSelector);
  await page.waitForSelector(emailSelector);
  await page.waitForSelector(phonenoSelector);
  await page.waitForSelector(messageSelector);
  await page.type(fullnameSelector, fullName, { delay: 100 });

  const inputValue = await page.$eval(fullnameSelector, (el) => el.value);
  for (let i = 0; i < inputValue.length; i++) {
    await page.keyboard.press("Backspace");
  }
  await page.type(fullnameSelector, fullName, { delay: 100 });
  await page.type(emailSelector, emailID, { delay: 100 });
  await page.type(phonenoSelector, phoneNumber, { delay: 100 });
  await page.type(messageSelector, message, { delay: 100 });
  const submit = await page.$x("//button[@type='submit']");
  submit[0].click();
  console.log("Form Submitted");
  await timer(4000);
  var confirmation = "";
  try {
    var confirmation = await page.waitForXPath(
      "//div[@class='Alert__MessageWrapper-sc-3b1i0x-0 hAJitp']"
    );
  } catch (e) {
    console.log("Error happened while submitting form");
  }

  await browser.close();
  var final = confirmation ? true : false;
  return final;
};

async function getLinks(url) {
  return fetch(url)
    .then((res) => res.text())
    .then((html) => {
      const $ = cheerio.load(html);
      const sel = '[data-testid="results"] a[href]';
      var links = [...$(sel)].map((e) => e.attribs.href);
      return Promise.all(links);
    });
}

async function main(linkrun, target) {
  var baseLink = await getLinks(linkrun);
  console.log(baseLink);
  while (true) {
    var reloadedLink = await getLinks(linkrun);
    let difference = reloadedLink.filter((x) => !baseLink.includes(x));

    if (difference.length > 0) {
      console.log("difference found: ", difference);
      for await (const item of difference) {
        let url = "https://www.daft.ie";
        let finalUrl = url.concat(item);
        const confirmation = await fillForm(finalUrl);
        confirmation
          ? console.log("New house applied:", finalUrl, Date.now())
          : console.log("Not able to apply:", finalUrl, Date.now());
        await timer(5000);
      }
      baseLink = reloadedLink;
    }
    console.log("running: ", reloadedLink[0], target);

    // main timer - edit this timer as to often do you want the bot to run
    // in order to not get banned from IP adress running this bot every 3 mins might be safe enough //
    await timer(18000);
  }
}

async function mainRun() {
  links = [
    // paste your daft search result link here
    "https://www.daft.ie/property-for-rent/dublin-4-dublin?radius=5000&rentalPrice_to=1200&numBeds_to=1&numBeds_from=1&sort=publishDateDesc",
    // "https://www.daft.ie/property-for-rent/dublin-4-dublin?radius=5000&rentalPrice_to=2400&numBeds_to=2&numBeds_from=2&sort=publishDateDesc",
    // "https://www.daft.ie/property-for-rent/dublin-4-dublin?radius=5000&rentalPrice_to=3500&numBeds_to=3&numBeds_from=3&sort=publishDateDesc",
    // "https://www.daft.ie/property-for-rent/dublin-4-dublin?radius=5000&rentalPrice_to=5000&numBeds_to=4&numBeds_from=4&sort=publishDateDesc",
  ];
  main(links[0], "1bhk");
  // run multiple search queries like this
  //   main(links[1], "2bhk");
  //   main(links[2], "3bhk");
  //   main(links[3], "4bhk");
}

mainRun();

app.listen(3000);
