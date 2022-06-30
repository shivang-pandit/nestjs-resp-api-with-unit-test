import { Controller, Get } from '@nestjs/common'
import { ApiExcludeEndpoint } from '@nestjs/swagger'
import { ResponseProvider } from './providers/ResponseProvider'

@Controller()
export class AppController {
  constructor(private readonly responseProvider: ResponseProvider) {}

  @Get('')
  @ApiExcludeEndpoint()
  getHello() {
    return this.responseProvider.success('Hey... Service Live! 🚀')
  }
}
