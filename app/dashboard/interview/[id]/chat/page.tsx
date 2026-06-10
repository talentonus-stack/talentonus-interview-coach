import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import ChatClient from './ChatClient'
import { generateDynamicFollowUp, InterviewContext } from '../../utils/dynamicQuestionGenerator'

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

  // Fetch previous answers to construct conversation history
  const { data: previousAnswers } = await supabase
    .from('interview_answers')
    .select('question, answer')
    .eq('interview_id', interview.id)
    .order('created_at', { ascending: true })

  const conversationHistory: { role: 'interviewer' | 'candidate', content: string }[] = []
  const previousQA: { question: string; answer: string }[] = []

  if (previousAnswers) {
    previousAnswers.forEach(ans => {
      conversationHistory.push({ role: 'interviewer', content: ans.question })
      conversationHistory.push({ role: 'candidate', content: ans.answer })
      previousQA.push({ question: ans.question, answer: ans.answer })
    })
  }

  // Generate the next dynamic question based on history
  const context: InterviewContext = {
    industry: interview.industry,
    department: interview.department,
    skills: interview.skills || [],
    jobTitle: interview.job_title,
    interviewType: interview.interview_type,
    questionCount: interview.question_count,
    candidateType: interview.candidate_type,
    extractedData: interview.extracted_data
  }

  const nextQuestion = generateDynamicFollowUp(context, previousQA, previousQA.length)

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
        <ChatClient
          interviewId={interview.id}
          initialHistory={conversationHistory}
          initialNextQuestion={nextQuestion}
          totalQuestions={interview.question_count}
        />
      </main>
    </div>
  )
}
