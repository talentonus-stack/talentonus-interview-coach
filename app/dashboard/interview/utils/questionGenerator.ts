export function generateInterviewQuestions(params: {
  industry: string
  department: string
  skills: string[]
  jobTitle: string
  interviewType: string
  questionCount: number
}): string[] {
  const { department, skills, jobTitle, interviewType, questionCount } = params
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

  // 1. Always start with a relevant opening question
  questions.push(`Could you start by telling me a bit about your experience as a ${jobTitle}?`)

  // 2. Generate Skill-based questions if skills are provided (Crucial for Technical)
  if (skills && skills.length > 0) {
    skills.forEach(skill => {
      questions.push(`Can you explain your experience and proficiency working with ${skill}?`)
      questions.push(`What are some common challenges you face when using ${skill}, and how do you overcome them?`)
    })
  }

  // 3. Fill the rest of the array with questions from the primary pool
  let poolIndex = 0
  while (questions.length < questionCount) {
    // If we run out of unique questions in the primary pool, we start repeating with a variation suffix
    const baseQuestion = primaryPool[poolIndex % primaryPool.length]
    const variationLevel = Math.floor(poolIndex / primaryPool.length)

    if (variationLevel === 0) {
      // Check if it's already in there to avoid exact exact duplicates if it was somehow added early
      if (!questions.includes(baseQuestion)) {
        questions.push(baseQuestion)
      }
    } else {
       questions.push(`Follow up: ${baseQuestion} (Can you provide another example?)`)
    }

    poolIndex++
  }

  // Return exactly the requested number of questions
  return questions.slice(0, questionCount)
}
