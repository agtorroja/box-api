import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { User, UsersDocument } from './schema/users.schema'
import { UserDTO } from './dto/user.dto'
import { UsersModule } from './users.module'

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name)
		private UserModule: Model<UsersDocument>
	) {}

	async create(body: UserDTO): Promise<UsersModule> {
		const userCreated = await this.UserModule.create(body)
		return userCreated
	}

	async findAll() {
		// return await this.UserModule.find()
		return await this.UserModule.find().populate('packages')
	}

	async findCarriers() {
		return await this.UserModule.find({ role: 'CARRIER' }).populate('packages')
	}

	public async findById(id: string): Promise<UsersDocument> {
		const isValidId = mongoose.isValidObjectId(id)

		if (!isValidId) {
			throw new BadRequestException('Please enter a correct id')
		}

		// const user = await this.UserModule.findById(id)
		const user = await this.UserModule.findById(id).populate('packages')

		if (!user) {
			throw new NotFoundException('User not found')
		}

		return user
	}

	public async findByEmail(email: string) {
		const user = await this.UserModule.findOne({ email })

		if (!user) {
			throw new NotFoundException('User not found')
		}

		return user
	}

	async update(id: string, updateUserDto: UpdateUserDto) {
		return this.UserModule.findByIdAndUpdate(id, updateUserDto, { new: true })
	}

	public async updatePassword(id: string, password: string) {
		return await this.UserModule.findByIdAndUpdate(
			id,
			{ password },
			{ new: true }
		)
	}

	async addPackageToUser(userId: string, packageId: string): Promise<User> {
		return this.UserModule.findByIdAndUpdate(
			userId,
			{ $push: { packages: packageId } },
			{ new: true }
		).exec()
	}

	remove(id: number) {
		return `This action removes a #${id} user`
	}

	public async removePackage(userId: string, packageId: string) {
		const user = await this.UserModule.findById(userId)
		user.packages = user.packages.filter((pack) => pack.toString() !== packageId)
		user.save()
	}

	public async findBy({ key, value }: { key: keyof UserDTO; value: any }) {
		try {
			const user: UsersDocument = await this.UserModule.findOne().where({
				[key]: value,
			})

			return user
		} catch (error) {}
	}
}
