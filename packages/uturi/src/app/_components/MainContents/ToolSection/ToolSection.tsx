import {
  Badge,
  Box,
  Button,
  Container,
  HStack,
  Heading,
  Text,
  VStack,
  VisuallyHidden,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';

import TOOLS, { ToolStatus } from '@/app/_constants/Tools';
import getStatusColor from '@/app/_utils/getStatusColor/getStatusColor';
import getStatusLabel from '@/app/_utils/getStatusLabel/getStatusLabel';

function ToolSection() {
  return (
    <Box as="section" bg="gray.50">
      <Container maxW="7xl">
        <VStack gap={12} align="stretch">
          <VisuallyHidden textAlign="center">
            <Heading as="h2">접근성 도구들</Heading>
          </VisuallyHidden>

          <Box
            as="ul"
            display="grid"
            gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
            gap={8}
          >
            {TOOLS.map((tool) => (
              <Box
                as="li"
                key={tool.id}
                bg="white"
                borderRadius="lg"
                p={6}
                shadow="md"
                _hover={{ shadow: 'xl' }}
                transition="all 0.3s"
                h="full"
                display="flex"
                flexDirection="column"
              >
                <Box mb={4}>
                  <VStack align="start" gap={2}>
                    <HStack justify="space-between" w="full">
                      <Box as="p" fontWeight="bold" color="primary.500">
                        {tool.name}
                      </Box>
                      {tool.githubUrl && (
                        <Link href={tool.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Box
                            as="a"
                            color="gray.500"
                            _hover={{ color: 'gray.700' }}
                            _focus={{
                              color: 'gray.700',
                              outline: '2px solid',
                              outlineColor: 'primary.500',
                              outlineOffset: '2px',
                              borderRadius: 'md',
                            }}
                            transition="color 0.2s"
                            aria-label={`${tool.name} GitHub 저장소 (새 탭에서 열림)`}
                          >
                            <FaGithub size={20} />
                          </Box>
                        </Link>
                      )}
                    </HStack>
                    <Badge colorScheme={getStatusColor(tool.status)} variant="subtle">
                      {getStatusLabel(tool.status)}
                    </Badge>
                  </VStack>
                </Box>

                <Box flex="1">
                  <Text color="gray.600" mb={4}>
                    {tool.description}
                  </Text>

                  {tool.features.length > 0 && (
                    <VStack align="start" gap={2}>
                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        color="gray.700"
                        id={`features-${tool.id}`}
                      >
                        주요 기능:
                      </Text>
                      <Box
                        as="ul"
                        aria-labelledby={`features-${tool.id}`}
                        listStyle="disc"
                        listStylePosition="inside"
                      >
                        {tool.features.map((feature, index) => (
                          <Text key={index} as="li" fontSize="sm" color="gray.600" mb={1}>
                            {feature}
                          </Text>
                        ))}
                      </Box>
                    </VStack>
                  )}
                </Box>

                <Box mt={6}>
                  {tool.status === ToolStatus.DEVELOPING ? (
                    <Button
                      as="div"
                      colorScheme="gray"
                      variant="outline"
                      size="sm"
                      w="full"
                      disabled
                      cursor="not-allowed"
                      aria-describedby={`status-${tool.id}`}
                    >
                      {getStatusLabel(tool.status)}
                    </Button>
                  ) : (
                    <Link href={tool.url} passHref>
                      <Button
                        as="div"
                        colorScheme="primary"
                        variant="outline"
                        size="sm"
                        w="full"
                        _hover={{ bg: 'primary.500' }}
                        _focus={{
                          bg: 'primary.500',
                          color: 'white',
                          outline: '2px solid',
                          outlineColor: 'primary.600',
                          outlineOffset: '2px',
                        }}
                        aria-label={`${tool.name} 자세히 보기`}
                      >
                        자세히 보기
                      </Button>
                    </Link>
                  )}
                  <VisuallyHidden id={`status-${tool.id}`}>
                    {tool.status === ToolStatus.DEVELOPING
                      ? '이 도구는 현재 개발 중입니다'
                      : '이 도구는 사용 가능합니다'}
                  </VisuallyHidden>
                </Box>
              </Box>
            ))}
          </Box>

          <Box textAlign="center" py={8}>
            <Text fontSize="lg" color="gray.500">
              더 많은 접근성 도구들이 개발 중입니다.
              <Text as="span" color="primary.500" fontWeight="semibold">
                GitHub
              </Text>
              에서 최신 소식을 확인하세요.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

export default ToolSection;
