"use client";

import { useState } from "react";
import { FadeIn } from "@/components/motion";
import { Container, Heading, Section } from "@/components/primitives";
import {
  ApplicationDetail,
  ApplicationTopology,
  SanitizationBoundary,
  SnapshotSummary,
} from "@/features/infra/infra-components";
import {
  selectApplication,
  selectInfrastructureApplications,
} from "@/features/infra/infra-selectors";
import type { InfraFetchStatus } from "@/infra/api";
import type { PublicInfrastructureSnapshot } from "@/infra/public-schema";

export function InfraView({
  initial,
  fetchStatus,
  fetchNote,
}: {
  initial: PublicInfrastructureSnapshot;
  fetchStatus: InfraFetchStatus;
  fetchNote: string;
}) {
  const applications = selectInfrastructureApplications(initial);
  const [selectedId, setSelectedId] = useState(applications[0]?.id ?? "");
  const selected = selectApplication(applications, selectedId);

  return (
    <Section className="bg-[#d9d0bf] py-12 text-[#202018] sm:py-16">
      <Container width="wide">
        <header className="relative bg-[#f4eddf] px-5 py-7 shadow-[5px_6px_0_0_#a89f8d] sm:px-8 sm:py-10">
          <span
            aria-hidden="true"
            className="absolute left-5 top-7 h-2 w-2 bg-[#173d8f] sm:left-8 sm:top-10"
          />
          <Heading level={1} className="max-w-3xl pt-3 text-[#202018]">
            Infrastructure, made legible.
          </Heading>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#514b40] sm:text-lg">
            Explore a read-only snapshot of applications in my personal Kubernetes environment. The
            monitor translates health, configuration match, and replica readiness into plain
            language.
          </p>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-[#37332c]">
            Only explicitly allowlisted public fields reach this page. The collector, source
            responses, and private environment remain behind the sanitization boundary.
          </p>
        </header>

        <div className="mt-8">
          <SnapshotSummary snapshot={initial} fetchStatus={fetchStatus} fetchNote={fetchNote} />
        </div>

        <div className="mt-8 overflow-hidden border-2 border-[#817765] bg-[#f4eddf] shadow-[5px_6px_0_0_#a89f8d]">
          <div className="grid lg:grid-cols-[minmax(18rem,0.7fr)_minmax(0,1.3fr)]">
            <div className="border-b border-[#817765] lg:border-r lg:border-b-0">
              <ApplicationTopology
                applications={applications}
                selectedId={selected?.id ?? ""}
                onSelect={setSelectedId}
              />
            </div>
            <div className="min-w-0">
              <p className="sr-only" aria-live="polite">
                {selected ? `Selected application: ${selected.name}` : "No published applications"}
              </p>
              {selected ? (
                <FadeIn key={selected.id}>
                  <ApplicationDetail application={selected} />
                </FadeIn>
              ) : (
                <section className="p-6 sm:p-9" aria-labelledby="empty-infrastructure-heading">
                  <h2 id="empty-infrastructure-heading" className="text-2xl font-bold">
                    No applications published
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[#514b40]">
                    This snapshot does not contain any public application records.
                  </p>
                </section>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <SanitizationBoundary />
        </div>
      </Container>
    </Section>
  );
}
