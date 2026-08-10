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

export const REGIONS: Region[] = [
  { id: "erongo", name: "Erongo", capital: "Swakopmund", totalSchools: 78, governmentSchools: 62, privateSchools: 16, primarySchools: 40, secondarySchools: 22, combinedSchools: 16, totalCapacity: 24560, enrolled: 23315, color: "oklch(0.68 0.16 260)", gradient: "from-indigo-400 to-violet-500" },
  { id: "hardap", name: "Hardap", capital: "Mariental", totalSchools: 54, governmentSchools: 46, privateSchools: 8, primarySchools: 30, secondarySchools: 14, combinedSchools: 10, totalCapacity: 15420, enrolled: 14530, color: "oklch(0.75 0.17 55)", gradient: "from-amber-400 to-orange-500" },
  { id: "karas", name: "//Kharas", capital: "Keetmanshoop", totalSchools: 61, governmentSchools: 51, privateSchools: 10, primarySchools: 34, secondarySchools: 17, combinedSchools: 10, totalCapacity: 18220, enrolled: 17118, color: "oklch(0.72 0.17 155)", gradient: "from-emerald-400 to-teal-500" },
  { id: "kavango-east", name: "Kavango East", capital: "Rundu", totalSchools: 67, governmentSchools: 60, privateSchools: 7, primarySchools: 38, secondarySchools: 19, combinedSchools: 10, totalCapacity: 21400, enrolled: 20420, color: "oklch(0.72 0.14 220)", gradient: "from-sky-400 to-blue-500" },
  { id: "kavango-west", name: "Kavango West", capital: "Nkurenkuru", totalSchools: 55, governmentSchools: 50, privateSchools: 5, primarySchools: 32, secondarySchools: 15, combinedSchools: 8, totalCapacity: 16800, enrolled: 16040, color: "oklch(0.72 0.14 200)", gradient: "from-cyan-400 to-sky-500" },
  { id: "khomas", name: "Khomas", capital: "Windhoek", totalSchools: 112, governmentSchools: 78, privateSchools: 34, primarySchools: 58, secondarySchools: 34, combinedSchools: 20, totalCapacity: 42800, enrolled: 40590, color: "oklch(0.68 0.2 25)", gradient: "from-rose-400 to-red-500" },
  { id: "kunene", name: "Kunene", capital: "Opuwo", totalSchools: 48, governmentSchools: 44, privateSchools: 4, primarySchools: 28, secondarySchools: 12, combinedSchools: 8, totalCapacity: 13200, enrolled: 12580, color: "oklch(0.82 0.15 90)", gradient: "from-yellow-400 to-amber-500" },
  { id: "ohangwena", name: "Ohangwena", capital: "Eenhana", totalSchools: 59, governmentSchools: 55, privateSchools: 4, primarySchools: 34, secondarySchools: 15, combinedSchools: 10, totalCapacity: 19100, enrolled: 18230, color: "oklch(0.68 0.17 300)", gradient: "from-purple-400 to-fuchsia-500" },
  { id: "omaheke", name: "Omaheke", capital: "Gobabis", totalSchools: 52, governmentSchools: 46, privateSchools: 6, primarySchools: 30, secondarySchools: 12, combinedSchools: 10, totalCapacity: 14800, enrolled: 14000, color: "oklch(0.75 0.15 40)", gradient: "from-orange-400 to-red-500" },
  { id: "omusati", name: "Omusati", capital: "Outapi", totalSchools: 68, governmentSchools: 63, privateSchools: 5, primarySchools: 38, secondarySchools: 18, combinedSchools: 12, totalCapacity: 21800, enrolled: 20720, color: "oklch(0.68 0.18 340)", gradient: "from-pink-400 to-rose-500" },
  { id: "oshana", name: "Oshana", capital: "Oshakati", totalSchools: 71, governmentSchools: 61, privateSchools: 10, primarySchools: 40, secondarySchools: 19, combinedSchools: 12, totalCapacity: 22400, enrolled: 21230, color: "oklch(0.72 0.15 180)", gradient: "from-teal-400 to-cyan-500" },
  { id: "oshikoto", name: "Oshikoto", capital: "Omuthiya", totalSchools: 63, governmentSchools: 58, privateSchools: 5, primarySchools: 36, secondarySchools: 17, combinedSchools: 10, totalCapacity: 19800, enrolled: 18820, color: "oklch(0.72 0.14 240)", gradient: "from-blue-400 to-indigo-500" },
  { id: "otjozondjupa", name: "Otjozondjupa", capital: "Otjiwarongo", totalSchools: 66, governmentSchools: 57, privateSchools: 9, primarySchools: 36, secondarySchools: 18, combinedSchools: 12, totalCapacity: 20200, enrolled: 19180, color: "oklch(0.68 0.17 20)", gradient: "from-red-400 to-orange-500" },
  { id: "zambezi", name: "Zambezi", capital: "Katima Mulilo", totalSchools: 46, governmentSchools: 42, privateSchools: 4, primarySchools: 26, secondarySchools: 12, combinedSchools: 8, totalCapacity: 13600, enrolled: 12920, color: "oklch(0.72 0.16 140)", gradient: "from-green-400 to-emerald-500" },
];

