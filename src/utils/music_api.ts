import { r } from "."
import { MusicInfo, MusicRsp } from "~/types"

export const musicSearch = (
  keywords: string,
  pageSize: number,
  pageNo: number,
): Promise<MusicRsp> => {
  return r.post("/music/search", {
    keywords: keywords,
    pageSize: pageSize,
    pageNo: pageNo,
  })
}

export const addMusicTask = (musics: MusicInfo[]): Promise<Boolean> => {
  return r.post("/music/addTask", { musicList: musics })
}
