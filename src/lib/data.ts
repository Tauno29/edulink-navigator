export type Region = {
  id: string;
  name: string;
  capital: string;
  totalSchools: number;
  governmentSchools: number;
  privateSchools: number;
  primarySchools: number;
  secondarySchools: number;
  combinedSchools: number;
  totalCapacity: number;
  enrolled: number;
  color: string;
  gradient: string;
};

export type GradeAvailability = {
  grade: string;
  capacity: number;
  enrolled: number;
  classes: number;
  classList: ClassGroup[];
};

export type ClassGroup = {
  id: string;
  name: string;
  capacity: number;
  enrolled: number;
  field: string;
  teacher: string;
};

export type School = {
  id: string;
  name: string;
  regionId: string;
  town: string;
  type: "Government" | "Private";
  level: "Primary" | "Secondary" | "Combined";
  boarding: boolean;
  language: string;
  principal: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  established: number;
  description: string;
  mission: string;
  vision: string;
  facilities: string[];
  subjects: string[];
  extracurricular: string[];
  grades: GradeAvailability[];
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  time: string;
  type: "availability" | "reminder" | "announcement";
  unread: boolean;
};

export type Announcement = { id: string; title: string; body: string; tag: string };

/** The 14 official regions of Namibia. Counts are derived from live school records. */
const REGION_BASE = [
  { id: "erongo", name: "Erongo", capital: "Swakopmund", color: "oklch(0.68 0.16 260)", gradient: "from-indigo-400 to-violet-500" },
  { id: "hardap", name: "Hardap", capital: "Mariental", color: "oklch(0.75 0.17 55)", gradient: "from-amber-400 to-orange-500" },
  { id: "karas", name: "//Kharas", capital: "Keetmanshoop", color: "oklch(0.72 0.17 155)", gradient: "from-emerald-400 to-teal-500" },
  { id: "kavango-east", name: "Kavango East", capital: "Rundu", color: "oklch(0.72 0.14 220)", gradient: "from-sky-400 to-blue-500" },
  { id: "kavango-west", name: "Kavango West", capital: "Nkurenkuru", color: "oklch(0.72 0.14 200)", gradient: "from-cyan-400 to-sky-500" },
  { id: "khomas", name: "Khomas", capital: "Windhoek", color: "oklch(0.68 0.2 25)", gradient: "from-rose-400 to-red-500" },
  { id: "kunene", name: "Kunene", capital: "Opuwo", color: "oklch(0.82 0.15 90)", gradient: "from-yellow-400 to-amber-500" },
  { id: "ohangwena", name: "Ohangwena", capital: "Eenhana", color: "oklch(0.68 0.17 300)", gradient: "from-purple-400 to-fuchsia-500" },
  { id: "omaheke", name: "Omaheke", capital: "Gobabis", color: "oklch(0.75 0.15 40)", gradient: "from-orange-400 to-red-500" },
  { id: "omusati", name: "Omusati", capital: "Outapi", color: "oklch(0.68 0.18 340)", gradient: "from-pink-400 to-rose-500" },
  { id: "oshana", name: "Oshana", capital: "Oshakati", color: "oklch(0.72 0.15 180)", gradient: "from-teal-400 to-cyan-500" },
  { id: "oshikoto", name: "Oshikoto", capital: "Omuthiya", color: "oklch(0.72 0.14 240)", gradient: "from-blue-400 to-indigo-500" },
  { id: "otjozondjupa", name: "Otjozondjupa", capital: "Otjiwarongo", color: "oklch(0.68 0.17 20)", gradient: "from-red-400 to-orange-500" },
  { id: "zambezi", name: "Zambezi", capital: "Katima Mulilo", color: "oklch(0.72 0.16 140)", gradient: "from-green-400 to-emerald-500" },
];

const GRADE_LIST = ["Pre-Primary","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6","Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12"];

const FIELD_LIST = [
  "Arts & Culture",
  "Commerce & Accounting",
  "Computer Studies",
  "Environmental Studies",
  "General Education",
  "Humanities & Arts",
  "Literacy & Numeracy",
  "Natural Sciences",
  "Pre-Commerce",
  "Pre-Science",
  "Technical & Vocational",
  "Technical Skills",
];

/** No school records have been captured yet. */
export const SCHOOLS: School[] = [];

export const NOTIFICATIONS: Notification[] = [];

export const ANNOUNCEMENTS: Announcement[] = [];

export function schoolStats(s: School) {
  const capacity = s.grades.reduce((a, g) => a + g.capacity, 0);
  const enrolled = s.grades.reduce((a, g) => a + g.enrolled, 0);
  return {
    capacity,
    enrolled,
    available: Math.max(0, capacity - enrolled),
    occupancy: capacity > 0 ? Math.round((enrolled / capacity) * 100) : 0,
  };
}

export const REGIONS: Region[] = REGION_BASE.map((base) => {
  const schools = SCHOOLS.filter((s) => s.regionId === base.id);
  let totalCapacity = 0;
  let enrolled = 0;
  for (const s of schools) {
    const st = schoolStats(s);
    totalCapacity += st.capacity;
    enrolled += st.enrolled;
  }
  return {
    ...base,
    totalSchools: schools.length,
    governmentSchools: schools.filter((s) => s.type === "Government").length,
    privateSchools: schools.filter((s) => s.type === "Private").length,
    primarySchools: schools.filter((s) => s.level === "Primary").length,
    secondarySchools: schools.filter((s) => s.level === "Secondary").length,
    combinedSchools: schools.filter((s) => s.level === "Combined").length,
    totalCapacity,
    enrolled,
  };
});

export function getRegion(id: string) {
  return REGIONS.find((r) => r.id === id);
}
export function getSchool(id: string) {
  return SCHOOLS.find((s) => s.id === id);
}
export function schoolsByRegion(id: string) {
  return SCHOOLS.filter((s) => s.regionId === id);
}

export const GRADES = GRADE_LIST;
export const FIELDS = FIELD_LIST;

/** Pre-computed, immutable search index so filtering never re-walks nested class lists. */
export type SchoolIndexEntry = {
  school: School;
  regionId: string;
  regionName: string;
  regionColor: string;
  text: string;
  available: number;
  capacity: number;
  enrolled: number;
  /** grade -> open seats */
  gradeOpen: Record<string, number>;
  fields: Set<string>;
};

export const SCHOOL_INDEX: SchoolIndexEntry[] = SCHOOLS.map((school) => {
  const region = REGIONS.find((r) => r.id === school.regionId)!;
  const stats = schoolStats(school);
  const gradeOpen: Record<string, number> = {};
  const fields = new Set<string>();
  for (const g of school.grades) {
    gradeOpen[g.grade] = g.capacity - g.enrolled;
    for (const c of g.classList) fields.add(c.field);
  }
  return {
    school,
    regionId: school.regionId,
    regionName: region.name,
    regionColor: region.color,
    text: `${school.name} ${school.town} ${region.name} ${school.type}`.toLowerCase(),
    available: stats.available,
    capacity: stats.capacity,
    enrolled: stats.enrolled,
    gradeOpen,
    fields,
  };
});
