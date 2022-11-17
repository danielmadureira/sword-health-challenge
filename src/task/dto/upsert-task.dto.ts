import { IsISO8601, IsString, Length, MaxLength } from 'class-validator';

export class UpsertTaskDTO {
  @IsString()
  @MaxLength(2500)
  readonly summary: string;

  @IsISO8601({ strict: true })
  @Length(10, 10)
  readonly date: Date;
}
