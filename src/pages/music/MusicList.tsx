import {
  Center,
  HStack,
  Icon,
  Image,
  Kbd,
  Input,
  SimpleGrid,
  Text,
  useColorModeValue,
  Button,
  VStack,
  Box,
  CheckboxGroup,
  Checkbox,
  Flex,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@hope-ui/solid"
import { Container } from "~/pages/home/Container"
import { CenterLoading } from "~/components"
import { musicSearch } from "~/utils/music_api"
import debounce from "lodash.debounce"
import { createMemo, createSignal, For, Index, Show } from "solid-js"
import { useT } from "~/hooks"
import { IconCheck } from "@hope-ui/solid/dist/components/icons/IconCheck"
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
  const searchHandler = (musicKeywords: string) => {
    musicSearch(musicKeywords, 10, 1).then((rsp) => {
      if (rsp.code == 200) {
        setSearchRet({ data: rsp.data.abslist, total: rsp.data.TOTAL })
        console.log("数据大小", rsp.data.TOTAL)
      }
    })
  }
  const debouncedSearchHandler = debounce(searchHandler, 500)
  bus.on("musicKeywords", debouncedSearchHandler)

  // 处理复选框状态改变的函数
  const handleChange = (event: { target: { checked: boolean } }) => {
    console.log(event.target.checked)
    let data = searchRet().data.map((item) => ({
      ...item,
      checked: event.target.checked,
      name: item.NAME + "a",
    }))
    let total = searchRet().total
    setSearchRet({ data: data, total: total })
    searchRet().data.forEach((e) => {
      console.log(e.checked)
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
          <CheckboxGroup colorScheme="success">
            <Table>
              <Thead>
                <Tr>
                  <Th>
                    <input type="checkbox" onChange={handleChange} />
                  </Th>
                  <Th>歌曲名</Th>
                  <Th>歌手</Th>
                  <Th>专辑</Th>
                  <Th>图片</Th>
                  <Th>时长</Th>
                </Tr>
              </Thead>

              <Tbody>
                {/* todo 组件有问题 */}
                <Index each={searchRet().data} fallback={<div>Loading...</div>}>
                  {(info) => (
                    <Tr>
                      <Td>
                        <Checkbox checked={info().checked}></Checkbox>
                      </Td>
                      <Td>{info().NAME}</Td>
                      <Td>{info().ARTIST}</Td>
                      <Td>{info().ALBUM}</Td>
                      <Td>
                        {" "}
                        <Image h="$full" w="auto" src={info().hts_MVPIC} />
                      </Td>
                      <Td>{info().DURATION}</Td>
                    </Tr>
                  )}
                </Index>
              </Tbody>
            </Table>
          </CheckboxGroup>
        </VStack>
      </VStack>
    </Container>
  )
}

export default MusicList
