import type { Tool } from '../../_constants/Tools';
import { ToolStatus } from '../../_constants/Tools';

function getStatusText(status: Tool['status']) {
  switch (status) {
    case ToolStatus.STABLE:
      return '안정';
    case ToolStatus.BETA:
      return '베타';
    case ToolStatus.ALPHA:
      return '알파';
    default:
      return '개발중';
  }
}

export default getStatusText;
