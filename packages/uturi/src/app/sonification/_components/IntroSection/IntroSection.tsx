import { Box } from '@chakra-ui/react/box';
import { Heading } from '@chakra-ui/react/heading';
import { Text } from '@chakra-ui/react/text';

function IntroSection() {
  return (
    <Box textAlign="center">
      <Heading as="h1" size="2xl" mb={4}>
        @uturi/sonification
      </Heading>
      <Text fontSize="lg" color="gray.600" maxW="2xl" mx="auto" wordBreak="keep-all">
        데이터를 시각화한 차트, 비시각 사용자들에게는 동일한 경험을 전달할 수 없습니다.
        <br />
        이제{' '}
        <Text as="strong" color="teal.solid">
          소리
        </Text>
        를 통해 데이터의 변화량을 빠르고 쉽게 전달해보세요.
      </Text>
    </Box>
  );
}

export default IntroSection;
