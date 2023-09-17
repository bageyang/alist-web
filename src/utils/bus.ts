import mitt from "mitt"

type Events = {
  to: string
  gallery: string
  tool: string
  pathname: string
  musicKeywords: string
}

export const bus = mitt<Events>()
