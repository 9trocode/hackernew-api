import { Injectable } from '@nestjs/common';
import {
    getAxiosInstance,
    ServiceResponse,
    mapWordCounts,
    getListOfOrderedWordCounts,
    findAPostFromADay, getFormattedDate, fetchItem, fetchUser
} from "../helpers/utils";



@Injectable()
export class HackernewsService {
    async getCommonWords (stories: number): Promise<ServiceResponse> {
        try {
            const axiosInstance = getAxiosInstance()
            const storiesResult = await axiosInstance.get("newstories.json")
            const requiredStories = storiesResult.data.slice(0, stories);

            const fetchStories = requiredStories.map(storyId => fetchItem(storyId));
            const storiesDetailResults = await Promise.all(fetchStories);

            const wordsCount = mapWordCounts(
                storiesDetailResults
                    .map(storyResult => storyResult.data.title)
            );


            const topWords = getListOfOrderedWordCounts(wordsCount).slice(0, 10);

            return {
                code: 200,
                status: true,
                data: topWords
            }

        }catch (error){
            return {
                code: 400,
                status: true,
                err: error.message
            }
        }
    }

    async lastWeekPosts (): Promise<ServiceResponse> {
      try {
          const axiosInstance = getAxiosInstance()
          const maxItemResult = await axiosInstance.get("maxitem.json")
          const currentDate = new Date();
          const pastDate = currentDate.getDate() - 7;
          currentDate.setDate(pastDate);
          const postResult = await findAPostFromADay(currentDate.getTime(), maxItemResult.data / 2, maxItemResult.data);


          return {
              code: 200,
              status: true,
              data: {
                  post: postResult.data,
                  lastWeekDate: getFormattedDate(currentDate),
                  storyDate: getFormattedDate(new Date(postResult.data.time * 1000)),
                  wordsCount: getListOfOrderedWordCounts(mapWordCounts([postResult.data.title]))
              }
          }

      }catch (error){
          return {
              code: 400,
              status: true,
              err: error.message
          }
      }
    }


    async TopUsers (stories: number): Promise<ServiceResponse> {
        try {
            const axiosInstance = getAxiosInstance()
            const newStoriesResult = await axiosInstance.get("newstories.json")
            const requiredStories = newStoriesResult.data.slice(0, stories);
            const fetchStoryPromises = requiredStories.map(storyId => fetchItem(storyId));
            const storiesDetailResults = await Promise.all(fetchStoryPromises);
            const users = storiesDetailResults.map((storyResult, storyIndex) => ({user: storyResult.data.by, storyIndex}));
            const fetchUserPromises = users.map(userData => fetchUser(userData.user));
            const userDetailResults = await Promise.all(fetchUserPromises);


            const wordsCount = mapWordCounts(
                storiesDetailResults
                    .filter((storyResult, index) =>
                        storyResult.data
                        && userDetailResults[index].data.karma >= 10000
                    )
                    .map(storyResult => storyResult.data.title)
            );
            const topWords = getListOfOrderedWordCounts(wordsCount).slice(0, 10);

            return {
                code: 200,
                status: true,
                data: topWords
            }

        }catch (error){
            return {
                code: 400,
                status: true,
                err: error.message
            }
        }
    }
}
