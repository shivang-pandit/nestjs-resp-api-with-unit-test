import { plainToClass } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  NODE_ENV: string;

  @IsNumber()
  APPLICATION_PORT: number;

  @IsString()
  API_VERSION: string;
  
  @IsString()
  APPLICATION_NAME: string;

  @IsString()
  MONGO_CONNECTION_URI: string;

  @IsString()
  JWT_ENCRYPTION: string;

  @IsString()
  JWT_EXPIRATION: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(
    EnvironmentVariables,
    config,
    { enableImplicitConversion: true },
  );
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
