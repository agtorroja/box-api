import { ROLES } from 'src/constants/roles'
import { UsersDocument } from 'src/users/schema/users.schema'

export interface IPayloadToken {
	_id: string
	name: string
	email: string
	lastName: string
	role: string
	status: string
	userName: string
	image: string
}

export interface IAuthBody {
	user: string
	password: string
}

export interface IAuthResponse {
	accessToken: string
	user: UsersDocument
}

export interface IAuthTokenResult {
	role: (typeof ROLES)[keyof typeof ROLES]

	sub: string
	iat: number
	exp: number
}

export interface IUseToken {
	role: string
	sub: string
	isExpired: boolean
}