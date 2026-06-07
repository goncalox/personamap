export type Category = "fictional" | "public_figure";
export type TypingSystemCode = "MBTI" | "ENNEAGRAM";
export type EvidenceStance = "for" | "against";

export type Profile = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  source_title: string | null;
  description: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type TypingSystem = {
  id: string;
  code: TypingSystemCode;
  name: string;
};

export type TypeOption = {
  id: string;
  typing_system_id: string;
  code: string;
  label: string;
  description: string | null;
};

export type Vote = {
  id: string;
  profile_id: string;
  user_id: string;
  typing_system_id: string;
  type_option_id: string;
  created_at: string;
  updated_at: string;
};

export type EvidenceCard = {
  id: string;
  profile_id: string;
  user_id: string;
  typing_system_id: string;
  type_option_id: string;
  title: string;
  body: string;
  stance: EvidenceStance;
  score: number;
  created_at: string;
  updated_at: string;
  type_options?: Pick<TypeOption, "code" | "label"> | null;
};

export type ProfileConsensus = {
  profileId: string;
  systemCode: TypingSystemCode;
  consensusCode: string | null;
  consensusLabel: string | null;
  confidence: number;
  totalVotes: number;
  status: "Speculative" | "Consensus" | "Contested" | "Highly contested";
  counts: Array<{
    code: string;
    label: string;
    votes: number;
    percentage: number;
  }>;
};

export type ProfileWithConsensus = Profile & {
  consensus: ProfileConsensus[];
};
