export function generateInterviewQuestions(params: {
  industry: string
  department: string
  skills: string[]
  jobTitle: string
  interviewType: string
  questionCount: number
  candidateType?: string
  extractedData?: {
    name?: string[]
    job_titles?: string[]
    technologies?: string[]
    education?: string[]
    skills?: string[]
    certifications?: string[]
    projects?: string[]
    experience?: string[]
  }
}): string[] {
  const {
    industry,
    department,
    skills,
    jobTitle,
    interviewType,
    questionCount,
    candidateType = 'Experienced',
    extractedData
  } = params

  const questions: string[] = []

  // Base pool of generic HR/Behavioral/Managerial questions
  const hrQuestions = [
    `Tell me about a time you handled a difficult situation as a ${jobTitle}.`,
    "Why are you interested in this specific role and our company?",
    "Where do you see your career progressing in the next 3 to 5 years?",
    "Describe your greatest professional achievement.",
    "How do you handle working under tight deadlines or high pressure?"
  ]

  const managerialQuestions = [
    "Describe your leadership style and how it has evolved.",
    `How would you build and motivate a new team of ${jobTitle}s?`,
    "Tell me about a project that failed under your management and what you learned.",
    "How do you resolve conflicts between team members?",
    "Explain how you align your team's goals with the broader company objectives."
  ]

  const technicalQuestions = [
    `What are the most important technical considerations for a ${jobTitle}?`,
    "Describe a complex technical problem you solved recently.",
    "How do you stay updated with the latest technologies in your field?",
    "Explain a time when you had to learn a new tool quickly to complete a task.",
    "What is your approach to testing and ensuring code/work quality?"
  ]

  const salesQuestions = [
    "Describe your approach to generating and qualifying new leads.",
    "Tell me about the toughest sale you ever made.",
    "How do you handle a prospect who tells you 'no' multiple times?",
    "What is your process for maintaining relationships with existing clients?",
    "How do you prioritize your time between hunting for new business and closing active deals?"
  ]

  // Decide on the primary pool based on interview type
  let primaryPool: string[] = []

  if (interviewType.includes('HR') || interviewType.includes('Behavioral')) {
    primaryPool = hrQuestions
  } else if (interviewType.includes('Managerial') || interviewType.includes('Leadership')) {
    primaryPool = managerialQuestions
  } else if (department === 'Sales & Marketing' || interviewType.includes('Sales')) {
    primaryPool = salesQuestions
  } else {
    primaryPool = technicalQuestions
  }

  const allSkills = Array.from(new Set([...skills, ...(extractedData?.skills || []), ...(extractedData?.technologies || [])]))

  // Calculate distribution targets based on Candidate Type 40/20/20/20 Rule
  const expTarget = Math.max(1, Math.round(questionCount * 0.4))
  const projTarget = Math.max(1, Math.round(questionCount * 0.2))
  const skillTarget = Math.max(1, Math.round(questionCount * 0.2))
  // Behavioral fills the remainder

  let generatedExp = 0
  let generatedProj = 0
  let generatedSkill = 0

  // 1. Opening Question (Counts towards Experience/Academic)
  if (candidateType === 'Fresher') {
    questions.push(`Could you start by telling me about your academic background and why you are interested in starting your career as a ${jobTitle}?`)
    generatedExp++
  } else {
    questions.push(`Could you start by walking me through your recent experience as a ${jobTitle}?`)
    generatedExp++
  }

  // 2. Experience / Academic Questions (40%)
  if (extractedData) {
    if (candidateType === 'Fresher' && extractedData.education && extractedData.education.length > 0) {
      while (generatedExp < expTarget) {
        questions.push(`I see you studied ${extractedData.education[0]}. How has your coursework prepared you for the ${department} department in the ${industry} industry?`)
        generatedExp++
      }
    }

    if (candidateType === 'Experienced' && extractedData.experience && extractedData.experience.length > 0) {
      const expList = extractedData.experience
      while (generatedExp < expTarget) {
        questions.push(`You mentioned your experience at ${expList[generatedExp % expList.length]}. Can you elaborate on your primary responsibilities and achievements there?`)
        generatedExp++
      }
    }
  }

  // Fill remaining Experience quota if resume data is missing
  while (generatedExp < expTarget) {
    questions.push(candidateType === 'Fresher'
      ? `What was the most challenging academic assignment you've completed related to ${department}?`
      : `Describe a time in your past experience when you had to adapt quickly to a major change in a ${department} role.`)
    generatedExp++
  }

  // 3. Project Questions (20%)
  if (extractedData && extractedData.projects && extractedData.projects.length > 0) {
    const projList = extractedData.projects
    while (generatedProj < projTarget) {
      questions.push(`Your resume mentions the project: "${projList[generatedProj % projList.length]}". Can you explain your specific role and the challenges you overcame?`)
      generatedProj++
    }
  }

  // Fill remaining Project quota
  while (generatedProj < projTarget) {
    questions.push(candidateType === 'Fresher'
      ? `Explain a final year or academic project you are most proud of.`
      : `Walk me through a complex project you recently delivered. What was the outcome?`)
    generatedProj++
  }

  // 4. Skill Questions (20%)
  if (allSkills.length > 0) {
    while (generatedSkill < skillTarget) {
      const skill = allSkills[generatedSkill % allSkills.length]
      questions.push(candidateType === 'Fresher'
        ? `Can you explain your theoretical understanding or academic experience working with ${skill}?`
        : `Can you provide a concrete example of a complex problem you solved using ${skill}?`)
      generatedSkill++
    }
  }

  // Fill remaining Skill quota
  while (generatedSkill < skillTarget) {
    questions.push(`What core skills do you believe are most critical for a ${jobTitle} in the ${industry} industry?`)
    generatedSkill++
  }

  // 5. Behavioral / Managerial / Primary Pool Questions (20% - Remainder)
  let poolIndex = 0
  while (questions.length < questionCount) {
    const baseQuestion = primaryPool[poolIndex % primaryPool.length]
    if (!questions.includes(baseQuestion)) {
      questions.push(baseQuestion)
    } else {
      questions.push(`Follow up: ${baseQuestion} (Could you provide a different example?)`)
    }
    poolIndex++
  }

  // Return exactly the requested number of questions
  return questions.slice(0, questionCount)
}
