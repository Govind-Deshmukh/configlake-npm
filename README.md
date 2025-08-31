# ConfigLake Node.js Client

Official Node.js/TypeScript client library for ConfigLake - the centralized configuration and secrets management platform.

## What is ConfigLake?

ConfigLake helps you manage environment variables, API keys, database connections, and other sensitive configuration data across different environments (dev, staging, prod) in one secure dashboard.

## Installation

```bash
npm install configlake
```

## Quick Start

### Basic Usage

```javascript
import { getConfig, getSecrets, getAllDetails } from 'configlake';

// Setup connection details
const API_URL = "http://localhost:5000";
const TOKEN = "your-api-token";
const PROJECT_ID = 1;
const ENVIRONMENT = "production";

// Get only configurations (non-sensitive data)
const configs = await getConfig(API_URL, TOKEN, PROJECT_ID, ENVIRONMENT);
const databaseUrl = configs.DATABASE_URL;
const apiEndpoint = configs.API_ENDPOINT;

// Get only secrets (automatically decrypted)
const secrets = await getSecrets(API_URL, TOKEN, PROJECT_ID, ENVIRONMENT);  
const apiKey = secrets.API_KEY;
const jwtSecret = secrets.JWT_SECRET;

// Get everything together
const data = await getAllDetails(API_URL, TOKEN, PROJECT_ID, ENVIRONMENT);
console.log('Configs:', data.configs);
console.log('Secrets:', data.secrets);
```

### TypeScript Support

Full TypeScript support with proper type definitions:

```typescript
import { getConfig, getSecrets, getAllDetails } from 'configlake';

interface MyConfig {
  DATABASE_URL: string;
  API_ENDPOINT: string;
}

interface MySecrets {
  API_KEY: string;
  JWT_SECRET: string;
}

const configs: MyConfig = await getConfig(API_URL, TOKEN, PROJECT_ID, ENVIRONMENT);
const secrets: MySecrets = await getSecrets(API_URL, TOKEN, PROJECT_ID, ENVIRONMENT);

// getAllDetails returns structured data
const allData = await getAllDetails(API_URL, TOKEN, PROJECT_ID, ENVIRONMENT);
// Type: { configs: Record<string, string>, secrets: Record<string, string>, project_id: number, environment: string }
```

### Environment-based Configuration

Organize your configuration by environment:

```javascript
class ConfigManager {
  constructor(apiUrl, token, projectId) {
    this.apiUrl = apiUrl;
    this.token = token;
    this.projectId = projectId;
  }
  
  async loadConfig(environment = 'development') {
    const data = await getAllDetails(
      this.apiUrl, 
      this.token, 
      this.projectId, 
      environment
    );
    
    // Set environment variables
    process.env.DATABASE_URL = data.configs.DATABASE_URL;
    process.env.API_KEY = data.secrets.API_KEY;
    
    return data;
  }
}

// Usage
const configManager = new ConfigManager("http://localhost:5000", "your-token", 1);

// Load development config
await configManager.loadConfig('development');

// Load production config  
await configManager.loadConfig('production');
```

## Error Handling

The client provides clear error messages for common issues:

```javascript
try {
  const configs = await getConfig(API_URL, TOKEN, PROJECT_ID, ENVIRONMENT);
} catch (error) {
  if (error.message.includes('Authentication failed')) {
    console.error('Invalid API token');
  } else if (error.message.includes('Access forbidden')) {
    console.error('Token does not have access to this project');
  } else if (error.message.includes('Resource not found')) {
    console.error('Project or environment does not exist');
  } else {
    console.error('Unexpected error:', error.message);
  }
}
```

## API Reference

### `getConfig(apiUrl, token, projectId, environment)`
**Returns**: `Promise<Record<string, string>>`  
**Description**: Retrieves plain-text configurations only.

**Example**:
```javascript
const configs = await getConfig("http://localhost:5000", "token123", 1, "production");
// Returns: { DATABASE_URL: "postgresql://...", API_ENDPOINT: "https://..." }
```

### `getSecrets(apiUrl, token, projectId, environment)`
**Returns**: `Promise<Record<string, string>>`  
**Description**: Retrieves and automatically decrypts secrets.

**Example**:
```javascript
const secrets = await getSecrets("http://localhost:5000", "token123", 1, "production");
// Returns: { API_KEY: "secret-key-123", JWT_SECRET: "jwt-secret-456" }
```

### `getAllDetails(apiUrl, token, projectId, environment)`
**Returns**: `Promise<{configs: Record<string, string>, secrets: Record<string, string>, project_id: number, environment: string}>`  
**Description**: Retrieves both configurations and secrets in a single call.

**Example**:
```javascript
const data = await getAllDetails("http://localhost:5000", "token123", 1, "production");
// Returns: {
//   configs: { DATABASE_URL: "postgresql://..." },
//   secrets: { API_KEY: "secret-key" },  
//   project_id: 1,
//   environment: "production"
// }
```

## Integration Examples

### Express.js Application

```javascript
import express from 'express';
import { getAllDetails } from 'configlake';

const app = express();

// Load configuration on startup
const config = await getAllDetails(
  "http://localhost:5000", 
  process.env.CONFIGLAKE_TOKEN,
  process.env.CONFIGLAKE_PROJECT_ID,
  process.env.NODE_ENV || 'development'
);

// Use in your app
app.listen(config.configs.PORT || 3000, () => {
  console.log('Server running with ConfigLake configuration');
});
```

### Next.js Application

```javascript
// pages/api/config.js
import { getAllDetails } from 'configlake';

export default async function handler(req, res) {
  try {
    const config = await getAllDetails(
      process.env.CONFIGLAKE_URL,
      process.env.CONFIGLAKE_TOKEN, 
      parseInt(process.env.CONFIGLAKE_PROJECT_ID),
      process.env.NODE_ENV
    );
    
    res.status(200).json({ config: config.configs }); // Don't expose secrets to frontend
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

## Requirements

- Node.js >= 14.0.0
- Dependencies: `axios` (automatically installed)

## ConfigLake Setup

To use this client, you need a running ConfigLake instance:

1. **Docker (Easiest)**:
   ```bash
   docker run -d -p 5000:5000 configlake/configlake
   ```

2. **Manual Setup**:
   ```bash
   git clone https://github.com/Govind-Deshmukh/configlake
   cd configlake
   python app.py
   ```

3. **Create API Token**: Login to the ConfigLake dashboard and generate an API token for your project/environment.

## Security Notes

- Store your ConfigLake API token securely (use environment variables, not hardcode)
- Secrets are automatically encrypted in ConfigLake and decrypted by this client
- Use HTTPS in production for the ConfigLake API URL
- Consider IP whitelisting in ConfigLake for additional security

## Links

- **ConfigLake Repository**: https://github.com/Govind-Deshmukh/configlake  
- **Docker Image**: `docker pull configlake/configlake`
- **Python Client**: `pip install configlake`

## License

MIT License