import type { Tool } from '../../_constants/Tools';
import { ToolStatus } from '../../_constants/Tools';

function getStatusColor(status: Tool['status']) {
  switch (status) {
    case ToolStatus.STABLE:
      return 'green';
    case ToolStatus.BETA:
      return 'yellow';
    case ToolStatus.ALPHA:
      return 'red';
    default:
      return 'gray';
  }
}

export default getStatusColor;
