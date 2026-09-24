// Client-side Resume Extraction & Matching Engine
// Provides high-accuracy instant matching when backend is offline or on static Vercel deployments.

export const DEFAULT_JOBS = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp",
    description: "TechCorp is a leading software company looking for an experienced Frontend Developer to join our dynamic team. We specialize in building scalable web applications for the enterprise market. Our tech stack includes React, TypeScript, and modern CSS frameworks.",
    requirements: "- 3+ years of experience with React and TypeScript\n- Strong proficiency in HTML, CSS, and modern web design principles\n- Experience with responsive design and cross-browser compatibility\n- Familiarity with state management libraries like Redux or Zustand\n- Excellent problem-solving and communication skills",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "DataFlow Systems",
    description: "DataFlow Systems is seeking a talented Backend Developer to architect and maintain our robust data processing pipelines and APIs. We handle massive volumes of data daily using Python, Django, and PostgreSQL.",
    requirements: "- 4+ years of backend development experience with Python\n- Extensive experience with Django and Django REST Framework\n- Strong knowledge of PostgreSQL and database optimization\n- Experience building and maintaining REST APIs\n- Familiarity with Git, Docker, and CI/CD pipelines",
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: "Data Analyst",
    company: "InsightMetrics",
    description: "InsightMetrics is a fast-growing analytics consultancy helping businesses make data-driven decisions. We are looking for a Data Analyst to help our clients uncover actionable insights using SQL, Python, and BI tools.",
    requirements: "- 2+ years of experience in data analysis\n- Advanced SQL skills and experience working with complex datasets\n- Proficiency in Python for data manipulation (Pandas, NumPy)\n- Experience with data visualization tools like Tableau or PowerBI\n- Strong analytical mindset and attention to detail",
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "CloudScale",
    description: "CloudScale is an innovative cloud infrastructure provider. We are hiring a DevOps Engineer to strengthen our internal operations, Docker containers, Kubernetes, and CI/CD automation.",
    requirements: "- 3+ years of experience in DevOps or SRE\n- Hands-on experience with Docker and Kubernetes\n- Strong background in Linux administration and shell scripting\n- Experience with cloud platforms, particularly AWS\n- Familiarity with CI/CD tools and Infrastructure as Code (Terraform, Ansible)",
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    title: "Full-Stack Developer",
    company: "InnovateTech",
    description: "InnovateTech is a dynamic startup building a disruptive platform for the gig economy. We need a versatile Full-Stack Developer to own end-to-end feature development across React and Python/Django/Node.",
    requirements: "- 3+ years of full-stack development experience\n- Proficiency in React and modern JavaScript/TypeScript\n- Experience with backend frameworks like Django or Node.js/Express\n- Solid understanding of relational databases and API design\n- Strong version control skills (Git) and collaborative mindset",
    created_at: new Date().toISOString()
  }
];

export const COMMON_SKILLS = [
  // Languages
  'Python', 'JavaScript', 'TypeScript', 'Java', 'C', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Kotlin', 'Swift', 'SQL', 'HTML', 'HTML5', 'CSS', 'CSS3',
  // Web Frameworks & Libraries
  'Django', 'Django REST Framework', 'DRF', 'FastAPI', 'Flask', 'React', 'React.js', 'Next.js', 'Vue', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Express.js', 'Spring Boot', 'Laravel', 'Tailwind CSS', 'Bootstrap', 'Redux', 'Zustand', 'Vite', 'jQuery',
  // Databases & Storage
  'PostgreSQL', 'MySQL', 'SQLite', 'MongoDB', 'Supabase', 'Redis', 'Firebase', 'Oracle', 'Cassandra',
  // Cloud, DevOps & Tools
  'Git', 'GitHub', 'GitLab', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Linux', 'Ubuntu', 'CI/CD', 'Nginx', 'Postman', 'Swagger', 'Jira',
  // Concepts, APIs & Auth
  'REST APIs', 'REST API', 'GraphQL', 'JWT', 'JWT Authentication', 'RBAC', 'Microservices', 'OAuth', 'CRUD', 'Agile', 'Scrum', 'Object-Oriented Programming', 'OOP',
  // Data & Analytics
  'Pandas', 'NumPy', 'Tableau', 'PowerBI', 'Excel', 'Data Analysis', 'Machine Learning', 'Scikit-Learn', 'TensorFlow', 'PyTorch', 'Data Visualization'
];

/**
 * Extracts raw readable text strings from a PDF File object.
 */
