import { defineConfig } from 'vite'import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'import react from '@vitejs/plugin-react'



export default defineConfig({// https://vite.dev/config/

  plugins: [react()],export default defineConfig({

  server: {  plugins: [react()],

    host: '0.0.0.0',  

    port: 5173,  //Docker compatibility

    watch: {  server: {

      usePolling: true    host: '0.0.0.0',

    }    port: 5173,

  }    watch: {

})      usePolling: true,

    },
  },
})
