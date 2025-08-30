import { Box } from '@chakra-ui/react/box';
import { Heading } from '@chakra-ui/react/heading';
import { Text } from '@chakra-ui/react/text';

function IntroSection() {
  return (
    <Box as="section" py={20} textAlign="center" position="relative" overflow="hidden">
      <Heading
        as="h1"
        fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
        fontWeight="bold"
        lineHeight="1.1"
        mb={8}
        color="white"
      >
        <Box as="span" color="white">
          Transform{' '}
        </Box>
        <Box
          as="span"
          style={{
            background: 'linear-gradient(to right, #22d3ee, #3b82f6, #9333ea)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Data
        </Box>
        <Box as="span" color="white">
          {' '}
          into{' '}
        </Box>
        <Box
          as="span"
          style={{
            background: 'linear-gradient(to right, #facc15, #f97316, #ef4444)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Sound
        </Box>
      </Heading>

      <Text
        fontSize={{ base: 'xl', md: '2xl' }}
        color="gray.300"
        maxW="6xl"
        mx="auto"
        lineHeight="1.6"
        mb={8}
      >
        Data visualization charts cannot provide the same experience to non-visual users. <br />
        Now use{' '}
        <Text as="strong" color="teal.400">
          @uturi/sonification
        </Text>{' '}
        to quickly and easily convey data changes through sound.
      </Text>

      {/* Background Decorations */}
      <Box
        position="absolute"
        top={10}
        left={10}
        w={32}
        h={32}
        bg="teal.500"
        opacity={0.1}
        borderRadius="full"
        filter="blur(30px)"
      />
      <Box
        position="absolute"
        bottom={10}
        right={10}
        w={40}
        h={40}
        bg="purple.500"
        opacity={0.1}
        borderRadius="full"
        filter="blur(40px)"
      />
    </Box>
  );
}

export default IntroSection;

/*
    <Field.Root required>
      <Field.Label>
        Email <Field.RequiredIndicator />
      </Field.Label>
      <Input placeholder="Enter your email" />
      <Field.HelperText>We'll never share your email.</Field.HelperText>
    </Field.Root>
*/
