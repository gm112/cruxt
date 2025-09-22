export default defineEventHandler(async (event) => {
  const { name } = await readBody(event) as { name?: string }

  return { id: 1, name }
})
