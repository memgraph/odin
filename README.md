# ODIN - Obsidian Driven Information Network

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
    - Install the required Node.js dependencies:
      ```
      npm install
      ```
    - Start the development build:
      ```
      npm run dev
      ```

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
