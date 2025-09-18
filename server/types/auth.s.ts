// auth.d.ts
declare module '#auth-utils' {
  interface User {
    // Add your own fields
  }

  interface UserSession {
    user?: User
    loggedInAt?: Date
  }

  interface SecureSessionData {
    // Add your own fields
  }
}

export { }