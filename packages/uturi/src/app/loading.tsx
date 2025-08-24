import { Box } from '@chakra-ui/react/box';
import { Skeleton } from '@chakra-ui/react/skeleton';

function Loading() {
  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box display="flex" flexDirection="column" flexGrow={1} p={4}>
        <Skeleton width="100%" height={200} />
      </Box>
    </Box>
  );
}

export default Loading;
