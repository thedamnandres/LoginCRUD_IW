export type Role = 'user' | 'admin' | string
export type Id = string | number

export type SessionUser = {
  id: Id
  role: Role
  email?: string
  username?: string
}

export type Item = {
  id: Id
  title: string
  description?: string
  ownerId?: Id
  ownerEmail?: string
}
