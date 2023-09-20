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
  Text,
  HStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  createDisclosure,
  Divider,
  Heading,
} from "@hope-ui/solid"
import { Container } from "~/pages/home/Container"
import { CenterLoading, Paginator } from "~/components"
import {
  addMusicTask,
  cleanDownFailTask,
  listProcessList,
  musicSearch,
} from "~/utils/music_api"
import debounce from "lodash.debounce"
import { createSignal, For, Index, onCleanup, Show } from "solid-js"
import { useT } from "~/hooks"
import { alphaBgColor, bus, notify } from "~/utils"
import { MusicInfo } from "~/types"
import ImageLayout from "~/pages/home/folder/Images"
import { ImageItem } from "~/pages/home/folder/ImageItem"

const MusicList = () => {
  const t = useT()
  const pageSize = 20
  const [searchRet, setSearchRet] = createSignal({
    data: [] as MusicInfo[],
    total: 0,
  })
  const [checkedSize, setCheckedSize] = createSignal(0)
  const [addLoading, setAddLoading] = createSignal(false)
  const searchHandler = (musicKeywords: string, pageNum: number) => {
    musicSearch(musicKeywords, pageSize, pageNum).then((rsp) => {
      if (rsp.code == 200) {
        setSearchRet({ data: rsp.data.abslist, total: rsp.data.TOTAL })
      }
    })
  }
  var searchKeywords = ""
  const searchByPage = (pageNo: number) => {
    if (searchKeywords === "") {
      return
    }
    searchHandler(searchKeywords, pageNo)
  }
  const searchByKeywords = (keywords: string) => {
    searchKeywords = keywords
    resetPaginator()
    searchHandler(searchKeywords, 1)
  }
  bus.on("musicKeywords", searchByKeywords)
  let resetPaginator: () => void
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
    setAddLoading(true)
    let checkedMusics = searchRet().data.filter((e) => e.checked)
    if (checkedMusics.length < 1) {
      setAddLoading(false)
      return
    }
    handleAllCheck(false)
    addMusicTask(checkedMusics)
      .then((e) => {
        if (e) {
          notify.success("添加下载成功")
        }
      })
      .finally(() => setAddLoading(false))
  }
  const addDownloadQueueDebounce = debounce(addDownloadQueue, 100)

  const [processRet, setProcessRet] = createSignal({
    processList: [] as MusicInfo[],
    errorList: [] as MusicInfo[],
  })

  const { isOpen, onOpen, onClose } = createDisclosure()

  const fetchDownloadList = () => {
    listProcessList().then((rsp) => {
      if (rsp.code == 200) {
        setProcessRet(rsp.data)
      }
    })
    var interval = setInterval(() => {
      if (!isOpen()) {
        clearInterval(interval)
        return
      }
      listProcessList().then((rsp) => {
        if (rsp.code == 200) {
          setProcessRet(rsp.data)
        }
      })
    }, 5000)
  }

  const showDownloadList = () => {
    onOpen()
    fetchDownloadList()
  }
  const cleanFailTask = () => {
    cleanDownFailTask().then(() => {
      notify.success("清除完毕")
    })
  }
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
          <HStack spacing="48px">
            <Box p="$2" textAlign="center">
              已选中{checkedSize()} 首
            </Box>
            <Box p="$2">
              <Button
                colorScheme="neutral"
                onclick={addDownloadQueueDebounce}
                variant="outline"
                loading={addLoading()}
                loadingText="提交中"
              >
                下载
              </Button>
            </Box>
            <Box p="$2">
              <Button colorScheme="neutral" onclick={showDownloadList}>
                下载队列
              </Button>
            </Box>
          </HStack>
          <Table
            css={{
              backgroundColor: alphaBgColor(),
              boxShadow: "$md",
              borderRadius: "$lg",
            }}
          >
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
              <For each={searchRet().data}>
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
          <Paginator
            total={searchRet().total}
            defaultPageSize={pageSize}
            onChange={(page) => {
              searchByPage(page)
            }}
            setResetCallback={(reset) => (resetPaginator = reset)}
          />
        </VStack>
      </VStack>
      <Drawer opened={isOpen()} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>任务队列</DrawerHeader>
          <DrawerBody>
            <For each={processRet().processList}>
              {(info, index) => (
                <Box
                  bg="white"
                  w="100%"
                  p="$4"
                  color="black"
                  borderWidth="1px"
                  borderRadius="$lg"
                  borderColor="$neutral6"
                  css={{
                    marginBottom: "2px",
                  }}
                >
                  <Text overflow="hidden" noOfLines={1} textAlign="start">
                    {info.NAME + "-" + info.ARTIST}
                  </Text>
                </Box>
              )}
            </For>
            <Divider />
            <Divider />

            <Heading>失败队列</Heading>
            <For each={processRet().errorList}>
              {(info, index) => (
                <Box
                  bg="white"
                  w="100%"
                  p="$4"
                  color="black"
                  borderWidth="1px"
                  borderRadius="$lg"
                  css={{
                    marginBottom: "2px",
                  }}
                  borderColor="$neutral6"
                >
                  <Text overflow="hidden" noOfLines={1} textAlign="start">
                    {info.NAME + "-" + info.ARTIST}
                  </Text>
                  <Text
                    overflow="hidden"
                    size="xs"
                    noOfLines={1}
                    textAlign="start"
                    color="tomato"
                  >
                    {info.extra}
                  </Text>
                </Box>
              )}
            </For>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr="$3" onClick={onClose}>
              Cancel
            </Button>
            <Button onclick={cleanFailTask}>清除失败</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Container>
  )
}

export default MusicList
