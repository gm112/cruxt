export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return body as Record<string, unknown> | undefined
})
