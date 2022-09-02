import {Controller, Get, Param, Query} from '@nestjs/common';
import { HackernewsService } from '../services/hackernews.service';
import {getCommonWordsDto} from "../dto/hackernews.dto";
import {ServiceResponse} from "../helpers/utils";


@Controller('hackernews')
export class HackerNewsController {
    constructor(private readonly hackerNewsService: HackernewsService) {}

    @Get("commonWords")
    async getCommonWords(@Query() query: getCommonWordsDto): Promise<ServiceResponse> {
        return await this.hackerNewsService.getCommonWords(query.stories ? query.stories : 25);
    }

    @Get("commonWordsLastWeekPost")
    getCommonWordsLastWeekPost(): Promise<ServiceResponse> {
        return this.hackerNewsService.lastWeekPosts();
    }

    @Get("commonWordsTopUsers")
    commonWordsTopUsers(@Query() query: getCommonWordsDto): Promise<ServiceResponse> {
        return this.hackerNewsService.TopUsers(query.stories ? query.stories : 600);
    }
}
