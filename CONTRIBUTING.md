# Contributing to @infoset/react-native

First off, thank you for considering contributing to `@infoset/react-native`! We welcome any type of contribution, from reporting bugs and suggesting enhancements to submitting pull requests for new features or improvements.

## How to Contribute

### Reporting Bugs

If you find a bug, please ensure the bug was not already reported by searching on GitHub under [Issues](https://github.com/Infoset/infoset-react-native/issues). If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/Infoset/infoset-react-native/issues/new). Be sure to include a **title and description**, as much relevant information as possible, and a **code sample or an executable test case** demonstrating the expected behavior that is not occurring.

### Suggesting Enhancements

If you have an idea for an enhancement, feel free to open an issue to discuss it. Please provide a clear description of the enhancement and why it would be beneficial.

### Code Contributions

1.  **Fork the Repository:** Fork the [Infoset/infoset-react-native](https://github.com/Infoset/infoset-react-native) repo on GitHub.
2.  **Clone Your Fork:** Clone your forked repository to your local machine.
    ```bash
    git clone [https://github.com/YOUR_USERNAME/infoset-react-native.git](https://github.com/YOUR_USERNAME/infoset-react-native.git)
    cd infoset-react-native
    ```
3.  **Set Up:** Install dependencies. This project uses Yarn.

    ```bash
    yarn install
    ```

    Ensure your workspace symlinks are correctly set up (especially if you encountered issues previously).

4.  **Create a Branch:** Create a new branch for your changes.
    ```bash
    git checkout -b feature/your-feature-name
    # or
    git checkout -b fix/your-bug-fix-name
    ```
5.  **Make Changes:** Implement your feature or bug fix in the `src/` directory.
    - **Code Style:** Ensure your code adheres to the project's coding standards. We use ESLint and Prettier. You can format your code and check for linting issues using:
      ```bash
      yarn lint
      # To attempt to fix lint issues automatically:
      # yarn lint --fix
      # (Ensure your eslint.config.mjs or equivalent is set up for --fix)
      # Or run Prettier directly:
      # npx prettier --write "src/**/*.{ts,tsx}" "example/**/*.{ts,tsx}"
      ```
    - **Tests:** If you add new functionality, please include tests. Run tests using:
      ```bash
      yarn test
      ```
6.  **Build the Library:** Ensure your changes build correctly:
    ```bash
    yarn build
    ```
7.  **Test with Example App:** Test your changes thoroughly using the `example` application.

    ```bash
    # For the library's build watcher (run in one terminal, optional for quick tests after manual build)
    # yarn watch:build

    # For the example app (run in another terminal, from root)
    yarn example:expo start
    ```

8.  **Commit Changes:** Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for your commit messages. This project uses `commitlint` (configured via `commitlint.config.js` or in `package.json`) to enforce this.
    - Example commit messages:
      - `feat: Add new onFooBar callback`
      - `fix: Correctly handle null visitor data`
      - `docs: Update README with new prop information`
      - `chore: Upgrade ESLint dependency`
      - `refactor: Improve animation logic`
      - `test: Add unit tests for visitor utils`
9.  **Push Changes:** Push your changes to your forked repository.
    ```bash
    git push origin feature/your-feature-name
    ```
10. **Submit a Pull Request:** Open a pull request from your fork to the `main` branch of the `Infoset/infoset-react-native` repository. Provide a clear description of your changes and link any related issues.

## Development Environment

- Ensure you have a working React Native development environment set up (Node.js, Yarn, Watchman, JDK, Android Studio, Xcode as needed).
- The library code is in the `src/` directory.
- The build output goes to the `lib/` directory.
- The `react-native-builder-bob` tool is used for building the library.

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project, you agree to abide by its terms. (Consider adding a `CODE_OF_CONDUCT.md` file, perhaps based on the [Contributor Covenant](https://www.contributor-covenant.org/)).

## Questions?

Feel free to open an issue if you have any questions or need further clarification on the contribution process.
