import { Box } from '@chakra-ui/react/box';
import { Text } from '@chakra-ui/react/text';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  language: 'typescript' | 'javascript' | 'bash' | 'json' | 'tsx' | 'vue' | 'svelte';
  children: string;
  title?: string;
}

function CodeBlock({ language, children, title }: CodeBlockProps) {
  return (
    <Box>
      {title && (
        <Text fontSize="sm" fontWeight="semibold" mb={2} color="gray.300">
          {title}
        </Text>
      )}
      <Box borderRadius="lg" overflow="hidden" boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1)">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            background: '#282c34',
            borderRadius: '8px',
            fontSize: '14px',
            margin: 0,
            padding: '16px',
            lineHeight: '1.6',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'monospace',
              fontSize: '14px',
            },
          }}
          preTagProps={{
            style: {
              margin: 0,
              background: 'transparent',
            },
          }}
        >
          {children}
        </SyntaxHighlighter>
      </Box>
    </Box>
  );
}

export default CodeBlock;
