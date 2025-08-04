// Test script for CSV export/import with pipe-delimited tags
import { toCSV, parseCSV, getCSVTemplate } from './src/utils/dataConverters.js';

// Test data with multiple tags
const testData = {
  apps: [
    {
      id: 'app1',
      name: 'ChatGPT',
      description: 'OpenAI Assistant',
      url: 'https://chat.openai.com',
      apiKeyId: 'key1',
      createdAt: '2024-01-01'
    }
  ],
  apiKeys: [
    {
      id: 'key1',
      name: 'OpenAI Key',
      key: 'sk-test-123456789',
      createdAt: '2024-01-01',
      lastUsed: '2024-01-15',
      isActive: true
    }
  ],
  bookmarks: [
    {
      id: 'bm1',
      title: 'API Documentation',
      url: 'https://docs.api.com',
      tags: ['api', 'documentation', 'reference', 'REST'],
      createdAt: '2024-01-01'
    },
    {
      id: 'bm2',
      title: 'GraphQL Guide',
      url: 'https://graphql.org',
      tags: ['graphql', 'api', 'query', 'mutation', 'schema'],
      createdAt: '2024-01-02'
    }
  ]
};

console.log('=== Test 1: Export to CSV ===');
const csvOutput = toCSV(testData);
console.log(csvOutput);

console.log('\n=== Test 2: Parse CSV back ===');
const parsedData = parseCSV(csvOutput);
console.log('Parsed bookmarks:');
parsedData.bookmarks.forEach(bm => {
  console.log(`  ${bm.title}: tags = [${bm.tags.join(', ')}]`);
});

console.log('\n=== Test 3: CSV Template ===');
const template = getCSVTemplate();
console.log('Template first few lines:');
console.log(template.split('\n').slice(0, 5).join('\n'));