import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import site from "@/content/site.json";
import { QuoteRequestForm } from "./QuoteRequestForm";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

function assertPhoneLink(markup: string, componentName: string) {
  assert.ok(markup.includes(`href="tel:${site.contact.phoneTel}"`), componentName);
  assert.ok(markup.includes(site.contact.phoneDisplay), componentName);
}

test("renders clickable public phone links in persistent website contact areas", () => {
  assertPhoneLink(renderToStaticMarkup(<SiteHeader />), "SiteHeader");
  assertPhoneLink(renderToStaticMarkup(<SiteFooter />), "SiteFooter");
  assertPhoneLink(renderToStaticMarkup(<QuoteRequestForm />), "QuoteRequestForm");
});
