# Libraries required for developing a Telegram Mini App

### Install
```sh
bun add github:ywwwtseng/libs @tonconnect/ui @telegram-apps/sdk-react
```

### Setup
```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TMAProvider } from '@libs/tma';
import { en } from '@/locales/en';
import { zh } from '@/locales/zh';
import App from '@/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TMAProvider
      // Mock Mode: Use Fake LaunchParams
      mock={process.env.NODE_ENV === 'development'}
      // API Url
      baseUrl='http://localhost:3000'
      // I18n Locales
      locales={{ en, zh }}
    >
      <App />
    </TMAProvider>
  </StrictMode>,
);
```

### I18n
```tsx
import { useTMA, Typography } from '@libs/tma';
// common.count: "Count: {count}"

const { t } = useTMA();

t('common.count', { count: 1 });

<Typography
  ...
  i18n="common.count"
  params={{ count: 1 }}
/>
```
### LaunchParams
```tsx
import { useTMA } from '@libs/tma';

const { user, platform } = useTMA();
```

### State Management
```tsx
import { useTMA } from '@libs/tma';

const { state, mutation } = useTMA();
// Get language_code
state.meta.language_code
// Update language_code
mutation('update:state.meta.language_code', 'en');
// Execute reward action
mutation('action:reward', { task_type: 0 });
```

### TonConnect
```ts
import { useTMA } from '@libs/tma';

const { tonConnect } = useTMA();

// Wallet info
tonConnect?.wallet;
// Wallet connected        
tonConnect?.connected;
// Connect wallet     
tonConnect?.connect();    
// Disconnect wallet
tonConnect?.disconnect();
// Send transaction
const { boc } = await tonConnect?.sendTransaction({
  address: ...,
  amount: String(ton * 1e9),
});
```