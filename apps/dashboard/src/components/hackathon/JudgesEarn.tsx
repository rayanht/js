import { Flex, SimpleGrid } from "@chakra-ui/react";
import { Heading, Text } from "tw-components";
import { MaskedAvatar } from "tw-components/masked-avatar";

export const JudgesEarn = () => {
  const judges = [
    {
      name: "Furqan Rydhan",
      description: "Founder, thirdweb",
      image: "/assets/landingpage/furqan-rydhan.png",
    },
    {
      name: "Atif",
      description: "VP of Business at thirdweb",
      image: "/assets/landingpage/atif.png",
    },
    {
      name: "Joseph Cooper",
      description: "Founder, Earn Alliance",
      image: "/assets/landingpage/joseph.png",
    },
    {
      name: "Diana Choo",
      description: "Head of BD and Partnerships, Earn Alliance",
      image: "/assets/landingpage/diana.png",
    },
  ];

  return (
    <div className="container relative flex max-w-[1200px] flex-col gap-8">
      <Heading size="title.2xl">Judges</Heading>
      <SimpleGrid
        columns={{ base: 1, lg: 4 }}
        gap={{ base: 8, md: 24 }}
        justifyContent="space-evenly"
        px={4}
      >
        {judges.map((judge) => (
          <Flex key={judge.name} flexDir="column" gap={2} alignItems="center">
            <MaskedAvatar
              src={judge.image}
              alt={judge.name}
              className="size-52"
            />
            <Heading size="title.sm" mt={4} textAlign="center">
              {judge.name}
            </Heading>
            <Text size="body.md" textAlign="center" maxW="180px">
              {judge.description}
            </Text>
          </Flex>
        ))}
      </SimpleGrid>
    </div>
  );
};
