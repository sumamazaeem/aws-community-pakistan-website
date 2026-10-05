# Contributing to AWS Community Pakistan Website

First off, thank you for considering contributing to the AWS Community Pakistan website! It's people like you that make this community great.

## Code of Conduct
By participating in this project, you are expected to uphold our Code of Conduct. Please read the `codeofconduct.html` for more details.

## How to Contribute

### 1. Fork the Repository
Click the "Fork" button at the top right of this page to create your own copy of the repository.

### 2. Clone your Fork
Clone the repository to your local machine:
```bash
git clone https://github.com/your-username/aws-community-pakistan-website.git
cd aws-community-pakistan-website
```

### 3. Create a Branch
Always create a new branch for your work:
```bash
git checkout -b feature/your-feature-name
```
*(Use descriptive names like `feature/add-lahore-speakers` or `fix/typo-in-readme`)*

### 4. Make your Changes
- This is a static website consisting of HTML, CSS, and JS.
- Ensure your changes look good on both desktop and mobile devices.
- Run tests (if applicable) via `npm test` or `node --test tests/kirothon/*.test.js`.

### 5. Commit and Push
Commit your changes with a clear and descriptive commit message:
```bash
git add .
git commit -m "feat: added new speaker to the Karachi page"
git push origin feature/your-feature-name
```

### 6. Open a Pull Request
Go to the original repository on GitHub and click "Compare & pull request". Provide a clear description of the changes you've made and why they are necessary.

## CI/CD and Deployment
This repository is configured with automated GitHub Actions that deploy to AWS CloudFront upon pushing to the `main` or `upstream-snapshot` branches. 

**Note for Contributors:** 
For security reasons (using AWS OIDC), automated deployments do NOT trigger on Pull Requests from forks. Maintainers will review your PR and, once merged, the pipeline will deploy the changes to the live website.

## Need Help?
If you have any questions or need help, feel free to open an issue or reach out to the community organizers.
