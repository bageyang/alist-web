import {
  Image,
  Button,
  VStack,
  Box,
  Flex,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Spacer,
} from "@hope-ui/solid"
import { Container } from "~/pages/home/Container"
import { CenterLoading } from "~/components"
import { addMusicTask, musicSearch } from "~/utils/music_api"
import debounce from "lodash.debounce"
import { createSignal, For, Index, Show } from "solid-js"
import { useT } from "~/hooks"
import { bus } from "~/utils"
import { MusicInfo } from "~/types"
import ImageLayout from "~/pages/home/folder/Images"
import { ImageItem } from "~/pages/home/folder/ImageItem"

const MusicList = () => {
  const t = useT()
  const [searchRet, setSearchRet] = createSignal({
    data: [] as MusicInfo[],
    total: 0,
  })
  const [checkedSize, setCheckedSize] = createSignal(0)
  const searchHandler = (musicKeywords: string) => {
    // musicSearch(musicKeywords, 10, 1).then((rsp) => {
    //   if (rsp.code == 200) {
    //     let length = rsp.data.abslist.length;
    //     setCheckedItems(new Array(length).fill(false))
    //     setSearchRet({ data: rsp.data.abslist, total: rsp.data.TOTAL })
    //     console.log("数据大小", rsp.data.TOTAL)
    //   }
    // })
    let m: MusicInfo = {
      NAME: "达尔文",
      ALBUM: "JJ的咖啡调调,\u0026nbsp;Vol.\u0026nbsp;2",
      ARTIST: "林俊杰",
      DC_TARGETID: "260712441",
      DURATION: "246",
      hts_MVPIC: "https://img4.kuwo.cn/wmvpic/324/24/38/2955906445.jpg",
      MUSICRID: "MUSIC_260712441",
      FORMATS: "OGG192|OGG96|AAC96|WMA96|WMA128|MP3128|MP3H|AAC48|ALFLAC|EXS",
    }
    let m2: MusicInfo = {
      NAME: "达尔文2",
      ALBUM: "JJ的咖啡调调,\u0026nbsp;Vol.\u0026nbsp;2",
      ARTIST: "林俊杰",
      DC_TARGETID: "2607124412",
      DURATION: "246",
      hts_MVPIC: "https://img4.kuwo.cn/wmvpic/324/24/38/2955906445.jpg",
      MUSICRID: "MUSIC_260712441",
      FORMATS: "OGG192|OGG96|AAC96|WMA96|WMA128|MP3128|MP3H|AAC48|ALFLAC|EXS",
    }
    setSearchRet({ data: [m, m2], total: 2 })
  }
  const debouncedSearchHandler = debounce(searchHandler, 500)
  bus.on("musicKeywords", debouncedSearchHandler)

  // 处理复选框状态改变的函数
  const handleAllCheck = (checked: boolean) => {
    if (checked) {
      let data = searchRet().data.map((item) => ({ ...item, checked: true }))
      setSearchRet({ data: data, total: searchRet().total })
    } else {
      let data = searchRet().data.map((item) => ({ ...item, checked: false }))
      setSearchRet({ data: data, total: searchRet().total })
    }
    handleChange("", false)
  }
  const handleChange = (id: string, checked: boolean) => {
    let count = 0
    searchRet().data.forEach((e) => {
      if (e.DC_TARGETID == id) {
        e.checked = checked
      }
      if (e.checked) {
        count++
      }
    })
    setCheckedSize(count)
  }
  const addDownloadQueue = () => {
    let checkedMusicIds = searchRet()
      .data.filter((e) => e.checked)
      .map((e) => e.DC_TARGETID)
    handleAllCheck(false)
    addMusicTask(checkedMusicIds).then((e) => {
      console.log(e)
    })
  }
  const addDownloadQueueDebounce = debounce(addDownloadQueue, 200)
  return (
    <Container>
      <VStack
        class="body"
        mt="$1"
        py="$2"
        px="2%"
        minH="80vh"
        w="$full"
        gap="$4"
      >
        <VStack spacing="$4">
          <Flex>
            <Box p="$2">已选中{checkedSize()}首</Box>
            <Spacer />
            <Box p="$2">
              <Button colorScheme="neutral" onclick={addDownloadQueue}>
                添加到下载队列
              </Button>
            </Box>
            <Box p="$2">
              <Button colorScheme="neutral">下载队列</Button>
            </Box>
          </Flex>
          <Table>
            <Thead>
              <Tr>
                <Th>
                  <input
                    type="checkbox"
                    onChange={(e) => handleAllCheck(e.target.checked)}
                  />
                </Th>
                <Th>歌曲名</Th>
                <Th>歌手</Th>
                <Th>专辑</Th>
                <Th>图片</Th>
                <Th>时长</Th>
              </Tr>
            </Thead>

            <Tbody>
              <For each={searchRet().data} fallback={<CenterLoading />}>
                {(info, index) => (
                  <Tr>
                    <Td>
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          handleChange(info.DC_TARGETID, e.target.checked)
                        }
                        checked={info.checked}
                      />
                    </Td>
                    <Td>{info.NAME}</Td>
                    <Td>{info.ARTIST}</Td>
                    <Td>{info.ALBUM}</Td>
                    <Td>
                      {/*<Image h="$full" w="auto" src={info.hts_MVPIC} />*/}
                    </Td>
                    <Td>{info.DURATION}</Td>
                  </Tr>
                )}
              </For>
            </Tbody>
          </Table>
        </VStack>
      </VStack>
    </Container>
  )
}

export default MusicList
