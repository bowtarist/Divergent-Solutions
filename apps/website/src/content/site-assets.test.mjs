import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import site from "./site.json" with { type: "json" };

const contentDir = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(contentDir, "../../public");

function publicPathExists(publicPath) {
  return existsSync(path.join(publicDir, publicPath.replace(/^\//, "")));
}

describe("public website image assets", () => {
  it("has the logo asset", () => {
    assert.equal(publicPathExists("/images/brand/divergent-logo.jpg"), true);
  });

  it("has every image referenced by content", () => {
    const imagePaths = [
      site.hero.primaryImage,
      ...site.projects.map((project) => project.image)
    ];

    for (const imagePath of imagePaths) {
      assert.equal(publicPathExists(imagePath), true, `${imagePath} should exist`);
    }
  });
});
