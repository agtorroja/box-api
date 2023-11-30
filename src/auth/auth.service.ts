import { UsersService } from 'src/users/users.service'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersDocument } from 'src/users/schema/users.schema'
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import { AuthResponse, PayloadToken } from 'src/interfaces/auth.interface'

import { UserDTO } from 'src/users/dto/user.dto'
import { ResetPasswordDto } from './dto/resetPass-auth.dto'
import { MailService } from '../../modules/mailer/mailer.service'

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UsersService,
		private readonly mailerService: MailService
	) {}

	public async validateUser(userName: string, password: string) {
		const userByUsername = await this.userService.findBy({
			key: 'userName',
			value: userName,
		})
		const userByEmial = await this.userService.findBy({
			key: 'email',
			value: userName,
		})

		if (userByUsername) {
			const match = await bcrypt.compare(password, userByUsername.password)
			if (match) return userByUsername
		}

		if (userByEmial) {
			const match = await bcrypt.compare(password, userByEmial.password)
			if (match) return userByEmial
		}

		return null
	}

	public signJWT({
		payload,
		secret,
		expires,
	}: {
		payload: jwt.JwtPayload
		secret: string
		expires: number | string
	}): string {
		return jwt.sign(payload, secret, { expiresIn: expires })
	}

	public async generateJWT(user: UsersDocument): Promise<AuthResponse> {
		const getUser = await this.userService.findById(user._id.toString())

		const payload: PayloadToken = {
			sub: getUser._id.toString(),
		}

		//TODO: En este return hay que excluir la password dentro de user.
		return {
			accessToken: this.signJWT({
				payload,
				secret: process.env.SECRET_PASSWORD,
				expires: '1h',
			}),
			user,
		}
	}

	async register(userObjectRegister: UserDTO) {
		const { password } = userObjectRegister
		const hashPassword = await bcrypt.hash(password, +process.env.HASH_SALT)
		userObjectRegister = { ...userObjectRegister, password: hashPassword }
		return this.userService.create(userObjectRegister)
	}

	async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
		const { email } = resetPasswordDto
		const user = await this.userService.findByEmail(email)

		if (!user) {
			throw new UnauthorizedException('Email no encontrado')
		}

		console.log('user ---> ', user)
		const resetToken = await this.generateJWT(user)
		console.log('resetToken ---> ', resetToken)

		await this.mailerService.sendEmail(user.email, resetToken)
	}
}
