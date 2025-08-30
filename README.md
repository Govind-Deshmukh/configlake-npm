# Config Lake - Node.js Client

Simple Node.js client for Config Lake - fetch and decrypt configurations and secrets.

## Installation

```bash
npm install configlake
```

## Usage

### JavaScript (CommonJS)

```javascript
const { getConfig, getSecrets, getAllDetails } = require('configlake');

const API_URL = "http://localhost:5000";
const TOKEN = "your-api-token";
const PROJECT_ID = 1;
const ENVIRONMENT = "production";

// Get only configurations
const configs = await getConfig(API_URL, TOKEN, PROJECT_ID, ENVIRONMENT);
console.log(configs); // {"DATABASE_URL": "postgresql://..."}

// Get only secrets (decrypted)
const secrets = await getSecrets(API_URL, TOKEN, PROJECT_ID, ENVIRONMENT);
console.log(secrets); // {"API_KEY": "secret-value"}

// Get everything (configs + decrypted secrets)
const allData = await getAllDetails(API_URL, TOKEN, PROJECT_ID, ENVIRONMENT);
console.log(allData);
// {
//   "configs": {"DATABASE_URL": "postgresql://..."},
//   "secrets": {"API_KEY": "secret-value"},
//   "project_id": 1,
//   "environment": "production"
// }
```

### TypeScript

```typescript
import { getConfig, getSecrets, getAllDetails } from 'configlake';

const API_URL = "http://localhost:5000";
const TOKEN = "your-api-token";
const PROJECT_ID = 1;
const ENVIRONMENT = "production";

const allData = await getAllDetails(API_URL, TOKEN, PROJECT_ID, ENVIRONMENT);
console.log(allData.configs.DATABASE_URL);
console.log(allData.secrets.API_KEY);
```

## Functions

### `getConfig(apiUrl, token, projectId, environment)`
Returns promise that resolves to object with plain-text configurations.

### `getSecrets(apiUrl, token, projectId, environment)`
Returns promise that resolves to object with decrypted secrets.

### `getAllDetails(apiUrl, token, projectId, environment)`
Returns promise that resolves to object with both configs and decrypted secrets.

## Requirements

- Node.js >= 14.0.0
- `axios`

## License

MIT License