const GRADE_LIST = ["Pre-Primary","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6","Grade 7","Grade 8","Grade 9","Grade 10","Grade 11","Grade 12"];

function mkGrades(seed: number, base: number): GradeAvailability[] {
  return GRADE_LIST.map((g, i) => {
    const capacity = base + ((seed * (i + 3)) % 40) - 10;
    const occRate = 0.4 + (((seed * 13 + i * 7) % 60) / 100);
    const enrolled = Math.min(capacity, Math.round(capacity * occRate));
    const classes = Math.max(1, Math.round(capacity / 30));
    const senior = i >= 9;
    const fields = senior ? SENIOR_FIELDS : i >= 8 ? JUNIOR_FIELDS : PRIMARY_FIELDS;
    const classList: ClassGroup[] = Array.from({ length: classes }, (_, c) => {
      const cap = Math.round(capacity / classes);
      const enr = Math.min(cap, Math.round(enrolled / classes) + ((seed + c) % 3) - 1);
      return {
        id: `${g}-${c}`,
        name: `${g.replace("Grade ", "")}${String.fromCharCode(65 + c)}`,
        capacity: cap,
        enrolled: Math.max(0, enr),
        field: fields[(seed + c + i) % fields.length],
        teacher: TEACHERS[(seed + c) % TEACHERS.length],
      };
    });
    return { grade: g, capacity, enrolled, classes, classList };
  });
}

const PRIMARY_FIELDS = ["General Education", "Literacy & Numeracy", "Environmental Studies", "Arts & Culture"];
const JUNIOR_FIELDS = ["General Education", "Pre-Science", "Pre-Commerce", "Technical Skills"];
const SENIOR_FIELDS = ["Natural Sciences", "Commerce & Accounting", "Humanities & Arts", "Technical & Vocational", "Computer Studies"];
const TEACHERS = ["Ms. H. Nangolo", "Mr. P. Haufiku", "Mrs. L. Shikongo", "Mr. D. Uirab", "Ms. R. Katjivena", "Mr. S. Mwilima"];

const SCHOOL_NAMES: Record<string, string[]> = {
  erongo: ["Swakopmund Primary School","Walvis Bay Private School","Namib High School","Coastal Secondary","Erongo Combined","Henties Bay Primary","Arandis Secondary","Uis Combined School"],
  khomas: ["Windhoek High School","Windhoek Gymnasium","Delta Secondary School","Jan Möhr Secondary","Concordia College","Academia Secondary","Emma Hoogenhout Primary","St Paul's College"],
  hardap: ["Mariental High School","Rehoboth Combined","Hage Geingob Secondary","Hardap Primary","Kalahari Secondary"],
  karas: ["Keetmanshoop Secondary","Lüderitz High","P.K. de Villiers Secondary","Karasburg Combined","Aus Primary"],
  "kavango-east": ["Rundu Senior Secondary","Divundu Combined","Nkarapamwe Secondary","Kaisosi Primary"],
  "kavango-west": ["Nkurenkuru Secondary","Musese Combined","Kahenge Primary"],
  kunene: ["Opuwo Combined","Khorixas Secondary","Outjo Primary"],
  ohangwena: ["Eenhana Secondary","Ohangwena Combined","Onamutai Primary","Oshikango Secondary"],
  omaheke: ["Gobabis Gymnasium","Epukiro Combined","Otjinene Secondary"],
  omusati: ["Outapi Combined","Oshikuku Roman Catholic","Okahao Secondary"],
  oshana: ["Oshakati Secondary","Ongwediva Combined","Ponhofi Senior Secondary","Mweshipandeka Secondary"],
  oshikoto: ["Omuthiya Combined","Tsumeb Secondary","Onayena Combined"],
  otjozondjupa: ["Otjiwarongo Secondary","Grootfontein Gymnasium","Okahandja Primary","Paresis Secondary"],
  zambezi: ["Katima Mulilo Secondary","Caprivi Senior Secondary","Sangwali Combined"],
};

