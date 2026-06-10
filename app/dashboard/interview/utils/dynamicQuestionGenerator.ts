export interface InterviewContext {
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
}

export function generateDynamicFollowUp(
  context: InterviewContext,
  previousQA: { question: string; answer: string }[],
  currentQuestionIndex: number
): string {
  const {
    industry,
    department,
    jobTitle,
    interviewType,
    candidateType = 'Experienced',
    extractedData
  } = context

  const allSkills = Array.from(new Set([...context.skills, ...(extractedData?.skills || []), ...(extractedData?.technologies || [])]))

  // 1. If it's the very first question, return the opening question
  if (previousQA.length === 0) {
    if (candidateType === 'Fresher') {
      return `Welcome! Could you start by telling me about your academic background and why you are interested in starting your career as a ${jobTitle}?`
    } else {
      return `Welcome! Could you start by walking me through your recent experience as a ${jobTitle}?`
    }
  }

  const lastAnswer = previousQA[previousQA.length - 1].answer.toLowerCase()

  // 2. Try to generate a contextual follow-up based on the *candidate's last answer*

  // Check for skill mentions
  const mentionedSkill = allSkills.find(skill => lastAnswer.includes(skill.toLowerCase()))
  if (mentionedSkill && Math.random() > 0.3) { // 70% chance to drill into a mentioned skill
    return `You mentioned using ${mentionedSkill}. Can you dive deeper into a specific challenge you faced with it and how you overcame it?`
  }

  // Check for leadership/management mentions
  if (
    (lastAnswer.includes('lead') || lastAnswer.includes('manage') || lastAnswer.includes('team'))
    && (interviewType.includes('Managerial') || candidateType === 'Experienced')
    && Math.random() > 0.5
  ) {
    return `It sounds like leadership played a role there. How did you ensure your team stayed motivated and aligned with the overall goals during that time?`
  }

  // Check for conflict/failure mentions
  if (lastAnswer.includes('fail') || lastAnswer.includes('conflict') || lastAnswer.includes('disagree') || lastAnswer.includes('hard')) {
    return `That sounds like a tough situation. Looking back, what is the biggest lesson you took away from that experience?`
  }

  // 3. If no direct hook is found, use the 40/20/20/20 rule to determine the *next category* of question based on progression
  const percentageComplete = currentQuestionIndex / context.questionCount

  if (percentageComplete < 0.4) {
    // Experience / Academic Phase
    if (candidateType === 'Fresher' && extractedData?.education && extractedData.education.length > 0) {
      return `Reflecting on your studies in ${extractedData.education[0]}, which course or project do you feel best prepared you for this ${department} role?`
    } else if (candidateType === 'Experienced' && extractedData?.experience && extractedData.experience.length > 0) {
      const exp = extractedData.experience[Math.floor(Math.random() * extractedData.experience.length)]
      return `During your time at ${exp}, what was the most impactful contribution you made to the company?`
    } else {
      return `Can you share an example of how you adapted to a major change or obstacle in a past ${candidateType === 'Fresher' ? 'academic' : 'professional'} setting?`
    }
  } else if (percentageComplete < 0.6) {
    // Projects Phase
    if (extractedData?.projects && extractedData.projects.length > 0) {
      const proj = extractedData.projects[Math.floor(Math.random() * extractedData.projects.length)]
      return `Your resume mentions the project: "${proj}". Walk me through your specific responsibilities and the outcome of that project.`
    } else {
      return `Tell me about a complex project you recently worked on from start to finish. What was your specific role?`
    }
  } else if (percentageComplete < 0.8) {
    // Skills Phase
    const fallbackSkill = allSkills.length > 0 ? allSkills[Math.floor(Math.random() * allSkills.length)] : department
    if (candidateType === 'Fresher') {
      return `How comfortable are you with ${fallbackSkill}, and how did you go about learning it?`
    } else {
      return `Can you walk me through an advanced implementation or complex problem you solved specifically using ${fallbackSkill}?`
    }
  } else {
    // Behavioral / Wrap-up Phase
    if (interviewType.includes('HR') || interviewType.includes('Behavioral')) {
      return `Where do you see your career progressing in the next few years within the ${industry} industry?`
    } else if (interviewType.includes('Managerial') || interviewType.includes('Leadership')) {
      return `How do you handle delivering negative feedback to a peer or direct report?`
    } else if (department === 'Sales & Marketing' || interviewType.includes('Sales')) {
      return `Tell me about the toughest prospect you ever faced. How did you handle the objections?`
    } else {
      return `What is your approach to staying updated with the rapid changes in the ${department} space?`
    }
  }
}
