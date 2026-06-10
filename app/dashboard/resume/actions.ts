'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { mockParseResume, analyzeParsedResume } from './resumeParser'

export async function uploadResume(formData: FormData) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  const resumeFile = formData.get('resume') as File
  if (!resumeFile || resumeFile.size === 0) {
    redirect('/dashboard/resume')
  }

  try {
    const fileExt = resumeFile.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    // 1. Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, resumeFile)

    if (uploadError) throw uploadError

    // 2. Mock AI Parsing
    const parsedData = mockParseResume()
    const analysis = analyzeParsedResume(parsedData)

    // 3. Upsert into candidate_resumes
    const { error: dbError } = await supabase
      .from('candidate_resumes')
      .upsert({
        user_id: user.id,
        resume_url: filePath,
        parsed_data: parsedData,
        resume_score: analysis.score,
        candidate_type: analysis.candidate_type
      }, { onConflict: 'user_id' })

    if (dbError) throw dbError
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') throw error
    console.error('Failed to process resume:', error)
    // Silently log for now instead of returning an object to satisfy form action typings
  }

  redirect('/dashboard/resume')
}

export async function deleteResume() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  try {
    // We optionally delete the file from storage first, but for now we just delete the db record
    // RLS prevents us from deleting other users' files
    const { data: record } = await supabase.from('candidate_resumes').select('resume_url').eq('user_id', user.id).single()

    if (record?.resume_url) {
      await supabase.storage.from('resumes').remove([record.resume_url])
    }

    await supabase.from('candidate_resumes').delete().eq('user_id', user.id)
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') throw error
    console.error('Failed to delete resume', error)
  }

  redirect('/dashboard/resume')
}
