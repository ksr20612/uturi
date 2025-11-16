import { Badge } from '@chakra-ui/react/badge';
import { Box } from '@chakra-ui/react/box';
import { Button } from '@chakra-ui/react/button';
import { HStack, VStack } from '@chakra-ui/react/stack';
import { Text } from '@chakra-ui/react/text';

import { VisuallyHidden } from '@chakra-ui/react/visually-hidden';
import Link from 'next/link';

import { FaGithub, FaNpm } from 'react-icons/fa';

import type { Tool } from '@/app/_constants/Tools';
import { ToolStatus } from '@/app/_constants/Tools';
import getStatusColor from '@/app/_utils/getStatusColor/getStatusColor';
import getStatusLabel from '@/app/_utils/getStatusLabel/getStatusLabel';

function ToolCard({
  name,
  githubUrl,
  npmUrl,
  url,
  status,
  description,
  features,
  id,
  version,
}: Tool) {
  return (
    <>
      <Box mb={4}>
        <VStack align="start" gap={2}>
          <HStack justify="space-between" w="full">
            <Box as="p" fontWeight="bold" color="primary.text">
              {name}
            </Box>
            <HStack gap={3}>
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
                    color="fg.subtle"
                    _hover={{ color: 'fg.muted' }}
                    _focus={{
                      color: 'fg.muted',
                      outline: '2px solid',
                      outlineColor: 'primary.text',
                      outlineOffset: '2px',
                      borderRadius: 'md',
                    }}
                    transition="color 0.2s"
                    cursor="pointer"
                    aria-label={`${name} GitHub repository (opens in new tab)`}
                  >
                    <FaGithub size={20} />
                  </Box>
                </Link>
              )}
              {npmUrl && (
                <Link href={npmUrl} target="_blank" rel="noopener noreferrer">
                  <Box
                    as="span"
                    color="fg.subtle"
                    _hover={{ color: 'fg.muted' }}
                    _focus={{
                      color: 'fg.muted',
                      outline: '2px solid',
                      outlineColor: 'primary.text',
                      outlineOffset: '2px',
                      borderRadius: 'md',
                    }}
                    transition="color 0.2s"
                    cursor="pointer"
                    aria-label={`${name} GitHub repository (opens in new tab)`}
                  >
                    <FaNpm size={20} />
                  </Box>
                </Link>
              )}
            </HStack>
          </HStack>
          <HStack gap={2} flexWrap="wrap">
            {version && (
              <Badge colorPalette="blue" variant="subtle" size="md">
                v{version}
              </Badge>
            )}
            <Badge colorPalette={getStatusColor(status)} variant="subtle" size="md">
              {getStatusLabel(status)}
            </Badge>
          </HStack>
        </VStack>
      </Box>

      <Box flex="1">
        <Text color="fg.muted" mb={4}>
          {description}
        </Text>

        {features.length > 0 && (
          <VStack align="start" gap={2}>
            <Text fontSize="sm" fontWeight="semibold" color="fg.muted" id={`features-${id}`}>
              Key Features:
            </Text>
            <Box
              as="ul"
              aria-labelledby={`features-${id}`}
              listStyle="disc"
              listStylePosition="inside"
            >
              {features.map((feature, index) => (
                <Text key={index} as="li" fontSize="sm" color="fg.subtle" mb={1}>
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
            size="sm"
            w="full"
            bg="bg.muted"
            color="fg.subtle"
            border="1px solid"
            borderColor="border.muted"
            disabled
            cursor="not-allowed"
            aria-describedby={`status-${id}`}
            _hover={{}}
            _focus={{}}
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
              size="sm"
              w="full"
              border="1px solid"
              _hover={{
                bg: 'primary.hover',
                borderColor: 'primary.hover',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px 0 rgba(20, 184, 166, 0.3)',
              }}
              _focus={{
                bg: 'primary.hover',
                borderColor: 'primary.hover',
                outline: '3px solid',
                outlineColor: 'primary.text',
                outlineOffset: '2px',
              }}
              transition="all 0.3s ease"
              cursor="pointer"
              aria-label={`Learn more about ${name}`}
            >
              Learn More
            </Button>
          </Link>
        )}
        <VisuallyHidden id={`status-${id}`}>
          {status === ToolStatus.DEVELOPING
            ? 'This tool is currently in development'
            : 'This tool is available for use'}
        </VisuallyHidden>
      </Box>
    </>
  );
}

export default ToolCard;
