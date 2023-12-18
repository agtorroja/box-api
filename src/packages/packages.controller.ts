import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Put,
	HttpCode,
	HttpStatus,
	BadRequestException,
	NotFoundException,
} from '@nestjs/common'
import { PackagesService } from './packages.service'
import { PackageDto } from './dto/package.dto'
import { UpdatePackageDto } from './dto/update-package.dto'
import { PACAKGE_STATUSES, PackageStatus } from './constants'
import mongoose from 'mongoose'

@Controller('packages')
export class PackagesController {
	constructor(private packageService: PackagesService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	async findAll() {
		try {
			return this.packageService.findAll()
		} catch (error) {
			throw error
		}
	}

	@Get(':id')
	@HttpCode(HttpStatus.OK)
	async findBy(@Param('id') id: string) {
		try {
			//TODO No llamar mongoose en los controllers, llamar a un servicio que llame a mongoose. Va a hacer falta un mock de mongoose para testear
			const isValidId = mongoose.isValidObjectId(id)
			if (!isValidId)
				throw new BadRequestException('Por favor ingresar un ID valido')

			const packageById = await this.packageService.findByID(id)
			if (!packageById) throw new NotFoundException('Paquete no encontrado')

			return packageById
		} catch (error) {
			throw error
		}
	}

	@Get('/status/:status')
	@HttpCode(HttpStatus.OK)
	async findByStatus(@Param('status') status: PackageStatus) {
		try {
			if (!PACAKGE_STATUSES.includes(status))
				throw new BadRequestException('Por favor ingrear un estado válido')
			return await this.packageService.findByStatus(status)
		} catch (error) {
			throw error
		}
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() createPackageDto: PackageDto) {
		try {
			return this.packageService.create(createPackageDto)
		} catch (error) {
			throw error
		}
	}

	@Put(':id')
	@HttpCode(HttpStatus.CREATED)
	async update(@Param('id') id: string, @Body() data: UpdatePackageDto) {
		try {
			return this.packageService.update(id, data)
		} catch (error) {
			throw error
		}
	}
}
