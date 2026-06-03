'use client'

import { useState, useMemo } from 'react'
import { INDUSTRIES, DEPARTMENTS_BY_INDUSTRY, SKILLS_BY_DEPARTMENT } from './constants'

export default function SetupForm({
  action,
}: {
  action: (payload: FormData) => void
}) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const availableDepartments = useMemo(() => {
    return selectedIndustry ? DEPARTMENTS_BY_INDUSTRY[selectedIndustry] || [] : []
  }, [selectedIndustry])

  const availableSkills = useMemo(() => {
    return selectedDepartment ? SKILLS_BY_DEPARTMENT[selectedDepartment] || [] : []
  }, [selectedDepartment])

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedIndustry(e.target.value)
    setSelectedDepartment('')
    setSelectedSkills([])
  }

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(e.target.value)
    setSelectedSkills([])
  }

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    // The actual submission will continue natively, we just need to set the loading state
    // and ensure the skills are attached to the form
  }

  return (
    <form action={action} onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="industry">
            Industry
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            id="industry"
            name="industry"
            value={selectedIndustry}
            onChange={handleIndustryChange}
            required
          >
            <option value="" disabled>Select industry...</option>
            {INDUSTRIES.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
            Department
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100"
            id="department"
            name="department"
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            required
            disabled={!selectedIndustry || availableDepartments.length === 0}
          >
            <option value="" disabled>Select department...</option>
            {availableDepartments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jobTitle">
          Job Title
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          id="jobTitle"
          name="jobTitle"
          type="text"
          placeholder="e.g. Frontend Developer"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="experienceLevel">
            Experience Level
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            id="experienceLevel"
            name="experienceLevel"
            defaultValue=""
            required
          >
            <option value="" disabled>Select experience level...</option>
            <option value="Fresher">Fresher</option>
            <option value="1-3 Years">1-3 Years</option>
            <option value="3-5 Years">3-5 Years</option>
            <option value="5+ Years">5+ Years</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="interviewType">
            Interview Type
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            id="interviewType"
            name="interviewType"
            defaultValue=""
            required
          >
            <option value="" disabled>Select interview type...</option>
            <option value="HR">HR</option>
            <option value="Technical">Technical</option>
            <option value="Managerial">Managerial</option>
          </select>
        </div>
      </div>

      {selectedDepartment && availableSkills.length > 0 && (
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Skills
          </label>
          <div className="flex flex-wrap gap-2">
            {availableSkills.map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedSkills.includes(skill)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
          <input type="hidden" name="skills" value={JSON.stringify(selectedSkills)} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="difficultyLevel">
            Difficulty Level
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            id="difficultyLevel"
            name="difficultyLevel"
            defaultValue="Medium"
            required
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="questionCount">
            Number of Questions
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            id="questionCount"
            name="questionCount"
            defaultValue="10"
            required
          >
            <option value="10">10 Questions</option>
            <option value="20">20 Questions</option>
            <option value="50">50 Questions</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="durationMinutes">
            Interview Duration
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            id="durationMinutes"
            name="durationMinutes"
            defaultValue="30"
            required
          >
            <option value="10">10 Minutes</option>
            <option value="20">20 Minutes</option>
            <option value="30">30 Minutes</option>
            <option value="60">60 Minutes</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="resume">
          Resume Upload (Optional)
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          id="resume"
          name="resume"
          type="file"
          accept=".pdf,.docx"
        />
        <p className="text-xs text-gray-500 mt-1">Accepts PDF and DOCX files.</p>
      </div>

      <div className="flex items-center justify-end mt-8">
        <button
          type="submit"
          disabled={isSubmitting || (availableSkills.length > 0 && selectedSkills.length === 0)}
          className={`font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out w-full sm:w-auto ${
            isSubmitting || (availableSkills.length > 0 && selectedSkills.length === 0)
              ? 'bg-blue-400 cursor-not-allowed text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSubmitting ? 'Starting...' : 'Start Interview'}
        </button>
      </div>
      {availableSkills.length > 0 && selectedSkills.length === 0 && !isSubmitting && (
        <p className="text-red-500 text-sm text-right mt-2">Please select at least one skill from the available options.</p>
      )}
    </form>
  )
}
