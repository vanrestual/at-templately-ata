import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'my-workspace': resolve(__dirname, 'my-workspace.html'),
        'shared-workspace': resolve(__dirname, 'shared-workspace.html'),
        addons: resolve(__dirname, 'addons.html'),
        'manage-apis': resolve(__dirname, 'manage-apis.html'),
        profile: resolve(__dirname, 'profile/index.html'),
        'profile/change-password': resolve(__dirname, 'profile/change-password.html'),
        'profile/payment-methods': resolve(__dirname, 'profile/payment-methods.html'),
        'profile/my-favorites': resolve(__dirname, 'profile/my-favorites.html'),
        'profile/my-downloads': resolve(__dirname, 'profile/my-downloads.html'),
        subscriptions: resolve(__dirname, 'subscriptions.html'),
        'payment-history': resolve(__dirname, 'payment-history.html'),
        help: resolve(__dirname, 'help.html')
      }
    }
  }
});