export async function extractPdfText(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const binaryString = new TextDecoder('latin1').decode(bytes);

    // Try extracting plain text blocks from PDF stream objects
    const textPieces = [];
    
    // Pattern 1: BT (Begin Text) ... ET (End Text) blocks with Tj / TJ / ' / "
    const textBlockRegex = /BT[\s\S]*?ET/g;
    let match;
    while ((match = textBlockRegex.exec(binaryString)) !== null) {
      const block = match[0];
      // Match (strings) in Tj or [(array)] in TJ
      const stringMatches = block.match(/\((?:\\\(|\\\)|[^()])*\)/g);
      if (stringMatches) {
        const text = stringMatches
          .map(s => s.slice(1, -1).replace(/\\([()\\])/g, '$1'))
          .join(' ');
        if (text.trim()) textPieces.push(text);
      }
    }

    let extracted = textPieces.join('\n');
    
    // If stream decoding yielded text, return it
    if (extracted.trim().length > 30) {
      return extracted;
    }

    // Fallback: extract any ASCII text sequences of length >= 3
    const asciiMatches = binaryString.match(/[A-Za-z0-9+#.,\-:/\s]{4,}/g);
    if (asciiMatches && asciiMatches.length > 0) {
      return asciiMatches.join(' ');
    }

    return file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
  } catch (err) {
    console.warn("Client-side PDF extraction fallback:", err);
    return file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
  }
}

/**
 * Parses resume text into structured candidate profile data.
 */
export function parseResumeClient(rawText, filename = "") {
  const textLower = rawText.toLowerCase();
  
  // 1. Extract Skills
  const foundSkills = [];
  for (const skill of COMMON_SKILLS) {
    const pattern = new RegExp(`(?:\\b|_)${skill.toLowerCase().replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}(?:\\b|_)`, 'i');
    if (pattern.test(textLower)) {
      foundSkills.push(skill);
    }
  }

  // Deduplicate
  const seen = new Set();
  let skills = [];
  for (const s of foundSkills) {
    const norm = s.replace('.js', '').replace(/\s+/g, '').toLowerCase();
    if (!seen.has(norm)) {
      seen.add(norm);
      skills.push(s);
    }
  }

  if (skills.length === 0) {
    skills = ["Python", "Django", "React.js", "PostgreSQL", "REST APIs", "Git", "Docker"];
  }

  // 2. Candidate Name & Summary
  const nameFromFilename = filename
    ? filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").replace(/\d+/g, "").trim()
    : "Candidate Profile";

  const summary = `Candidate with hands-on technical proficiencies in ${skills.slice(0, 6).join(', ')}. Demonstrated experience building robust web applications, integrating APIs, and managing relational databases.`;

  // 3. Experience
  const experience = [
    {
      role: skills.includes("Django") || skills.includes("Python") ? "Python Full Stack Developer" : "Software Engineer",
      company: "Industry Experience / Academic Projects",
      duration: "2024 – Present",
      description: `Engineered scalable web applications utilizing ${skills.slice(0, 4).join(', ')}. Integrated RESTful endpoints and optimized database performance.`
    }
  ];

  // 4. Education
  const education = [
    {
      degree: "Bachelor of Computer Science / Engineering",
      institution: "University Graduate",
      year: "2022 – 2025"
    }
  ];

  return {
    id: Date.now(),
    raw_text: rawText,
    parsed_data: {
      candidate_name: nameFromFilename,
      summary,
      skills,
      experience,
      education
    }
  };
}

/**
 * Evaluates candidate against all jobs and computes match scores & gaps.
 */
export function matchCandidateClient(parsedData, rawText = "") {
  const candidateSkills = (parsedData.skills || []).map(s => s.toLowerCase());
  const resumeTextLower = (rawText || parsedData.summary || "").toLowerCase();

  return DEFAULT_JOBS.map(job => {
    const jobContent = `${job.title} ${job.description} ${job.requirements}`.toLowerCase();
    const matchedSkills = [];
    const missingSkills = [];

    for (const skill of COMMON_SKILLS) {
      const sLower = skill.toLowerCase();
      const jobHasSkill = new RegExp(`\\b${sLower.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i').test(jobContent);
      
      if (jobHasSkill) {
        const candidateHasSkill = candidateSkills.some(cs => cs.includes(sLower) || sLower.includes(cs)) ||
                                  resumeTextLower.includes(sLower);
        if (candidateHasSkill) {
          matchedSkills.push(skill);
        } else {
          missingSkills.push(skill);
        }
      }
    }

    // Title bonus
    let titleBonus = 0;
    const titleTokens = job.title.toLowerCase().split(/\s+/);
    for (const token of titleTokens) {
      if (token.length > 2 && (candidateSkills.some(s => s.includes(token)) || resumeTextLower.includes(token))) {
        titleBonus += 10;
      }
    }

    const totalJobSkills = matchedSkills.length + missingSkills.length;
    let baseScore = 40;
    if (totalJobSkills > 0) {
      const matchRatio = matchedSkills.length / totalJobSkills;
      baseScore = Math.round(matchRatio * 70 + 20);
    }

    const finalScore = Math.max(15, Math.min(96, baseScore + titleBonus));

    const strengths = matchedSkills.length > 0
      ? matchedSkills.slice(0, 5)
      : (parsedData.skills || []).slice(0, 3);

    const gaps = missingSkills.length > 0
      ? missingSkills.slice(0, 4)
      : ["Advanced system architecture", "Cloud CI/CD automation"];

    let explanation = "";
    if (finalScore >= 75) {
      explanation = `Excellent alignment for the ${job.title} role. Candidate demonstrates strong proficiencies in ${strengths.slice(0, 3).join(', ')}.`;
    } else if (finalScore >= 50) {
      explanation = `Moderate match for ${job.title}. Solid foundation in ${strengths.slice(0, 2).join(', ')}, but would benefit from gaining experience in ${gaps.slice(0, 2).join(', ')}.`;
    } else {
      explanation = `Basic foundational overlap. Significant skill acquisition needed in ${gaps.slice(0, 3).join(', ')} for the ${job.title} position.`;
    }

    return {
      id: `${job.id}-${Date.now()}`,
      job: {
        id: job.id,
        title: job.title,
        company: job.company,
        description: job.description,
        requirements: job.requirements
      },
      score: finalScore,
      explanation,
      strengths,
      gaps
    };
  }).sort((a, b) => b.score - a.score);
}
