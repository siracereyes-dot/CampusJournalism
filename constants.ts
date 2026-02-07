
export const DEPED_NCR_DIVISIONS = [
  'Caloocan City',
  'Las Piñas City',
  'Makati City',
  'Malabon City',
  'Mandaluyong City',
  'Manila',
  'Marikina City',
  'Muntinlupa City',
  'Navotas City',
  'Parañaque City',
  'Pasay City',
  'Pasig City',
  'Quezon City',
  'San Juan City',
  'Taguig City-Pateros',
  'Valenzuela City'
] as const;

export const SCORING_CONSTANTS = {
  ACADEMIC: {
    'Highest Honors': 15,
    'High Honors': 10,
    'Honors': 5,
    '85-89 Average': 3,
    'None': 0,
  },
  CONTESTS: {
    National: [25, 24, 23, 22, 21],
    Regional: [20, 19, 18, 17, 16],
    Division: [15, 14, 13, 12, 11],
  },
  SPECIAL_AWARDS: {
    National: [15, 14, 13, 12, 11],
    Regional: [10, 9, 8, 0, 0],
    Division: [7, 6, 5, 0, 0],
  },
  PUB_LEADERSHIP: {
    'Editor in Chief': 10,
    'Associate Editor': 8,
    'Section Editor': 5,
    'Writer/Contributor/Others': 3,
    'None': 0,
  },
  GUILD_LEADERSHIP: {
    'President': { National: 10, Regional: 7, Division: 4 },
    'Vice President': { National: 9, Regional: 6, Division: 3 },
    'Other positions recognized by DepEd': { National: 8, Regional: 5, Division: 2 },
  },
  INNOVATIONS: {
    National: 30,
    Regional: 25,
    Division: 20,
    District: 15,
    School: 10,
    None: 0,
  },
  COMMUNITY: {
    'COMMITTEE CHAIRPERSON': { National: 10, Regional: 8, Division: 6 },
    'FACILITATOR': { National: 8, Regional: 6, Division: 4 },
  },
  PUBLISHED_WORKS: {
    National: 5,
    Regional: 3,
    Division: 1,
    None: 0,
  },
  TRAININGS: {
    National: 5,
    Regional: 4,
    Division: 3,
    'School/District': 2,
    None: 0,
  }
} as const;

export const RANK_MAP: Record<string, number> = {
  '1ST': 0,
  '2ND': 1,
  '3RD': 2,
  '4TH': 3,
  '5TH': 4,
};
