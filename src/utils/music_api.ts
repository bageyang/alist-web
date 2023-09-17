import { r } from "."
import { MusicRsp } from "~/types"

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
