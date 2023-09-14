import {
  Center,
  HStack,
  Icon,
  Image,
  Kbd,
  Breadcrumb,
  Input,
  useColorModeValue,
  Button,
} from "@hope-ui/solid"
import { Container } from "~/pages/home/Container"
import { CenterLoading } from "~/components"
import { createSignal, Show } from "solid-js"
import { getSetting, objStore, State } from "~/store"
import { bus } from "~/utils"
import { BsSearch } from "solid-icons/bs"
import { isMac } from "~/utils/compatibility"
import { Layout } from "~/pages/home/header/layout"
import { useT } from "~/hooks"

const MusicHeader = () => {
  const logos = getSetting("logo").split("\n")
  const logo = useColorModeValue(logos[0], logos.pop())
  const t = useT()
  const [musicKeywords, setMusicKeywords] = createSignal("")
  const searchMusic = async () => {
    console.log(musicKeywords())
  }
  return (
    <Center
      class="header"
      w="$full"
      // shadow="$md"
    >
      <Container>
        <HStack px="calc(2% + 0.5rem)" py="$2" w="$full">
          <HStack class="header-left" h="44px">
            <Image
              src={logo()!}
              h="$full"
              w="auto"
              fallback={<CenterLoading />}
            />
          </HStack>
          <HStack class="header-right" spacing="$2">
            <Input
              id="music-search-input"
              value={musicKeywords()}
              onInput={(e) => {
                setMusicKeywords(e.currentTarget.value)
              }}
            />
            <Button onClick={() => searchMusic()}>{t("global.confirm")}</Button>
          </HStack>
        </HStack>
      </Container>
    </Center>
  )
}

export default MusicHeader
