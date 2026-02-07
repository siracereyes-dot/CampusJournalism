
export interface CandidateInfo {
  division: string;
  school: string;
  name: string;
}

export interface AcademicScore {
  rank: 'Highest Honors' | 'High Honors' | 'Honors' | '85-89 Average' | 'None';
  points: number;
}

export interface ContestScore {
  level: 'National' | 'Regional' | 'Division' | 'None';
  rank: '1ST' | '2ND' | '3RD' | '4TH' | '5TH' | 'None';
  points: number;
}

export interface SpecialAwardScore {
  level: 'National' | 'Regional' | 'Division' | 'None';
  rank: '1ST' | '2ND' | '3RD' | '4TH' | '5TH' | 'None';
  points: number;
}

export interface PublicationLeadership {
  position: 'Editor in Chief' | 'Associate Editor' | 'Section Editor' | 'Writer/Contributor/Others' | 'None';
  points: number;
}

export interface GuildLeadership {
  position: 'President' | 'Vice President' | 'Other positions recognized by DepEd' | 'None';
  level: 'National' | 'Regional' | 'Division' | 'None';
  points: number;
}

export interface InnovationScore {
  level: 'National' | 'Regional' | 'Division' | 'District' | 'School' | 'None';
  points: number;
}

export interface CommunityService {
  role: 'COMMITTEE CHAIRPERSON' | 'FACILITATOR' | 'None';
  level: 'National' | 'Regional' | 'Division' | 'None';
  points: number;
}

export interface PublishedWorks {
  level: 'National' | 'Regional' | 'Division' | 'None';
  points: number;
}

export interface TrainingScore {
  level: 'National' | 'Regional' | 'Division' | 'School/District' | 'None';
  points: number;
}

export interface InterviewScore {
  journalismPrinciples: number;
  leadershipPotential: number;
  experienceEngagement: number;
  commitmentGrowth: number;
  communicationSkills: number;
}

export interface ScoringState {
  info: CandidateInfo;
  academic: AcademicScore;
  individualContests: ContestScore;
  groupContests: ContestScore;
  specialAwards: SpecialAwardScore;
  pubLeadership: PublicationLeadership;
  guildLeadership: GuildLeadership;
  innovation: InnovationScore;
  communityService: CommunityService;
  publishedWorks: PublishedWorks;
  trainings: TrainingScore;
  interview: InterviewScore;
}
