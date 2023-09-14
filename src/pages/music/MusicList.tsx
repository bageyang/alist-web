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
  CheckboxPrimitive,
  css,
  CheckboxPrimitiveIndicator,
  Checkbox,
  Flex,
} from "@hope-ui/solid"
import { Container } from "~/pages/home/Container"
import { CenterLoading } from "~/components"
import { createMemo, createSignal, For, Show } from "solid-js"
import { useT } from "~/hooks"
import { IconCheck } from "@hope-ui/solid/dist/components/icons/IconCheck"

const MusicList = () => {
  const t = useT()
  const checkboxRootStyles = css({
    rounded: "$md",
    border: "1px solid $neutral7",
    shadow: "$sm",
    bg: "$loContrast",
    px: "$4",
    py: "$3",
    w: "$full",
    cursor: "pointer",

    _focus: {
      borderColor: "$info7",
      shadow: "0 0 0 3px $colors$info5",
    },

    _checked: {
      borderColor: "transparent",
      bg: "#0c4a6e",
      color: "white",
    },
  })
  const checkboxIndicatorStyles = css({
    rounded: "$sm",
    border: "1px solid $neutral7",
    bg: "$whiteAlpha7",
    boxSize: "$5",

    _groupChecked: {
      borderColor: "transparent",
    },
  })
  const [musicKeywords, setMusicKeywords] = createSignal("")
  const searchMusic = async () => {
    console.log(musicKeywords())
  }
  const searchList = [
    {
      id: 1,
      name: "music1",
      artlist: "周杰伦",
      album: "牛仔很忙",
      picUrl: "https://cdn.jsdelivr.net/gh/alist-org/logo@main/logo.svg",
    },
  ]
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
        <CheckboxGroup>
          <VStack spacing="$4">
            <CheckboxGroup
              colorScheme="success"
              defaultValue={["luffy", "sanji"]}
            >
              <HStack spacing="$5">
                <For each={searchList}>
                  {(preference) => (
                    <HStack spacing="24px">
                      <Checkbox value="sanji">Sanji</Checkbox>
                      <Box w="170px" h="$10" bg="$danger9" />
                      <Box w="180px" h="$10" bg="$danger9" />
                    </HStack>
                  )}
                </For>
              </HStack>
            </CheckboxGroup>
          </VStack>
        </CheckboxGroup>
      </VStack>
    </Container>
  )
}

export default MusicList
