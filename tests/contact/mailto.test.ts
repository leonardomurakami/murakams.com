import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ContactPage from "../../src/app/contact/page";
import NotFound from "../../src/app/not-found";
import { buildMailtoHref } from "../../src/features/contact/mailto";

describe("accessible contact handoff", () => {
  it("creates a direct recipient-only mailto URL", () => {
    expect(buildMailtoHref({ recipient: "hello@murakams.com" })).toBe("mailto:hello@murakams.com");
  });

  it("encodes subject, message punctuation, and line breaks", () => {
    expect(
      buildMailtoHref({
        recipient: "hello@murakams.com",
        subject: "Status & availability",
        body: "Hello Leonardo,\nCan we talk? #SRE",
      }),
    ).toBe(
      "mailto:hello@murakams.com?subject=Status%20%26%20availability&body=Hello%20Leonardo%2C%0ACan%20we%20talk%3F%20%23SRE",
    );
  });

  it("renders a mailto-only composer and explicit GitHub and LinkedIn handoffs", () => {
    const html = renderToStaticMarkup(ContactPage());

    expect(html).toContain('action="mailto:muraleob@gmail.com"');
    expect(html).toContain("does not send or store messages");
    expect(html).toContain("GitHub");
    expect(html).toContain("LinkedIn");
    expect(html).toContain('href="https://www.linkedin.com/in/leonardo-murakami"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noreferrer noopener"');
  });
});

describe("accessible unknown-route state", () => {
  it("renders an original MKS/98 routing diagnostic and recovery navigation", () => {
    const html = renderToStaticMarkup(NotFound());

    expect(html).toContain("Route not found on this workbench");
    expect(html).toContain("Error 404 / File table miss");
    expect(html).toContain('href="/playground"');
    expect(html).toContain("Return to workbench home");
  });
});
