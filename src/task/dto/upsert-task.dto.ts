import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsString, Length, MaxLength } from 'class-validator';

export class UpsertTaskDTO {
  @ApiProperty({
    description: 'The task description may contain at most 2500 characters.',
  })
  @IsString()
  @MaxLength(2500)
  readonly summary: string;

  @ApiProperty()
  @IsISO8601({ strict: true })
  @Length(10, 10)
  readonly date: Date;
}
