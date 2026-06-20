import { notFound } from "next/navigation";
import { ConsensusPanel } from "@/components/consensus-panel";
import { EvidenceCard } from "@/components/evidence-card";
import { EvidenceForm } from "@/components/evidence-form";
import { VotePanel } from "@/components/vote-panel";
import { summarizeEvidence } from "@/lib/consensus";
import { getConsensusDisplay, getProfileDescription } from "@/lib/profile-display";
import { getEvidenceForProfile, getProfileBySlug, getTypingData } from "@/lib/queries";
import { formatCategory, getInitials } from "@/lib/utils";

const visibleSystemOrder = ["MBTI", "ENNEAGRAM"];

async function loadProfileDetailData(profileId: string) {
  const [{ typingSystems, typeOptions }, evidence] = await Promise.all([getTypingData(), getEvidenceForProfile(profileId)]);
  const typeOptionMap = new Map(typeOptions.map((option) => [option.id, option]));
  const evidenceWithTypes = evidence.map((card) => {
    const matchedType = typeOptionMap.get(card.type_option_id);

    return {
      ...card,
      type_options: card.type_options ?? (matchedType ? { code: matchedType.code, label: matchedType.label } : null),
    };
  });

  return { typingSystems, typeOptions, evidenceWithTypes };
}

export default async function ProfileDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = await getProfileBySlug(slug);
  if (!profile) notFound();
  const { typingSystems, typeOptions, evidenceWithTypes } = await loadProfileDetailData(profile.id);

  const primaryConsensus =
    profile.consensus.find((item) => item.systemCode === "MBTI" && item.consensusCode) ??
    profile.consensus.find((item) => item.consensusCode);
  const whyThisType = summarizeEvidence({
    consensusCode: primaryConsensus?.consensusCode ?? null,
    evidence: evidenceWithTypes,
  });

  return (
    <main>
      <section className="border-b border-white/10 bg-black/[0.16]">
        <div className="page-shell grid gap-8 py-10 sm:py-12 lg:grid-cols-[340px_1fr] lg:items-end">
          <div className="glass-panel aspect-[4/5] overflow-hidden p-2">
            {profile.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.image_url} alt="" className="h-full w-full rounded-md object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center rounded-md bg-[linear-gradient(135deg,rgba(244,240,232,0.11),rgba(198,161,91,0.16)_45%,rgba(71,123,142,0.13))]">
                <div className="flex size-24 items-center justify-center rounded-full border border-white/10 bg-black/20 text-3xl font-semibold text-ink/80">
                  {getInitials(profile.name)}
                </div>
              </div>
            )}
          </div>
          <div>
            <p className="eyebrow">{formatCategory(profile.category)}</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-ink sm:text-5xl">{profile.name}</h1>
            {profile.source_title ? <p className="mt-3 text-lg text-ink/55 sm:text-xl">{profile.source_title}</p> : null}
            <p className="body-copy mt-6 max-w-3xl text-ink/70">{getProfileDescription(profile.description)}</p>
            <div className="mt-7 grid max-w-3xl gap-3 sm:grid-cols-2">
              {profile.consensus
                .filter((item) => visibleSystemOrder.includes(item.systemCode))
                .sort((a, b) => visibleSystemOrder.indexOf(a.systemCode) - visibleSystemOrder.indexOf(b.systemCode))
                .map((item) => {
                  const display = getConsensusDisplay(item);

                  return (
                    <div key={item.systemCode} className="subtle-panel p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-ink/45">{item.systemCode}</p>
                      <div className="mt-2 flex items-end justify-between gap-3">
                        <p className="text-2xl font-semibold text-ink">{display.code}</p>
                        <p className="text-sm font-semibold text-brass">
                          {display.confidenceLabel === "Pending" ? "0%" : display.confidenceLabel}
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-ink/45">{display.status}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </section>

      <div className="page-shell grid gap-6 py-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Typing</p>
                <h2 className="section-title mt-2">Current read</h2>
              </div>
            </div>
            <div className="mt-4">
              <ConsensusPanel consensus={profile.consensus} />
            </div>
          </section>
          <section className="glass-panel p-5">
            <h2 className="text-xl font-semibold text-ink">Why this type?</h2>
            <p className="mt-3 leading-7 text-ink/70">{whyThisType}</p>
          </section>
          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-ocean">Evidence</p>
                <h2 className="section-title mt-2">Argument cards</h2>
              </div>
            </div>
            <div className="mt-5 grid gap-4">
              {evidenceWithTypes.length > 0 ? (
                evidenceWithTypes.map((card) => <EvidenceCard key={card.id} evidence={card} />)
              ) : (
                <div className="glass-panel border-dashed p-8 text-center text-ink/55">
                  <p className="text-lg font-semibold text-ink">No evidence yet</p>
                  <p className="mt-2 text-sm leading-6 text-ink/60">
                    Add the first evidence card to explain why a type should rise, fall, or stay in place.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <VotePanel profile={profile} typingSystems={typingSystems} typeOptions={typeOptions} />
          <EvidenceForm profile={profile} typingSystems={typingSystems} typeOptions={typeOptions} />
        </aside>
      </div>
    </main>
  );
}
