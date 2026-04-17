#!/usr/bin/env python3
"""
Self-Correcting Agent for Forge React Native Project

This agent monitors GitHub Actions workflow runs, analyzes failures,
and suggests fixes using OpenAI's API.
"""

import os
import json
import sys
from typing import Optional
from openai import OpenAI

def load_prompt_template(prompt_file: str) -> str:
    """Load the prompt template from a file."""
    try:
        with open(prompt_file, "r") as f:
            return f.read()
    except FileNotFoundError:
        print(f"[ERROR] Prompt file not found: {prompt_file}")
        sys.exit(1)

def analyze_logs_with_ai(logs: str, prompt_template: str) -> Optional[str]:
    """
    Send logs to OpenAI and get fix suggestions.
    
    Args:
        logs: The workflow logs to analyze
        prompt_template: The prompt template with placeholders
        
    Returns:
        The AI-generated fix suggestion or None if error occurs
    """
    client = OpenAI()
    
    # Construct the prompt for the LLM
    prompt = prompt_template.format(logs=logs)

    try:
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert DevOps engineer and React Native developer. "
                               "Analyze GitHub Actions logs and provide clear, actionable fixes for build failures."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=2048,
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"[ERROR] Failed to call OpenAI API: {e}")
        return None

def read_workflow_logs(log_file: str) -> Optional[str]:
    """Read workflow logs from a file."""
    try:
        with open(log_file, "r") as f:
            return f.read()
    except FileNotFoundError:
        print(f"[WARNING] Log file not found: {log_file}")
        return None

def save_analysis_result(result: str, output_file: str = "analysis_result.md") -> None:
    """Save the analysis result to a file."""
    try:
        with open(output_file, "w") as f:
            f.write("# Self-Correction Analysis Result\n\n")
            f.write(result)
        print(f"[INFO] Analysis result saved to {output_file}")
    except Exception as e:
        print(f"[ERROR] Failed to save analysis result: {e}")

def main():
    """Main entry point for the self-correcting agent."""
    print("[INFO] Starting Forge Self-Correcting Agent...")
    
    # Determine the base directory
    base_dir = os.path.dirname(os.path.abspath(__file__))
    prompt_file = os.path.join(base_dir, "self_correcting_prompt.txt")
    
    # Try to read logs from environment or file
    log_content = None
    
    # Check if logs are provided as environment variable
    if "WORKFLOW_LOGS" in os.environ:
        log_content = os.environ["WORKFLOW_LOGS"]
        print("[INFO] Using logs from WORKFLOW_LOGS environment variable")
    else:
        # Try to read from a file
        log_file = os.path.join(base_dir, "workflow_logs.txt")
        if os.path.exists(log_file):
            log_content = read_workflow_logs(log_file)
            print(f"[INFO] Loaded logs from {log_file}")
        else:
            print(f"[WARNING] No logs found. Expected either WORKFLOW_LOGS env var or {log_file}")
            print("[INFO] Using example logs for demonstration...")
            log_content = """
            Error: Build failed with exit code 1
            Error: Gradle build failed
            Error: Missing dependency: @react-native-community/cli
            Error: Java version mismatch
            """
    
    if not log_content:
        print("[ERROR] No logs available for analysis")
        sys.exit(1)
    
    # Load prompt template
    prompt_template = load_prompt_template(prompt_file)
    
    # Analyze logs
    print("[INFO] Analyzing logs with AI...")
    fix_suggestion = analyze_logs_with_ai(log_content, prompt_template)
    
    if fix_suggestion:
        print("\n" + "="*80)
        print("SELF-CORRECTION ANALYSIS RESULT")
        print("="*80)
        print(fix_suggestion)
        print("="*80 + "\n")
        
        # Save result
        save_analysis_result(fix_suggestion)
    else:
        print("[ERROR] Failed to generate fix suggestions")
        sys.exit(1)

if __name__ == "__main__":
    main()
