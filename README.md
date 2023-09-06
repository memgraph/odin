[![react](https://img.shields.io/badge/React-61DBFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![typescript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![styledcomponents](https://img.shields.io/badge/styled_components-DB7093?style=for-the-badge&logo=styledcomponents&logoColor=white)](https://styled-components.com/)

[![obsidian](https://img.shields.io/badge/obsidian-7C3AED?style=for-the-badge&logo=obsidian&logoColor=white)](https://obsidian.md/)
[![docker](https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

# ODIN - Obsidian Driven Information Network

## Disclaimer

> **Warning**
> It is recommended that you have access to GPT-4 via the OpenAI API. GPT-3.5 will probably fail to make correct knowledge graphs from your data.
> Since we still don't have access to GPT-4 OpenAI API, although we made our account a month ago and generated >1$ in billing a week ago,
> the `init_repo`, `update_file` and `add_file` endpoints are still untested. We initialized knowledge graphs manually, through ChatGPT.
> **Here be dragons.**

## Prerequisites

Before you begin, make sure you have the following:

- Obsidian installed on your system.
- An active Obsidian vault.

## Installation

1. **Download the Plugin:**

    - Clone the repository inside the plugins folder (your_vault/.obsidian/plugins) using Git:
      ```
      git clone https://github.com/memgraph/odin.git
      ```    

2. **Install Dependencies and Start the Plugin:**

    - Open your terminal or command prompt.
    - Navigate to the plugin's root directory:
      ```
      cd odin
      ```
    - You have the option to install ODIN using Docker, which will automatically install, set up and run the Memgraph database, the backend, and frontend components, or you can manually run the project locally for a more customized setup or if you already have Memgraph up and running.
      ### Docker installation

      Before you start, make sure you have a running [Docker](https://www.docker.com/) instance and [Docker compose](https://docs.docker.com/compose/install/) installed.

      1. You will need to create a `.env` file inside the ODIN folder with your OpenAI API key to access the app features. It should look like this:
        ```
        OPENAI_API_KEY=YOUR_API_KEY
        ```
        Where YOUR_API_KEY is a key you can get [here](https://openai.com/).

      2. Run:
        ```
        docker compose up
        ```

        It will take up to ten minutes to download and run all dependencies. Now, that you have ODIN successfully installed, you can go to the next step.

      ### Manual installation

      1. Install the required Node.js dependencies:
        ```
        npm install
        ```

      2. Start the development build:
        ```
        npm run dev
        ```

        You now have the app frontend up and running.

      3. You will also need to run the [Memgraph](https://memgraph.com/docs/memgraph/installation) database and the application backend by following the installation steps for [BOR](https://github.com/memgraph/bor) - backend for Obsidian and Rune.

4. **Disable Restricted Mode:**

    - In the Obsidian settings, navigate to "Options."
    - Click on the "Community plugins" tab.
    - Click the "Turn on community plugins" button.

5. **Enable the Plugin:**

    - If you don't see ODIN in the list, try reloading Obsidian.
    - Navigate back to the "Community plugins" section in the Obsidian settings.
    - Find "ODIN" in the list of plugins.
    - Toggle the switch next to the plugin name to enable it.

6. **Plugin Usage:**

    - The ODIN plugin is now installed and active. You can access its features through the Obsidian interface.

## Features

Most features are accessible through the `Graph Prompt view` button in the menu opened by clicking the `Expand` button in the right upper corner of Obsidian.

1. Prompt Bar for LLM Queries

- ODIN integrates Large Language Models (LLMs) into Obsidian using LangChain, allowing you to ask questions about the data stored in your knowledge graph right from the prompt bar.
  
2. Graph Visualization

- `Vault view` will give you a comprehensive understanding of your notes and knowledge by visualizing your entire Obsidian vault as a dynamic knowledge graph.
- Switch between `Vault view` and `File view` to get a detailed visualization of specific files.
- By clicking nodes in the `File view` you will get highlighted sentences thematically connected to that node in your editor.

3. Dropdown Menu Functions

Right click on the highlighted text in the editor to access the following features:

- **Generate questions**: Extract thought-provoking questions from your markdown files, encouraging deeper contemplation and critical thinking.

- **Link prediction**: Automatically generate links to other markdown files in your vault that are thematically connected to the highlighted text, enriching your notes with relevant references.

- **Node suggestion**: Access thematically connected nodes related to the highlighted text, fostering meaningful connections and comprehensive understanding of your information.
