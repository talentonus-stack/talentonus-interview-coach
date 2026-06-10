'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { submitConversationalAnswer, completeInterview } from '../../chat-actions'

interface Message {
  role: 'interviewer' | 'candidate'
  content: string
}

export default function ChatClient({
  interviewId,
  initialHistory,
  initialNextQuestion,
  totalQuestions
}: {
  interviewId: string
  initialHistory: Message[]
  initialNextQuestion: string
  totalQuestions: number
}) {
  const [history, setHistory] = useState<Message[]>(initialHistory)
  const [currentQuestion, setCurrentQuestion] = useState(initialNextQuestion)
  const [answer, setAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Current iteration: history length represents previous Q&A pairs (each pair = 2 messages).
  // So questions answered = history.length / 2
  const questionsAnswered = history.length / 2
  const isLastQuestion = questionsAnswered >= totalQuestions - 1

  useEffect(() => {
    // Scroll to bottom when history changes
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, currentQuestion])

  const handleNext = async () => {
    if (!answer.trim()) {
      setError('Please provide an answer before continuing.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    // Optimistically add to UI
    const updatedHistory: Message[] = [
      ...history,
      { role: 'interviewer', content: currentQuestion },
      { role: 'candidate', content: answer }
    ]
    setHistory(updatedHistory)
    const savedAnswer = answer
    setAnswer('') // Clear input

    try {
      const response = await submitConversationalAnswer(interviewId, currentQuestion, savedAnswer)

      if (response && response.error) {
        setError(`Failed to save your answer: ${response.error}`)
        // Revert optimistic UI
        setHistory(history)
        setAnswer(savedAnswer)
        return
      }

      if (response.isComplete || isLastQuestion) {
        const completeResponse = await completeInterview(interviewId)
        if (completeResponse && completeResponse.error) {
          setError(`Analysis failed: ${completeResponse.error}`)
          return
        }

        router.push(`/dashboard/interview/${interviewId}/summary`)
      } else if (response.nextQuestion) {
        setCurrentQuestion(response.nextQuestion)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.'
      setError(`An unexpected error occurred: ${errorMessage}`)
      // Revert optimistic UI
      setHistory(history)
      setAnswer(savedAnswer)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      {/* Scrollable Conversation History */}
      <div className="flex-1 overflow-y-auto bg-gray-50 rounded-t-lg p-6 border border-gray-200 shadow-inner">
        {history.map((msg, idx) => (
          <div key={idx} className={`mb-6 flex flex-col ${msg.role === 'candidate' ? 'items-end' : 'items-start'}`}>
            <span className="text-xs font-semibold text-gray-500 uppercase mb-1">
              {msg.role === 'interviewer' ? 'AI Recruiter' : 'You'}
            </span>
            <div className={`p-4 rounded-xl max-w-[85%] ${
              msg.role === 'candidate'
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* The Current Question Being Asked */}
        <div className="mb-6 flex flex-col items-start">
          <span className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center">
            AI Recruiter
            <span className="ml-2 bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full">
              Question {questionsAnswered + 1} of {totalQuestions}
            </span>
          </span>
          <div className="p-4 rounded-xl max-w-[85%] bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm">
            {currentQuestion}
          </div>
        </div>
        <div ref={chatEndRef} />
      </div>

      {/* Answer Input Area */}
      <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg p-6 shadow-sm">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="answer" className="sr-only">Your Answer</label>
          <textarea
            id="answer"
            rows={4}
            className="shadow-sm appearance-none border rounded-xl w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            placeholder="Type your detailed answer here..."
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value)
              if (error) setError(null)
            }}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {isLastQuestion ? 'This is the final question.' : 'Take your time to structure your response.'}
          </span>
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className={`font-bold py-3 px-8 rounded-xl focus:outline-none focus:shadow-outline transition duration-150 ease-in-out shadow-sm ${
              isSubmitting
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSubmitting
              ? 'Analyzing...'
              : isLastQuestion
              ? 'Finish & Submit'
              : 'Submit Answer'}
          </button>
        </div>
      </div>
    </div>
  )
}
