# Self-Correcting Agents for Forge

This directory contains the self-learning and self-correcting agents that automatically analyze build failures and suggest fixes for the Forge React Native project.

## Overview

The self-correcting agent system is designed to:
- Monitor GitHub Actions workflow runs for failures
- Analyze error logs using AI (OpenAI API)
- Suggest code fixes and configuration changes
- Create automated issues or pull requests with recommendations

## Components

### `self_correcting_agent.py`
The main Python script that:
1. Fetches failed workflow logs from GitHub Actions
2. Sends logs to OpenAI's API for analysis
3. Generates fix suggestions based on the prompt template
4. Returns actionable recommendations

### `self_correcting_prompt.txt`
The prompt template used to guide the AI in analyzing logs and suggesting fixes. This file contains the system instructions for the agent.

## Usage

### Manual Execution
```bash
python self_correcting_agent.py
```

### Automated Execution
The agent is automatically triggered by the `auto-correct.yml` GitHub Actions workflow when a build fails. The workflow:
1. Waits for the "Build Android APK" workflow to complete
2. If it fails, downloads the logs
3. Runs the self-correcting agent
4. Creates an issue with the analysis and suggestions

## Configuration

### Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key (set in GitHub Secrets)

### GitHub Secrets Required
1. `OPENAI_API_KEY`: API key for OpenAI (or compatible service)

## Future Enhancements

- **Auto-Fix Mode**: Automatically create pull requests with suggested fixes
- **Learning System**: Track which fixes work and improve suggestions over time
- **Multi-Model Support**: Use different AI models for different types of errors
- **Slack Integration**: Send notifications to Slack when fixes are suggested
- **Rollback Detection**: Automatically detect and revert bad fixes

## Troubleshooting

### Agent not running
- Check that `OPENAI_API_KEY` is set in GitHub Secrets
- Verify that the `auto-correct.yml` workflow is enabled
- Check the Actions tab in GitHub for workflow logs

### Poor fix suggestions
- Update the `self_correcting_prompt.txt` with more specific instructions
- Provide example logs and expected fixes to the prompt
- Consider using a more capable AI model

## Contributing

To improve the self-correcting agent:
1. Update the prompt in `self_correcting_prompt.txt`
2. Add new analysis functions to `self_correcting_agent.py`
3. Test with real failed builds
4. Document changes and submit a pull request
