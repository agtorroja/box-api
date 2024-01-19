'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.UpdateUserDto = void 0
const openapi = require('@nestjs/swagger')
const mapped_types_1 = require('@nestjs/mapped-types')
const user_dto_1 = require('./user.dto')
class UpdateUserDto extends (0, mapped_types_1.PartialType)(
	user_dto_1.UserDTO
) {
	static _OPENAPI_METADATA_FACTORY() {
		return {}
	}
}
exports.UpdateUserDto = UpdateUserDto
//# sourceMappingURL=update-user.dto.js.map