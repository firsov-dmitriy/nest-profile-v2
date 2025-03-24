import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

export interface DataType<T> {
  data: T[];
  meta: {
    timestamp: Date;
    statusCode: number;
  };
}

export class MyDataType<T> {
  @ApiProperty({ isArray: true })
  data: T;

  @ApiProperty()
  meta: {
    timestamp: Date;
    statusCode: number;
  };
}

export class ResponseMeta {
  @ApiProperty({ type: 'string', format: 'date-time' })
  timestamp: Date;

  @ApiProperty({ type: 'number' })
  statusCode: number;
}

export const CommonResponseSchema = (model: any) => ({
  properties: {
    data: {
      type: 'array',
      items: { $ref: getSchemaPath(model) }, // Dynamically reference the DTO schema
    },
    meta: {
      type: 'object',
      properties: {
        timestamp: { type: 'string', format: 'date-time' },
        statusCode: { type: 'number' },
      },
    },
  },
});

export class MetaDto {
  @ApiProperty({ example: '2024-12-15T12:34:56.789Z' })
  timestamp: string;

  @ApiProperty({ example: 200 })
  statusCode: number;
}

export class ApiResponseDto<T> {
  @ApiProperty({ isArray: true })
  data: T;

  @ApiProperty({ type: MetaDto })
  meta: MetaDto;
}
