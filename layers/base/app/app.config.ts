export default defineAppConfig({
  myLayer: {
    name: 'Hello from Nuxt layer',
  },
  ui: {
    colors: {
      primary: 'subtle-alliance-orange',
      secondary: 'subtle-alliance-blue',
      tetriary: 'subtle-alliance-teal',
      neutral: 'neutral',
    },
  },
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    myLayer?: {
      /** Project name */
      name?: string
    }
  }
}
