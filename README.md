# ODIN - Obsidian Driven Information Network

## Disclaimer

> **Warning**
> It is recommended that you have access to GPT-4 via the OpenAI API. GPT-3.5 will probably fail to make correct knowledge graphs from your data.
> Since we still don't have access to GPT-4 OpenAI API, although we made our account a month ago and generated >1$ in billing a week ago,
> the `init_repo`, `update_file` and `add_file` endpoints are still untested. We initialized knowledge graphs manually, through ChatGPT.
> **Here be dragons.**

## Manual DEV installation

### Prerequisites

Before you begin, make sure you have the following:

- An active Obsidian vault.
- Obsidian installed on your system.
- Node.js and npm (Node Package Manager) installed on your system.

### Installation

1. **Download the Plugin:**

    - Clone the repository inside the plugins folder using Git:
      ```
      git clone https://github.com/memgraph/magic-graph-obsidian.git
      ```

2. **Install Dependencies and Start the Plugin:**

    - Open your terminal or command prompt.
    - Navigate to the plugin's root directory:
      ```
      cd magic-graph-obsidian
      ```
      1. If you want to run ODIN via Docker, do:
          ```
          docker compose up
          ```
      2. If you want to run ODIN locally:
        - Install the required Node.js dependencies:
          ```
          npm install
          ```
        - Start the development build:
          ```
          npm run dev
          ````

4. **Disable Restricted Mode:**

    - In the Obsidian settings, navigate to "Options."
    - Click on the "Community plugins" tab.
    - Click "Turn on community plugins" button.

5. **Enable the Plugin:**

    - If you don't see ODIN in the list, try reloading Obsidian.
    - Navigate back to the "Community plugins" section in the Obsidian settings.
    - Find "ODIN" in the list of plugins.
    - Toggle the switch next to the plugin name to enable it.

6. **Plugin Usage:**

    - The [Your Plugin Name] plugin is now installed and active. You can access its features through the Obsidian interface as per the plugin's documentation.
