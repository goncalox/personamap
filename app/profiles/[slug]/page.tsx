import { notFound } from "next/navigation";
import { ConsensusPanel } from "@/components/consensus-panel";
import { EvidenceCard } from "@/components/evidence-card";
import { EvidenceForm } from "@/components/evidence-form";
import { VotePanel } from "@/components/vote-panel";
import { summarizeEvidence } from "@/lib/consensus";
import { getProfileDescription } from "@/lib/profile-display";
import { getEvidenceForProfile, getProfileBySlug, getTypingData } from "@/lib/queries";
import { formatCategory, getInitials } from "@/lib/utils";

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

  const mbtiConsensus = profile.consensus.find((item) => item.systemCode === "MBTI");
  const whyThisType = summarizeEvidence({
    consensusCode: mbtiConsensus?.consensusCode ?? null,
    evidence: evidenceWithTypes,
  });

  return (
    <main>
      <section className="border-b border-white/10 bg-black/15">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[340px_1fr]">
          <div className="aspect-[4/5] overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
            {profile.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.image_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.28),_transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]">
                <div className="flex size-24 items-center justify-center rounded-full border border-white/10 bg-black/20 text-3xl font-semibold text-ink/80">
                  {getInitials(profile.name)}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brass">{formatCategory(profile.category)}</p>
            <h1 className="mt-3 text-5xl font-semibold text-ink">{profile.name}</h1>
            {profile.source_title ? <p className="mt-3 text-xl text-ink/55">{profile.source_title}</p> : null}
            <p className="mt-6 max-w-3xl text-base leading-7 text-ink/70">{getProfileDescription(profile.description)}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-ink/75">
                Current consensus below
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-ink/75">
                Vote to change the read
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-ink/75">
                Add evidence when you have it
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brass">Consensus</p>
                <h2 className="mt-2 text-3xl font-semibold text-ink">Current read</h2>
              </div>
              <p className="text-sm text-ink/55">Higher confidence means stronger agreement.</p>
            </div>
            <div className="mt-4">
              <ConsensusPanel consensus={profile.consensus} />
            </div>
          </section>
          <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-xl font-semibold text-ink">Why this type?</h2>
            <p className="mt-3 leading-7 text-ink/70">{whyThisType}</p>
          </section>
          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ocean">Evidence</p>
                <h2 className="mt-2 text-3xl font-semibold text-ink">Argument cards</h2>
              </div>
              <div className="flex rounded-md border border-white/10 bg-black/25 p-1 text-sm text-ink/60">
                <span className="rounded bg-white/10 px-3 py-1 text-ink">All</span>
                <span className="px-3 py-1">For</span>
                <span className="px-3 py-1">Against</span>
              </div>
            </div>
            <div className="mt-5 grid gap-4">
              {evidenceWithTypes.length > 0 ? (
                evidenceWithTypes.map((card) => <EvidenceCard key={card.id} evidence={card} />)
              ) : (
                <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.03] p-8 text-center text-ink/55">
                  <p className="text-lg font-semibold text-ink">No evidence yet</p>
                  <p className="mt-2 text-sm leading-6 text-ink/60">
                    This profile can still be voted on. Add the first evidence card to explain why a type should rise,
                    fall, or stay in place.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <VotePanel profile={profile} typingSystems={typingSystems} typeOptions={typeOptions} />
          <EvidenceForm profile={profile} typingSystems={typingSystems} typeOptions={typeOptions} />
          <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-xl font-semibold text-ink">Comments</h2>
            <p className="mt-3 text-sm leading-6 text-ink/60">Comment threads are represented in the schema and ready for a follow-up action.</p>
          </section>
        </aside>
      </div>
    </main>
  );
}
