export interface PublicUser {
  id: number
  fullName: string | null
  avatarUrl: string | null
  initials: string
}

export interface AccountProfile extends PublicUser {
  email: string
  createdAt: string
  updatedAt: string
}

export interface AuthUser {
  id: number
  fullName: string | null
  email: string
  createdAt: string
  updatedAt: string
  initials: string
  avatarUrl?: string | null
}
