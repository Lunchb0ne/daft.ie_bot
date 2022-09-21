const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

/// FILL FORM WEB SCRAP FUNCTION ///
/**
 *
 * @param {String} targetlink - The link to the listing of the house you want to apply for
 * @param {Object} details - The details you want to fill in the form
 * @returns Boolean - true if the form was filled and submitted, false if not
 */
const fillForm = async (targetlink, details) => {
  console.log("filling form for: ", targetlink);
  const ListingID = targetlink.split("/").at(-1);
  console.log(ListingID + " is the listing ID");
  const headers = {
    Host: "gateway.daft.ie",
    "Content-Type": "application/json",
    Connection: "keep-alive",
    platform: "iOS",
    Accept: "application/json",
    brand: "daft",
    "Accept-Language": "en-GB,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "User-Agent": "Daft.ie/0 CFNetwork/1335.0.3 Darwin/21.6.0",
  };

  const url = "https://gateway.daft.ie/old/v1/reply";
  // data = '{"name":"name","tcAccepted":true,"email":"he1llo@gmail.com,"message":"agagag","adId":4001666,"phone":"085811463112"}'
  const data = {
    name: details.fullName,
    tcAccepted: "true",
    email: details.emailID,
    message: details.message,
    adId: ListingID,
    phone: details.phoneNumber,
  };
  // print(data)
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });

  return response.ok;
};

module.exports = { fillForm };
