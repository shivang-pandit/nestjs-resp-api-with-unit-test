import { Injectable } from '@nestjs/common'

@Injectable()
export class ResponseProvider {
  success(message = 'OK', payload: any = {}) {
    return { message, payload }
  }
}
