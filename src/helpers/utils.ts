import axios from "axios";

export const getAxiosInstance = () => {
 return axios.create({
        baseURL: "https://hacker-news.firebaseio.com/v0/",
        headers: { 'Content-Type': 'application/json' },
    })
}



export interface ServiceResponse {
    code: number
    status: boolean
    data?: any
    err?: string
}



function getWords(text) {
    const regex = /[a-z'\-]+/g;
    return text.match(regex);
}



export function mapWordCounts(textList) {
    console.log(textList)
    const wordMap = {};
    for (let i = 0; i < textList.length; i++) {
        const wordList = getWords(textList[i].toLowerCase());
        for (let k = 0; k < wordList.length; k++) {
            const word = wordList[k];
            if (!wordMap[word]) {
                wordMap[word] = 1;
            } else {
                wordMap[word]++;
            }
        }
    }
    return wordMap;
}



export function getListOfOrderedWordCounts(wordMap) {
    return Object.keys(wordMap)
        .map(key => ({key: key, value: wordMap[key]}))
        .sort((word1, word2) => word2.value - word1.value);
}



export async function findAPostFromADay(postTime, start, end) {
    if (start > end) {
        return false;
    }

    let mid = Math.floor((start + end) / 2);

    const itemResult = await fetchItem(mid);
    const itemTime = itemResult.data.time * 1000;

    // if it is comment and if it is before story
    if (itemTime < postTime) {
        return await findAPostFromADay(postTime, mid + 1, end);
    }

    const storyResult = await findStory(itemResult);
    const storyTime = storyResult.data.time * 1000;

    const storyDate = getFormattedDate(new Date(storyTime));
    const pastDate = getFormattedDate(new Date(postTime));

    if (storyDate === pastDate) {
        return storyResult;
    }

    if (storyTime > postTime) {
        return await findAPostFromADay(postTime, start, mid - 1);
    } else {
        return await findAPostFromADay(postTime, mid + 1, end);
    }
}



async function findStory(itemResult) {
    if (!itemResult.data.parent) {
        return itemResult;
    }
    return findStory(await fetchItem(itemResult.data.parent));
}



export function getFormattedDate(date) {
    let year = date.getFullYear();

    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
}



export function fetchItem(itemId) {
    if (!itemId) {
        throw new Error('There is no itemId to fetch');
    }
    return getAxiosInstance().get(`item/${itemId}.json`)
}

export function fetchUser(user) {
    if (!user) {
        throw new Error('There is no user to fetch');
    }
    return getAxiosInstance().get(`user/${user}.json`)
}
