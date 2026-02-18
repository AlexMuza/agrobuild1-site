// @vitest-environment node
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

describe("SEO files", () => {
  const root = process.cwd();
  const publicDir = path.join(root, "public");

  it("has sitemap.xml and robots.txt references it", () => {
    const sitemapPath = path.join(publicDir, "sitemap.xml");
    const robotsPath = path.join(publicDir, "robots.txt");

    expect(existsSync(sitemapPath)).toBe(true);
    expect(existsSync(robotsPath)).toBe(true);

    const robots = readFileSync(robotsPath, "utf-8");
    // Allow both relative and absolute sitemap URLs.
    expect(robots).toMatch(/Sitemap:\s*(https?:\/\/[^\s]+)?\/sitemap\.xml/i);
  });

  it("index.html has non-placeholder title and description", () => {
    const html = readFileSync(path.join(root, "index.html"), "utf-8");
    expect(html).toMatch(/<title>[^<]+<\/title>/i);
    expect(html).not.toMatch(/Lovable App/i);
    // Allow pretty-printed <meta ...> across multiple lines.
    expect(html).toMatch(/name\s*=\s*\"description\"/i);
  });
});

