import { Obj } from "."

export interface Resp<T> {
  code: number
  message: string
  data: T
}

export type PageResp<T> = Resp<{
  content: T[]
  total: number
}>

export type FsListResp = Resp<{
  content: Obj[]
  total: number
  readme: string
  write: boolean
  provider: string
}>

export type SearchNode = {
  parent: string
  name: string
  is_dir: boolean
  size: number
  path: string
  type: number
}

export type FsSearchResp = PageResp<SearchNode>

export type FsGetResp = Resp<
  Obj & {
    raw_url: string
    readme: string
    provider: string
    related: Obj[]
  }
>

export type MusicInfo = {
  NAME: string
  ALBUM: string
  ARTIST: string
  DC_TARGETID: string
  DURATION: string
  hts_MVPIC: string
  MUSICRID: string
  FORMATS: string
  checked: boolean
  extra: string
}

export type MusicRsp = Resp<{
  TOTAL: number
  abslist: MusicInfo[]
}>

export type ProcessRsp = Resp<{
  processList: MusicInfo[]
  errorList: MusicInfo[]
}>

export type EmptyResp = Resp<{}>

export type PResp<T> = Promise<Resp<T>>
export type PPageResp<T> = Promise<PageResp<T>>
export type PEmptyResp = Promise<EmptyResp>
