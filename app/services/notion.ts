const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const getPage = async function (url: URL) {
  const results = await notion.search({ query: url });
  const idFirstResult = results[0].id;

  const page = await notion.pages(idFirstResult);
  return page;
};

module.exports = { getPage };
