/**
 * Tools Module
 *
 * Agent tools for research and external integrations.
 */

export {
  ToolRegistry,
  getToolRegistry,
  createToolRegistry,
  createTool,
  createSequentialTool,
  createParallelTool,
  createRetryTool,
  type ToolBuilder,
} from './tool-registry.js';

export {
  WebSearchTool,
  createWebSearchTool,
  searchWeb,
  type WebSearchConfig,
} from './web-search.js';

export {
  DocumentReaderTool,
  createDocumentReaderTool,
  readDocument,
  searchDocuments,
  type DocumentReaderConfig,
} from './document-reader.js';
