const md5 = require("md5");
const bccrypt = require("bcrypt");

const testbed = async () => {
  const testString = "Advance databases";

  const start = new Date().getTime();

  const end = new Date().getTime();

  console.log("the total time take is: " + (end - start) / 1000 + "seconds");
};

testbed();
