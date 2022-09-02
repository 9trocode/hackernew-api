import { IsNumberString, IsNotEmpty } from 'class-validator';

export class getCommonWordsDto {
    @IsNotEmpty()
    @IsNumberString()
    stories: number
}
