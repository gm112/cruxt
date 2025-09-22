import type { error_response } from '#layers/@cruxt/base/shared/api/error-responses.js'

export default defineEventHandler(async (event) => {
  const { name } = await readBody(event) as { name?: string }
  if (!name) return { error_key: 'error.validation.required', cause: { name } } satisfies error_response

  return { id: 1, name }
})
