import type { Tool } from '../../_constants/Tools';
import { ToolStatus } from '../../_constants/Tools';

function getStatusText(status: Tool['status']) {
  switch (status) {
    case ToolStatus.STABLE:
      return 'Stable';
    case ToolStatus.BETA:
      return 'Beta';
    case ToolStatus.ALPHA:
      return 'Alpha';
    default:
      return 'In Development';
  }
}

export default getStatusText;
