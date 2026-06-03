import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import ChatClient from './ChatClient'

const dummyTechnicalQuestions = [
  "What is PHP?",
  "Explain OOP concepts.",
  "What is a Session in PHP?",
  "Difference between GET and POST.",
  "Explain MVC architecture."
]

const dummyHRQuestions = [
  "Tell me about yourself.",
  "Why do you want to work here?",
  "Where do you see yourself in 5 years?",
  "What are your greatest strengths and weaknesses?",
  "Why should we hire you?"
]

const dummyManagerialQuestions = [
  "Describe a time you had to manage a conflict in your team.",
  "How do you prioritize multiple deadlines?",
  "Tell me about a project that failed and what you learned.",
  "How do you motivate a demotivated team member?",
  "Explain your leadership style."
]

export default async function InterviewChatPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const supabase = await createClient()

  // Verify authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Fetch interview details
  const { data: interview, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (error || !interview) {
    redirect('/dashboard')
  }

  // Ensure user owns this interview
  if (interview.user_id !== user.id) {
    redirect('/dashboard')
  }

  // Determine questions based on type
  let baseQuestions = dummyTechnicalQuestions
  if (interview.interview_type === 'HR Interview') baseQuestions = dummyHRQuestions
  if (interview.interview_type === 'Managerial Interview') baseQuestions = dummyManagerialQuestions

  // Generate the required number of questions by looping over the base questions
  const requiredCount = interview.question_count || 10
  const questions: string[] = []
  for (let i = 0; i < requiredCount; i++) {
    const questionText = baseQuestions[i % baseQuestions.length]
    // Add a differentiator to repeated questions for clarity in dummy data
    const suffix = i >= baseQuestions.length ? ` (Variation ${Math.floor(i / baseQuestions.length) + 1})` : ''
    questions.push(`${questionText}${suffix}`)
  }

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Interview Session: {interview.job_title}
        </h1>
        <p className="text-gray-600 mt-2">
          {interview.interview_type} • {interview.experience_level}
        </p>
      </header>

      <main className="flex-1">
        <ChatClient interviewId={interview.id} questions={questions} />
      </main>
    </div>
  )
}
