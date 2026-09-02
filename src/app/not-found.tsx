import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/primitives";
import { navItems } from "@/design/site-config";

export const metadata: Metadata = {
  title: "Route not found",
};

export default function NotFound() {
  return (
    <section
      className="min-h-[70vh] border-y-2 border-[#786f60] bg-[#ddd3bf] bg-[linear-gradient(rgba(23,61,143,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(23,61,143,0.055)_1px,transparent_1px)] bg-[size:28px_28px] py-16 text-[#24211b] dark:border-[#9a8f7b] dark:bg-[#151d2b] dark:text-[#f3ebdc] sm:py-24"
      aria-labelledby="not-found-title"
    >
      <Container width="narrow">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
          <div className="border-2 border-[#786f60] border-l-[12px] border-l-[#a83232] bg-[#f5eedf] p-6 shadow-[8px_8px_0_#8d826f] dark:border-[#9a8f7b] dark:border-l-[#d65b52] dark:bg-[#202a38] dark:shadow-[8px_8px_0_#080b11] sm:p-9">
            <h1
              id="not-found-title"
              className="max-w-[13ch] text-4xl font-bold leading-[0.98] tracking-[-0.045em] sm:text-6xl"
            >
              Route not found on this workbench.
            </h1>
            <p className="mt-6 inline-block border-2 border-[#a83232] bg-[#f4d7cf] px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.1em] text-[#6f211f] dark:border-[#d65b52] dark:bg-[#3a2428] dark:text-[#ffb5ac]">
              Error 404 / File table miss
            </p>
            <p className="mt-6 max-w-[58ch] text-base leading-7 text-[#655e51] dark:text-[#c7bdab]">
              MKS/98 checked the route register, program shelf, and mounted project index. The
              requested address is not assigned to a page.
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex min-h-12 items-center justify-center border-2 border-[#786f60] bg-[#f2c84b] px-5 py-3 text-sm font-bold text-[#24211b] no-underline shadow-[4px_4px_0_#8d826f] hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0_#8d826f] dark:border-[#9a8f7b] dark:shadow-[4px_4px_0_#080b11] dark:hover:shadow-[3px_3px_0_#080b11]"
            >
              Return to workbench home
            </Link>
          </div>

          <nav
            className="border-2 border-[#786f60] bg-[#f5eedf] shadow-[5px_5px_0_#8d826f] dark:border-[#9a8f7b] dark:bg-[#202a38] dark:shadow-[5px_5px_0_#080b11]"
            aria-labelledby="route-register-title"
          >
            <div className="border-b-2 border-[#786f60] bg-[#173d8f] p-4 text-white dark:border-[#9a8f7b] dark:bg-[#3f6fc4]">
              <h2 id="route-register-title" className="text-lg font-bold">
                Registered routes
              </h2>
              <p className="mt-1 text-xs leading-5 text-white/75">Choose a known destination.</p>
            </div>
            <ul>
              {navItems.map((item, index) => (
                <li
                  key={item.href}
                  className={index > 0 ? "border-t border-[#b8ad98] dark:border-[#665f52]" : ""}
                >
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-sm font-semibold no-underline hover:bg-[#f2c84b] hover:text-[#24211b]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </section>
  );
}
