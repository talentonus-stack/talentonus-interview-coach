'use client'

import { useState } from 'react'
import { saveAnswer, completeInterview } from '../../chat-actions'

export default function ChatClient({
  interviewId,
  questions,
}: {
  interviewId: string
  questions: string[]
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1

  const handleNext = async () => {
    if (!answer.trim()) {
      setError('Please provide an answer before continuing.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await saveAnswer(interviewId, currentQuestion, answer)

      if (isLastQuestion) {
        await completeInterview(interviewId)
      } else {
        setAnswer('')
        setCurrentIndex((prev) => prev + 1)
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'NEXT_REDIRECT') {
        throw err
      }
      setError('Failed to save your answer. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="mb-6">
        <span className="text-sm font-medium text-blue-600 mb-2 block">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <h2 className="text-2xl font-bold text-gray-900">
          {currentQuestion}
        </h2>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="answer" className="sr-only">Your Answer</label>
        <textarea
          id="answer"
          rows={8}
          className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
          placeholder="Type your detailed answer here..."
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value)
            if (error) setError(null)
          }}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={isSubmitting}
          className={`font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out ${
            isSubmitting
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSubmitting
            ? 'Saving...'
            : isLastQuestion
            ? 'Finish Interview'
            : 'Next Question'}
        </button>
      </div>
    </div>
  )
}
