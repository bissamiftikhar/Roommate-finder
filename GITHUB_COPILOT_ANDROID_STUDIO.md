# Using GitHub Copilot (GitHub Pro Agents) in Android Studio

GitHub Copilot is available as a plugin for Android Studio, giving you AI-powered code completions, chat assistance, and agentic coding features directly inside the IDE.

---

## Prerequisites

- A **GitHub account** with an active **GitHub Copilot** subscription (included with GitHub Pro, GitHub Team, and GitHub Enterprise Cloud, as well as verified students/teachers via GitHub Education).
- **Android Studio** (Hedgehog 2023.1.1 or later recommended).
- Internet access so the IDE can reach GitHub's Copilot service.

---

## Step 1 – Install the GitHub Copilot Plugin

1. Open Android Studio.
2. Go to **File → Settings** (Windows/Linux) or **Android Studio → Settings** (macOS).
3. Select **Plugins** in the left sidebar.
4. Click the **Marketplace** tab and search for **GitHub Copilot**.
5. Click **Install**, then restart Android Studio when prompted.

---

## Step 2 – Sign In to GitHub

1. After restarting, go to **Tools → GitHub Copilot → Login to GitHub**.
2. A browser window will open. Sign in to your GitHub account and **authorize** the Copilot plugin.
3. Return to Android Studio — you should see a Copilot icon in the status bar, confirming the connection.

---

## Step 3 – Use Copilot Completions

Once signed in, Copilot automatically suggests code as you type:

- **Inline suggestions** appear in grey text — press `Tab` to accept.
- Press `Alt+]` / `Alt+[` (Windows/Linux) or `Option+]` / `Option+[` (macOS) to cycle through alternative suggestions.
- Press `Escape` to dismiss a suggestion.

---

## Step 4 – Use Copilot Chat (GitHub Pro Agents)

Copilot Chat is the conversational AI agent built into the plugin:

1. Go to **View → Tool Windows → GitHub Copilot Chat** (or click the chat icon in the sidebar).
2. Type a question or request in natural language, for example:
   - *"Explain what this function does"*
   - *"Write a unit test for this class"*
   - *"Refactor this code to use coroutines"*
3. Copilot will respond with an explanation and/or code suggestions that you can insert directly into your editor.

### Useful slash commands in Chat

| Command | What it does |
|---------|--------------|
| `/explain` | Explains selected code |
| `/fix` | Suggests a fix for highlighted errors |
| `/tests` | Generates unit tests for selected code |
| `/doc` | Writes documentation comments |

---

## Step 5 – Inline Chat (Ask Copilot in the Editor)

For quick, context-aware help without leaving the file:

1. Select a block of code.
2. Right-click → **GitHub Copilot → Explain This** (or another action).
3. A response panel appears inline.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Copilot is not enabled for your account" | Verify your GitHub plan includes Copilot at [github.com/settings/copilot](https://github.com/settings/copilot) |
| Suggestions not appearing | Check your internet connection; ensure the plugin is enabled under **Settings → Plugins** |
| Plugin outdated | Update via **Settings → Plugins → Installed → GitHub Copilot → Update** |
| Sign-in loop | Log out via **Tools → GitHub Copilot → Log Out**, then sign in again |

---

## Additional Resources

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [GitHub Copilot in JetBrains IDEs](https://docs.github.com/en/copilot/using-github-copilot/using-github-copilot-in-your-ide?tool=jetbrains)
- [GitHub Education (free Copilot for students)](https://education.github.com/)
