import { Badge } from '@chakra-ui/react/badge';
import { Box } from '@chakra-ui/react/box';
import { Button } from '@chakra-ui/react/button';
import { HStack, VStack } from '@chakra-ui/react/stack';
import { Text } from '@chakra-ui/react/text';

import { VisuallyHidden } from '@chakra-ui/react/visually-hidden';
import Link from 'next/link';

import { FaGithub } from 'react-icons/fa';

import type { Tool } from '@/app/_constants/Tools';
import { ToolStatus } from '@/app/_constants/Tools';
import getStatusColor from '@/app/_utils/getStatusColor/getStatusColor';
import getStatusLabel from '@/app/_utils/getStatusLabel/getStatusLabel';

interface ToolCardProps extends Tool {}

function ToolCard({ name, githubUrl, url, status, description, features, id }: ToolCardProps) {
  return (
    <>
      <Box mb={4}>
        <VStack align="start" gap={2}>
          <HStack justify="space-between" w="full">
            <Box as="p" fontWeight="bold" color="primary.500">
              {name}
            </Box>
            {githubUrl && (
              <Link
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                <Box
                  as="span"
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
                  cursor="pointer"
                  aria-label={`${name} GitHub 저장소 (새 탭에서 열림)`}
                >
                  <FaGithub size={20} />
                </Box>
              </Link>
            )}
          </HStack>
          <Badge colorScheme={getStatusColor(status)} variant="subtle">
            {getStatusLabel(status)}
          </Badge>
        </VStack>
      </Box>

      <Box flex="1">
        <Text color="gray.600" mb={4}>
          {description}
        </Text>

        {features.length > 0 && (
          <VStack align="start" gap={2}>
            <Text fontSize="sm" fontWeight="semibold" color="gray.700" id={`features-${id}`}>
              주요 기능:
            </Text>
            <Box
              as="ul"
              aria-labelledby={`features-${id}`}
              listStyle="disc"
              listStylePosition="inside"
            >
              {features.map((feature, index) => (
                <Text key={index} as="li" fontSize="sm" color="gray.600" mb={1}>
                  {feature}
                </Text>
              ))}
            </Box>
          </VStack>
        )}
      </Box>

      <Box mt={6}>
        {status === ToolStatus.DEVELOPING ? (
          <Button
            as="div"
            colorScheme="gray"
            variant="outline"
            size="sm"
            w="full"
            disabled
            cursor="not-allowed"
            aria-describedby={`status-${id}`}
          >
            {getStatusLabel(status)}
          </Button>
        ) : (
          <Link
            href={url}
            style={{
              textDecoration: 'none',
            }}
          >
            <Button
              as="span"
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
              cursor="pointer"
              aria-label={`${name} 자세히 보기`}
            >
              자세히 보기
            </Button>
          </Link>
        )}
        <VisuallyHidden id={`status-${id}`}>
          {status === ToolStatus.DEVELOPING
            ? '이 도구는 현재 개발 중입니다'
            : '이 도구는 사용 가능합니다'}
        </VisuallyHidden>
      </Box>
    </>
  );
}

export default ToolCard;