const FACILITIES = ["Science Labs","Computer Lab","Library","Sports Field","Auditorium","Cafeteria","Hostel","Art Studio","Music Room","Swimming Pool","Basketball Court","Media Centre"];
const SUBJECTS = ["Mathematics","English","Afrikaans","Physical Science","Life Science","Geography","History","Accounting","Economics","Computer Studies","Life Skills","Visual Arts","Physical Education"];
const EXTRAS = ["Football","Netball","Rugby","Debate Club","Robotics","Chess","Choir","Athletics","Environmental Club","Drama"];

export const SCHOOLS: School[] = REGIONS.flatMap((region) => {
  const names = SCHOOL_NAMES[region.id] ?? [`${region.name} Primary`, `${region.name} Secondary`];
  return names.map((name, idx) => {
    const seed = region.name.length + idx * 11 + name.length;
    const isPrivate = name.toLowerCase().includes("private") || name.toLowerCase().includes("gymnasium") || name.toLowerCase().includes("college");
    const level: School["level"] = name.toLowerCase().includes("primary") ? "Primary" : name.toLowerCase().includes("secondary") || name.toLowerCase().includes("high") || name.toLowerCase().includes("senior") ? "Secondary" : "Combined";
    const boarding = seed % 3 === 0;
    return {
      id: `${region.id}-${idx}`,
      name,
      regionId: region.id,
      town: region.capital,
      type: isPrivate ? "Private" : "Government",
      level,
      boarding,
      language: seed % 2 === 0 ? "English" : "English / Afrikaans",
      principal: ["Ms. N. Shipanga","Mr. T. Amutenya","Dr. K. Nghikembua","Mrs. E. Iyambo","Mr. J. Kambonde"][seed % 5],
      email: `info@${name.toLowerCase().replace(/[^a-z]/g, "")}.edu.na`,
      phone: `+264 6${seed % 5} ${200 + (seed % 700)} ${1000 + (seed * 3) % 8999}`,
      website: `www.${name.toLowerCase().replace(/[^a-z]/g, "").slice(0, 18)}.edu.na`,
      address: `${(seed % 200) + 1} Independence Ave, ${region.capital}`,
      established: 1950 + (seed % 70),
      description: `${name} is a leading ${level.toLowerCase()} institution in the ${region.name} region, committed to nurturing well-rounded learners through academic excellence, character development, and community engagement.`,
      mission: "To empower every learner with the knowledge, skills, and confidence to thrive in a changing world.",
      vision: "A community of curious, resilient, and compassionate leaders shaping Namibia's future.",
      facilities: FACILITIES.filter((_, i) => (seed + i) % 3 !== 0).slice(0, 8),
      subjects: SUBJECTS.filter((_, i) => (seed + i) % 2 === 0).slice(0, 9),
      extracurricular: EXTRAS.filter((_, i) => (seed + i) % 2 === 0).slice(0, 6),
      grades: mkGrades(seed, level === "Primary" ? 220 : level === "Secondary" ? 180 : 200),
    };
  });
});

export const NOTIFICATIONS = [
  { id: "1", title: "New spaces available", body: "Swakopmund Primary opened 12 new Grade 3 spaces.", time: "2m ago", type: "availability" as const, unread: true },
  { id: "2", title: "Application deadline", body: "Windhoek High School applications close Friday.", time: "1h ago", type: "reminder" as const, unread: true },
  { id: "3", title: "Ministry announcement", body: "2026 admissions calendar published nationwide.", time: "Yesterday", type: "announcement" as const, unread: false },
  { id: "4", title: "Placement update", body: "Rundu Senior Secondary now accepting Grade 8.", time: "2d ago", type: "availability" as const, unread: false },
  { id: "5", title: "Application reminder", body: "Complete your saved application at Windhoek Gymnasium.", time: "3d ago", type: "reminder" as const, unread: false },
];

export const ANNOUNCEMENTS = [
  { id: "a1", title: "2026 admissions officially open", body: "Applications for the 2026 academic year are now live for all public schools.", tag: "Ministry" },
  { id: "a2", title: "Digital placement rolls out nationally", body: "EduLink is now the official placement platform across all 14 regions.", tag: "Update" },
  { id: "a3", title: "Extra Grade 8 capacity added", body: "Over 3,400 new Grade 8 spaces released across Khomas and Erongo.", tag: "Availability" },
];

export function getRegion(id: string) {
  return REGIONS.find((r) => r.id === id);
}
export function getSchool(id: string) {
  return SCHOOLS.find((s) => s.id === id);
}
export function schoolsByRegion(id: string) {
  return SCHOOLS.filter((s) => s.regionId === id);
}

export function schoolStats(s: School) {
  const capacity = s.grades.reduce((a, g) => a + g.capacity, 0);
  const enrolled = s.grades.reduce((a, g) => a + g.enrolled, 0);
  return { capacity, enrolled, available: capacity - enrolled, occupancy: Math.round((enrolled / capacity) * 100) };
}
