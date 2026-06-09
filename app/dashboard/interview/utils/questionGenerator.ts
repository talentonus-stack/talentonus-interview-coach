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

  // 1. Always start with a relevant opening question based on candidate type
  if (candidateType === 'Fresher') {
    questions.push(`Could you start by telling me a bit about your academic background and why you are interested in starting your career as a ${jobTitle}?`)
  } else {
    questions.push(`Could you start by walking me through your recent experience as a ${jobTitle}?`)
  }

  // 2. Incorporate Extracted Resume Data (if available)
  if (extractedData) {
    if (candidateType === 'Fresher' && extractedData.education && extractedData.education.length > 0) {
      questions.push(`I see you studied ${extractedData.education[0]}. How has your coursework prepared you for the ${department} department in the ${industry} industry?`)
    }

    if (extractedData.projects && extractedData.projects.length > 0) {
      questions.push(`Your resume mentions the project: "${extractedData.projects[0]}". Can you explain your specific role and the challenges you overcame during this project?`)
    }

    if (candidateType === 'Experienced' && extractedData.experience && extractedData.experience.length > 0) {
      questions.push(`You mentioned your experience at ${extractedData.experience[0]}. What was your biggest achievement there?`)
      questions.push(`In your previous role, how did you handle a significant setback or failure?`)
    }
  }

  // 3. Generate Skill-based questions if skills are provided
  // Merge manually selected skills with extracted skills
  const allSkills = Array.from(new Set([...skills, ...(extractedData?.skills || [])]))

  if (allSkills.length > 0) {
    allSkills.slice(0, 5).forEach(skill => { // Limit to top 5 to avoid filling the whole interview with just skill questions
      if (candidateType === 'Fresher') {
        questions.push(`Can you explain your theoretical understanding or academic experience working with ${skill}?`)
      } else {
        questions.push(`Can you provide a concrete example of a complex problem you solved using ${skill}?`)
      }
    })
  }

  // 4. Generate situational/scenario questions tailored to the industry and department
  if (candidateType === 'Fresher') {
    questions.push(`As someone entering the ${industry} industry, what do you think is the biggest learning curve for a new ${jobTitle}?`)
  } else {
    questions.push(`In the ${industry} industry, particularly within ${department}, priorities can shift rapidly. Can you share an example of how you adapted to a major change?`)
  }

  if (interviewType === 'Problem Solving Interview') {
    questions.push(`Walk me through your framework for diagnosing and solving a critical issue in your current role.`)
    questions.push(`Describe a time when you had to make a decision without having all the necessary information.`)
  }

  if (interviewType === 'Client Facing Interview' || department === 'Customer Support') {
    questions.push(`How do you handle a situation where a client or customer is extremely dissatisfied with a deliverable?`)
  }

  // 5. Fill the rest of the array with questions from the primary pool and generated permutations
  let poolIndex = 0
  let generatedCounter = 0
  while (questions.length < questionCount) {
    // We alternate between primary pool questions and dynamically generated deep-dives
    if (poolIndex < primaryPool.length) {
      const baseQuestion = primaryPool[poolIndex]
      if (!questions.includes(baseQuestion)) {
        questions.push(baseQuestion)
      }
      poolIndex++
    } else {
      generatedCounter++
      const randomSkill = skills && skills.length > 0 ? skills[generatedCounter % skills.length] : department

      const dynamicPrompts = [
        `How would you mentor a junior team member struggling to learn ${randomSkill}?`,
        `Describe a scenario where your knowledge of ${randomSkill} saved a project from failure.`,
        `What do you consider the biggest limitation of ${randomSkill}, and how do you work around it?`,
        `If you had to design a new workflow for ${department}, how would you incorporate ${randomSkill}?`,
        `Tell me about a time you disagreed with a colleague regarding best practices for ${randomSkill}.`
      ]

      questions.push(dynamicPrompts[generatedCounter % dynamicPrompts.length])
    }
  }

  // Return exactly the requested number of questions (in case we overfilled)
  return questions.slice(0, questionCount)
}
