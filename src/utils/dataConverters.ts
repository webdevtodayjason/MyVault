// Data conversion utilities for export/import functionality

interface App {
  id: string;
  name: string;
  description: string;
  url?: string;
  apiKeyId?: string;
  createdAt: string;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

interface Bookmark {
  id: string;
  title: string;
  url: string;
  tags: string[];
  createdAt: string;
}

interface ExportData {
  apps: App[];
  apiKeys: ApiKey[];
  bookmarks: Bookmark[];
}

// Convert data to JSON format
export const toJSON = (data: ExportData): string => {
  return JSON.stringify(data, null, 2);
};

// Convert data to Markdown format
export const toMarkdown = (data: ExportData): string => {
  let markdown = '# AI & API Manager Export\n\n';
  markdown += `*Exported on ${new Date().toLocaleString()}*\n\n`;
  
  // Apps section
  markdown += '## AI Applications\n\n';
  if (data.apps.length > 0) {
    markdown += '| Name | Description | URL | API Key ID | Created |\n';
    markdown += '|------|-------------|-----|------------|----------|\n';
    data.apps.forEach(app => {
      markdown += `| ${app.name} | ${app.description} | ${app.url || 'N/A'} | ${app.apiKeyId || 'N/A'} | ${app.createdAt} |\n`;
    });
  } else {
    markdown += '*No applications*\n';
  }
  markdown += '\n';
  
  // API Keys section
  markdown += '## API Keys\n\n';
  if (data.apiKeys.length > 0) {
    markdown += '| Name | Key | Status | Last Used | Created |\n';
    markdown += '|------|-----|--------|-----------|----------|\n';
    data.apiKeys.forEach(key => {
      const maskedKey = key.key.substring(0, 8) + '...' + key.key.substring(key.key.length - 4);
      markdown += `| ${key.name} | ${maskedKey} | ${key.isActive ? 'Active' : 'Inactive'} | ${key.lastUsed || 'Never'} | ${key.createdAt} |\n`;
    });
  } else {
    markdown += '*No API keys*\n';
  }
  markdown += '\n';
  
  // Bookmarks section
  markdown += '## Bookmarks\n\n';
  if (data.bookmarks.length > 0) {
    markdown += '| Title | URL | Tags | Created |\n';
    markdown += '|-------|-----|------|----------|\n';
    data.bookmarks.forEach(bookmark => {
      markdown += `| ${bookmark.title} | ${bookmark.url} | ${bookmark.tags.join(', ')} | ${bookmark.createdAt} |\n`;
    });
  } else {
    markdown += '*No bookmarks*\n';
  }
  
  return markdown;
};

// Convert data to CSV format
export const toCSV = (data: ExportData): string => {
  let csv = '';
  
  // CSV Header - using pipe (|) delimiter for tags
  csv += 'Type,Name,Description,URL,API Key ID,Tags (pipe-separated),Key,Status,Last Used,Created\n';
  
  // Add apps
  data.apps.forEach(app => {
    const row = [
      'Application',
      escapeCSV(app.name),
      escapeCSV(app.description),
      escapeCSV(app.url || ''),
      escapeCSV(app.apiKeyId || ''),
      '', // No tags for apps
      '', // No key for apps
      '', // No status for apps
      '', // No last used for apps
      escapeCSV(app.createdAt)
    ];
    csv += row.join(',') + '\n';
  });
  
  // Add API keys
  data.apiKeys.forEach(key => {
    const row = [
      'API Key',
      escapeCSV(key.name),
      '', // No description for keys
      '', // No URL for keys
      '', // No API Key ID for keys
      '', // No tags for keys
      escapeCSV(key.key),
      key.isActive ? 'Active' : 'Inactive',
      escapeCSV(key.lastUsed || ''),
      escapeCSV(key.createdAt)
    ];
    csv += row.join(',') + '\n';
  });
  
  // Add bookmarks - using pipe delimiter for multiple tags
  data.bookmarks.forEach(bookmark => {
    const row = [
      'Bookmark',
      escapeCSV(bookmark.title),
      '', // No description for bookmarks
      escapeCSV(bookmark.url),
      '', // No API Key ID for bookmarks
      bookmark.tags.join('|'), // Use pipe delimiter for tags
      '', // No key for bookmarks
      '', // No status for bookmarks
      '', // No last used for bookmarks
      escapeCSV(bookmark.createdAt)
    ];
    csv += row.join(',') + '\n';
  });
  
  return csv;
};

// Helper function to properly escape CSV values
function escapeCSV(value: string): string {
  // If value contains comma, newline, or quote, wrap in quotes
  if (value.includes(',') || value.includes('\n') || value.includes('"')) {
    // Escape quotes by doubling them
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

// Generate CSV template
export const getCSVTemplate = (): string => {
  return `"Type","Name","Description","URL","API Key ID","Tags","Key","Status","Last Used","Created"
"Application","Sample App","This is a sample application","https://example.com","","",,,,"2024-01-01"
"API Key","Sample Key","","","","","sk_test_123456","Active",,"2024-01-01"
"Bookmark","Sample Bookmark","","https://docs.example.com","","documentation,reference,tutorial",,,,"2024-01-01"
"AI/LLM","OpenAI GPT-4","Advanced language model API","https://platform.openai.com/","sk-***************","ai,llm,gpt,language-model",,,,"2024-01-01"
"WordPress Theme","DIVI","Popular WordPress theme and page builder","https://www.elegantthemes.com/","***************","wordpress,theme,website-builder",,,,"2024-01-01"

# Instructions:
# - Type: Can be generic (Application, API Key, Bookmark) or specific (AI/LLM, WordPress Theme, etc.)
# - Name/Title: Required for all types
# - Description: Optional, recommended for Applications
# - URL: Optional for Applications, Required for Bookmarks
# - API Key ID: If present, will create both an App and linked API Key
# - Tags: Optional, comma-separated within quotes or pipe-separated
# - Key: For standalone API Keys only
# - Status: For API Keys (Active or Inactive)
# - Last Used: Optional, only for API Keys
# - Created: Optional, will use current date if not provided

# Import Notes:
# - Entries with API Key ID will create both an Application and a linked API Key
# - Custom types (like AI/LLM, WordPress Plugin) will be included in the description
# - Tags can be comma-separated (within quotes) or pipe-separated
# - Use quotes around ALL values to handle commas properly
# - Masked API keys (like ***************) are accepted`;
};

// Parse CSV to data
export const parseCSV = (csvText: string): ExportData => {
  const lines = csvText.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  const headers = lines[0].split(',');
  
  const apps: App[] = [];
  const apiKeys: ApiKey[] = [];
  const bookmarks: Bookmark[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < headers.length) continue;
    
    const type = values[0];
    const name = values[1];
    const description = values[2];
    const url = values[3];
    const apiKeyId = values[4];
    const tags = values[5];
    const key = values[6];
    const status = values[7];
    const lastUsed = values[8];
    const created = values[9] || new Date().toISOString().split('T')[0];
    
    const typeLower = type.toLowerCase();
    
    // Determine item type based on Type column
    if (typeLower === 'api key') {
      // It's explicitly an API key
      apiKeys.push({
        id: generateId(),
        name,
        key: key || '***************', // Use placeholder if key is masked
        isActive: status ? status.toLowerCase() === 'active' : true,
        lastUsed: lastUsed || undefined,
        createdAt: created
      });
    } else if (typeLower === 'bookmark') {
      // It's a bookmark if explicitly marked as such
      // Support both pipe-delimited and comma-delimited tags
      let tagArray: string[] = [];
      if (tags) {
        // Check if tags contain pipe delimiter (our export format)
        if (tags.includes('|')) {
          tagArray = tags.split('|').map(t => t.trim());
        } else {
          // Otherwise treat as comma-separated (standard CSV format)
          tagArray = tags.split(',').map(t => t.trim());
        }
      }
      bookmarks.push({
        id: generateId(),
        title: name,
        url,
        tags: tagArray,
        createdAt: created
      });
    } else {
      // Everything else is treated as an Application
      // This includes custom types like "WordPress Theme", "AI/LLM", etc.
      
      // If it has an API Key ID (even if masked), create both an API key and an app
      if (apiKeyId && apiKeyId.trim() !== '') {
        // Generate a unique key ID
        const keyId = generateId();
        
        // Create the API key
        apiKeys.push({
          id: keyId,
          name: `${name} API Key`,
          key: apiKeyId, // This will be the masked value like ***************
          isActive: true,
          lastUsed: undefined,
          createdAt: created
        });
        
        // Create the application with reference to the key
        const enhancedDescription = typeLower !== 'application' && type ? 
          `${type}: ${description || ''}`.trim() : 
          description;
          
        apps.push({
          id: generateId(),
          name,
          description: enhancedDescription,
          url: url || undefined,
          apiKeyId: keyId, // Link to the created API key
          createdAt: created
        });
      } else {
        // No API key, just create the application
        const enhancedDescription = typeLower !== 'application' && type ? 
          `${type}: ${description || ''}`.trim() : 
          description;
          
        apps.push({
          id: generateId(),
          name,
          description: enhancedDescription,
          url: url || undefined,
          apiKeyId: undefined,
          createdAt: created
        });
      }
    }
  }
  
  return { apps, apiKeys, bookmarks };
};

// Parse CSV line handling quoted values
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < line.length) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        // Double quote inside quotes - add single quote
        current += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  
  values.push(current);
  return values.map(v => v.trim());
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

// Download file
export const downloadFile = (content: string, filename: string, type: string = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};