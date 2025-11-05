// import { PrismaClient } from '@prisma/client'
import { Integration, HttpMethod } from '../types/integration'
// import { IntegrationLog } from '../types/integration' // Commented out as IntegrationLog type is not available
import axios from 'axios'

// const prisma = new PrismaClient()

export async function executeIntegration(integration: Integration, event: string, data: any): Promise<any> {
  try {
    const { url, method, headers, auth } = integration.config
    if (!url || !method) {
      throw new Error('URL and method are required')
    }

    const authHeaders = getAuthHeaders(auth)
    const response = await axios({
      method: method.toLowerCase() as HttpMethod,
      url,
      headers: {
        ...headers,
        ...authHeaders,
        'Content-Type': 'application/json'
      },
      data
    })

    // TODO: Implement when integrationLog model is added to schema
    const log = {
      id: 'temp-log-id',
      integrationId: integration.id,
      event,
      status: 'success',
      requestData: data,
      responseData: response.data
    }

    return log
  } catch (error: any) {
    // TODO: Implement when integrationLog model is added to schema
    const log = {
      id: 'temp-log-id',
      integrationId: integration.id,
      event,
      status: 'error',
      requestData: data,
      error: error.message
    }

    throw error
  }
}

function getAuthHeaders(auth?: Integration['config']['auth']): Record<string, string> {
  if (!auth) return {}

  switch (auth.type) {
    case 'basic':
      if (!auth.username || !auth.password) {
        throw new Error('Username and password are required for basic auth')
      }
      const basicAuth = Buffer.from(`${auth.username}:${auth.password}`).toString('base64')
      return { Authorization: `Basic ${basicAuth}` }

    case 'bearer':
      if (!auth.token) {
        throw new Error('Token is required for bearer auth')
      }
      return { Authorization: `Bearer ${auth.token}` }

    case 'api-key':
      if (!auth.apiKey) {
        throw new Error('API key is required for API key auth')
      }
      return { 'X-API-Key': auth.apiKey }

    default:
      return {}
  }
}

export async function createIntegration(data: Omit<Integration, 'id' | 'createdAt' | 'updatedAt'>): Promise<Integration> {
  // TODO: Implement when integration model is added to schema
  return {
    id: 'temp-integration-id',
    name: data.name,
    type: data.type,
    description: data.description,
    config: data.config,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

export async function getIntegration(id: string): Promise<Integration | null> {
  // TODO: Implement when integration model is added to schema
  return null
}

export async function updateIntegration(id: string, data: Partial<Integration>): Promise<Integration> {
  // TODO: Implement when integration model is added to schema
  return {
    id,
    name: data.name || 'temp-name',
    type: data.type || 'WEBHOOK',
    description: data.description || '',
    config: data.config || {
      url: '',
      method: 'POST',
      headers: {},
      auth: { type: 'basic' },
      events: [],
      isActive: false
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

export async function deleteIntegration(id: string): Promise<void> {
  // TODO: Implement when integration model is added to schema
  // await prisma.integration.delete({
  //   where: { id }
  // })
}

export async function getIntegrationLogs(integrationId: string): Promise<any[]> {
  // TODO: Implement when integrationLog model is added to schema
  return []
} 