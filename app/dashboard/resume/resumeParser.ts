export interface ParsedResumeData {
  personal_information: {
    full_name: string;
    email: string;
    phone_number: string;
    location: string;
  };
  professional_information: {
    current_designation: string;
    total_experience_years: number;
    current_company: string;
    previous_companies: string[];
  };
  education: {
    degree: string;
    university: string;
    graduation_year: string;
  }[];
  skills: {
    technical: string[];
    functional: string[];
    soft: string[];
  };
  projects: {
    name: string;
    technologies: string[];
    description: string;
  }[];
  certifications: string[];
}

export interface ResumeAnalysis {
  score: number;
  strengths: string[];
  missing_information: string[];
  missing_skills: string[];
  improvement_suggestions: string[];
  candidate_type: 'Fresher' | 'Experienced';
}

export function mockParseResume(): ParsedResumeData {
  // In a production app, this would use a service like Affinda or an LLM to parse the PDF/DOCX text.
  // We mock extraction based on standard templates.
  const isExperienced = Math.random() > 0.3; // 70% chance of being experienced

  if (isExperienced) {
    return {
      personal_information: {
        full_name: "Alex Doe",
        email: "alex.doe@example.com",
        phone_number: "+1 555-0192",
        location: "San Francisco, CA"
      },
      professional_information: {
        current_designation: "Senior Software Engineer",
        total_experience_years: 5,
        current_company: "Tech Corp",
        previous_companies: ["Startup Inc", "Web Solutions"]
      },
      education: [
        {
          degree: "B.Sc. in Computer Science",
          university: "State University",
          graduation_year: "2018"
        }
      ],
      skills: {
        technical: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
        functional: ["System Architecture", "Agile Methodologies"],
        soft: ["Team Leadership", "Communication"]
      },
      projects: [
        {
          name: "E-Commerce Re-platforming",
          technologies: ["React", "Node.js", "AWS"],
          description: "Led the migration of a legacy monolithic e-commerce application to a microservices architecture."
        }
      ],
      certifications: ["AWS Certified Solutions Architect"]
    }
  } else {
    return {
      personal_information: {
        full_name: "Jordan Smith",
        email: "jordan.s@example.com",
        phone_number: "+1 555-9012",
        location: "Austin, TX"
      },
      professional_information: {
        current_designation: "Recent Graduate",
        total_experience_years: 0,
        current_company: "",
        previous_companies: []
      },
      education: [
        {
          degree: "B.S. Software Engineering",
          university: "Tech University",
          graduation_year: "2023"
        }
      ],
      skills: {
        technical: ["Python", "Java", "SQL"],
        functional: ["Data Analysis"],
        soft: ["Problem Solving", "Adaptability"]
      },
      projects: [
        {
          name: "University Library Management System",
          technologies: ["Java", "SQL"],
          description: "Built a desktop application to manage book checkouts and inventory."
        }
      ],
      certifications: []
    }
  }
}

export function analyzeParsedResume(data: ParsedResumeData): ResumeAnalysis {
  let score = 100;
  const strengths: string[] = [];
  const missing_information: string[] = [];
  const missing_skills: string[] = [];
  const improvement_suggestions: string[] = [];

  const candidate_type = data.professional_information.total_experience_years > 0 ? 'Experienced' : 'Fresher';

  // Basic checks
  if (data.skills.technical.length > 3) {
    strengths.push("Good Technical Skills");
  } else {
    score -= 10;
    missing_skills.push("More diverse technical stack");
  }

  if (data.education.length > 0) {
    strengths.push("Education Details Present");
  } else {
    score -= 15;
    missing_information.push("Education History");
  }

  if (data.projects.length > 0) {
    strengths.push("Project Experience Highlighted");
  } else {
    score -= 20;
    missing_information.push("Project Details");
    improvement_suggestions.push("Add detailed project descriptions to showcase practical application of your skills.");
  }

  if (candidate_type === 'Experienced') {
    if (data.professional_information.previous_companies.length > 0) {
      strengths.push("Clear Career Progression");
    }
    if (data.skills.soft.length === 0) {
      score -= 5;
      missing_skills.push("Leadership / Soft Skills");
    }
  } else {
    // Fresher specific checks
    if (data.certifications.length === 0) {
      score -= 5;
      missing_information.push("Certifications");
      improvement_suggestions.push("Consider adding online certifications to stand out as a recent graduate.");
    }
  }

  return {
    score: Math.max(0, score),
    strengths,
    missing_information,
    missing_skills,
    improvement_suggestions,
    candidate_type
  }
}
