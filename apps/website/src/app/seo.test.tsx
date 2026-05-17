import assert from "node:assert/strict";
import test from "node:test";
import robots from "./robots";
import sitemap from "./sitemap";

const siteUrl = "https://www.divergentsolutionsllc.com";

test("allows search engines to crawl the public website", () => {
  const config = robots();

  assert.deepEqual(config.rules, {
    userAgent: "*",
    allow: "/",
  });
  assert.equal(config.sitemap, `${siteUrl}/sitemap.xml`);
});

test("publishes the minimum launch pages in the sitemap", () => {
  const urls = sitemap().map((entry) => entry.url);

  assert.deepEqual(urls, [
    siteUrl,
    `${siteUrl}/gutter-installation`,
    `${siteUrl}/services`,
    `${siteUrl}/work`,
    `${siteUrl}/reviews`,
    `${siteUrl}/about`,
    `${siteUrl}/request-a-quote`,
  ]);
});
