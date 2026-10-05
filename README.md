# AWS Community Day Pakistan

Welcome to the official repository for the AWS Community Pakistan website! 

## Live Website
The website is currently served live at **[awscommunity.pk](https://awscommunity.pk)**. 

## Deployment & Cache Invalidation
This repository is configured with a fully automated CI/CD pipeline using GitHub Actions. 
Whenever new changes are merged or pushed to the `main` branch, the pipeline automatically:
1. Syncs the updated static files to our secure hosting environment.
2. **Automatically invalidates the CDN cache** across all global edge locations. 

This means you do not have to worry about stale or old data—your new changes and previews will automatically be live for everyone within just a few minutes after the pipeline finishes running!

## Contributing
We welcome contributions from the community! If you'd like to help improve the website, please read our [Contributing Guidelines](CONTRIBUTING.md) to understand how you can fork the repository, make your changes, and submit a pull request.
 
