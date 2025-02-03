# DHIS2 MCCOD-Local (MCCoD React)

This is the frontend application for the offline first version of the DHIS2 Medical Certificate Cause of Death (MCCoD) system.

## Setup and Installation

1. **Clone the repository:**
  ```bash
   git clone git@github.com:nomisrmugisa/mccod-react.git
   cd mccod-react
  ```

2. **Install dependencies:**
  ```bash
   npm install
  ```

3. **Run the development server:**
  ```bash
   npm run dev
  ```

   The app will be available at `http://localhost:5173`.

## Vite Specifics

- **Start development server:**  
```bash
  npm run dev
``` 
will start the Vite development server and serve the app.

- **Build the project for production:**  
```bash
  npm run build
``` 
will create a production-ready version of the app.

- **Preview the build:**  
  After building, you can preview it by running:
```bash
  npm run preview
```

## Notes

- This project uses **Vite** for fast development and bundling.
- **Dexie.js** is used for client-side database management (event storage).
