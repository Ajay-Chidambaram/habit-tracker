
import {
  Project,
  CreateProjectInput,
  UpdateProjectInput
} from '@/types'

const BASE_URL = '/api/projects'

export const api = {
  fetchProjects: async (): Promise<Project[]> => {
    const res = await fetch(BASE_URL)
    if (!res.ok) throw new Error('Failed to fetch projects')
    return res.json()
  },

  fetchProject: async (id: string): Promise<Project> => {
    const res = await fetch(`${BASE_URL}/${id}`)
    if (!res.ok) throw new Error('Failed to fetch project')
    return res.json()
  },

  createProject: async (data: CreateProjectInput): Promise<Project> => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create project')
    return res.json()
  },

  updateProject: async (id: string, data: UpdateProjectInput): Promise<Project> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update project')
    return res.json()
  },

  deleteProject: async (id: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete project')
  }
}
