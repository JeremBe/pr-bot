const { getPage } = require("../utils/notion");

const routes = (app) => {
  app.get("/api/webhook", (req, res) => {
    console.log("==================================");
    console.log("==================================");
    console.log(req.query);

    res.status(200).json();
  });

  app.post("/api/webhook", (req, res) => {
    console.log("==================================");
    console.log(req.body);

    res.status(200).json();
  });

  app.get("/api/notion/getPageByUrl", async (req, res) => {
    const url = new URL(req.query.params.url);

    const page = await getPage(url);
    res.status(200).json(page);
  });
};

module.exports = { routes };
