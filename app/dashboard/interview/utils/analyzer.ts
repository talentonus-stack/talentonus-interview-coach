export interface AnswerAnalysis {
  score: number
  feedback: string
  recommendedAnswer: string
  recruiterFeedback: string
}

export interface InterviewAnalysis {
  overallScore: number
  grade: string
  strengths: string[]
  improvementAreas: string[]
  recommendedLearning: string[]
  answersAnalysis: Record<string, AnswerAnalysis> // Keyed by question
}

function calculateGrade(score: number): string {
  if (score >= 90) return 'A+'
  if (score >= 80) return 'A'
  if (score >= 70) return 'B+'
  if (score >= 60) return 'B'
  return 'C'
}

export function analyzeInterview(
  jobTitle: string,
  skills: string[],
  qaPairs: { question: string; answer: string }[]
): InterviewAnalysis {
  // In a real application, this would call OpenAI or another LLM.
  // For now, we simulate an intelligent analysis based on word count and keywords.

  let totalScore = 0
  const answersAnalysis: Record<string, AnswerAnalysis> = {}

  qaPairs.forEach((qa) => {
    const wordCount = qa.answer.split(' ').length
    let score = 50 // Base score

    if (wordCount > 50) score += 20
    else if (wordCount > 20) score += 10

    // Check if they mentioned relevant skills
    const mentionedSkills = skills.filter(s => qa.answer.toLowerCase().includes(s.toLowerCase()))
    score += (mentionedSkills.length * 10)

    score = Math.min(score, 100) // Cap at 100
    totalScore += score

    answersAnalysis[qa.question] = {
      score,
      feedback: score >= 80
        ? "Excellent answer. You provided good detail and context."
        : score >= 60
        ? "Good attempt, but could benefit from more specific examples or technical depth."
        : "Your answer was too brief or lacked clear relevance to the core concepts.",
      recommendedAnswer: `A strong answer would directly address the core of "${qa.question}" by providing a structured response (e.g., STAR method), explicitly mentioning relevant tools like ${skills.join(', ')}, and giving a concrete example of your experience as a ${jobTitle}.`,
      recruiterFeedback: score >= 80
        ? "Strong communication skills and deep domain knowledge demonstrated. Recommend proceeding to the next round."
        : score >= 60
        ? "Acceptable baseline knowledge, but communication lacked structure. May need technical screening."
        : "Candidate failed to answer adequately. Major red flag for this technical requirement."
    }
  })

  const avgScore = qaPairs.length > 0 ? Math.round(totalScore / qaPairs.length) : 0

  // Generate generic strengths/weaknesses based on score
  const strengths = avgScore >= 70
    ? ["Clear communication", "Good foundational knowledge", "Structured thinking"]
    : ["Attempted to answer all questions"]

  const improvementAreas = avgScore < 80
    ? ["Provide more concrete examples", "Expand on technical depth", "Use the STAR method for behavioral questions"]
    : ["Refine advanced edge-case scenarios"]

  const recommendedLearning = skills.length > 0
    ? [`Advanced ${skills[0]} patterns`, `System design for ${jobTitle}`]
    : ["General interview preparation and communication skills"]

  // Skill-wise scoring based on mentions
  // (In a real implementation, NLP sentiment analysis would determine these strengths/improvements per skill)
  const allMentionedSkills = Array.from(new Set(
    skills.filter(s => qaPairs.some(qa => qa.answer.toLowerCase().includes(s.toLowerCase())))
  ))

  const dynamicStrengths = [...strengths]
  const dynamicImprovements = [...improvementAreas]

  if (allMentionedSkills.length > 0) {
    dynamicStrengths.push(`Demonstrated familiarity with ${allMentionedSkills.join(', ')}`)
  }

  const missedSkills = skills.filter(s => !allMentionedSkills.includes(s))
  if (missedSkills.length > 0) {
    dynamicImprovements.push(`Failed to mention or explain usage of ${missedSkills.join(', ')}`)
  }

  return {
    overallScore: avgScore,
    grade: calculateGrade(avgScore),
    strengths: dynamicStrengths,
    improvementAreas: dynamicImprovements,
    recommendedLearning,
    answersAnalysis
  }
}
