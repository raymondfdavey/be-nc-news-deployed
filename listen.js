const app = require("./app");

const { PORT = 9500 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));

// app.listen(9500, () => {
//   console.log("Listening on port 9500");
// });
