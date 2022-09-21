const cheerio = require("cheerio"); // 1.0.0-rc.12
const { fillForm } = require("./formTools");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// USER INPUT DATA //
const details = {
  emailID: "sample@example.com",
  password: "samplepassword",
  fullName: "Sample fullname",
  phoneNumber: "+353123456789",
  message:
    "Lorem Ipsum - type your short and crisp message which explains a bit about you",
};

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

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
  let firstRun = true;
  let baseLink = await getLinks(linkrun);
  console.log(baseLink);
  for (;;) {
    const reloadedLink = await getLinks(linkrun);
    const difference = firstRun
      ? reloadedLink
      : reloadedLink.filter((x) => !baseLink.includes(x));

    if (difference.length > 0) {
      console.log("difference found: ", difference);
      for await (const item of difference) {
        let url = "https://www.daft.ie";
        let finalUrl = url.concat(item);
        const confirmation = fillForm(finalUrl, details);
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
    await timer(1800);
    if (firstRun) firstRun = false;
  }
}

async function mainRun() {
  const links = [
    // paste your daft search result link here
    // "https://www.daft.ie/property-for-rent/dublin-4-dublin?radius=5000&rentalPrice_to=1200&numBeds_to=1&numBeds_from=1&sort=publishDateDesc",
    "https://www.daft.ie/property-for-rent/dublin-4-dublin?radius=5000&rentalPrice_to=2400&numBeds_to=2&numBeds_from=2&sort=publishDateDesc&numBaths_from=2&numBaths_to=2",
    // "https://www.daft.ie/property-for-rent/dublin-4-dublin?radius=5000&rentalPrice_to=2400&numBeds_to=2&numBeds_from=2&sort=publishDateDesc",
    // "https://www.daft.ie/property-for-rent/dublin-4-dublin?radius=5000&rentalPrice_to=3500&numBeds_to=3&numBeds_from=3&sort=publishDateDesc",
    // "https://www.daft.ie/property-for-rent/dublin-4-dublin?radius=5000&rentalPrice_to=5000&numBeds_to=4&numBeds_from=4&sort=publishDateDesc",
  ];
  main(links[0], "2 bed");
  // run multiple search queries like this
  //   main(links[1], "2bhk");
  //   main(links[2], "3bhk");
  //   main(links[3], "4bhk");
}

mainRun();
