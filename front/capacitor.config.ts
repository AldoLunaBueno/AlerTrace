import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.906868ae8fd24773be3141aac1e9d836',
  appName: 'TARPUQKUNA Dashboard',
  webDir: 'dist',
  server: {
    url: 'https://906868ae-8fd2-4773-be31-41aac1e9d836.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#2D5F3F",
      showSpinner: false
    }
  }
};

export default config;