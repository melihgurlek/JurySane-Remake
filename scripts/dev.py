#!/usr/bin/env python3
"""Development script for JurySane project."""

import subprocess
import sys
import os
import time
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

# Project root
PROJECT_ROOT = Path(__file__).parent.parent


def run_command(command: list[str], cwd: Path = PROJECT_ROOT, shell: bool = False) -> subprocess.Popen:
    """Run a command and return the process."""
    print(f"Running: {' '.join(command)} in {cwd}")
    return subprocess.Popen(
        command,
        cwd=cwd,
        shell=shell,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        universal_newlines=True,
        bufsize=1,
    )


def stream_output(process: subprocess.Popen, prefix: str) -> None:
    """Stream output from a process with a prefix."""
    while True:
        output = process.stdout.readline()
        if output == '' and process.poll() is not None:
            break
        if output:
            print(f"[{prefix}] {output.strip()}")


def setup_backend():
    """Set up the backend development environment."""
    backend_dir = PROJECT_ROOT / "backend"

    print("Setting up backend...")

    # Check if virtual environment exists
    venv_dir = backend_dir / "venv"
    if not venv_dir.exists():
        print("Creating virtual environment...")
        subprocess.run([sys.executable, "-m", "venv", "venv"],
                       cwd=backend_dir, check=True)

    # Install dependencies
    pip_cmd = ["venv/Scripts/pip", "install", "-e",
               ".[dev]"] if os.name == 'nt' else ["venv/bin/pip", "install", "-e", ".[dev]"]
    subprocess.run(pip_cmd, cwd=backend_dir, check=True)

    print("Backend setup complete!")


def setup_frontend():
    """Set up the frontend development environment."""
    frontend_dir = PROJECT_ROOT / "frontend"

    print("Setting up frontend...")

    # Install dependencies
    subprocess.run(["npm", "install"], cwd=frontend_dir, check=True)

    print("Frontend setup complete!")


def dev_backend():
    """Run the backend development server."""
    backend_dir = PROJECT_ROOT / "backend"
    python_cmd = "venv/Scripts/python" if os.name == 'nt' else "venv/bin/python"

    process = run_command(
        [python_cmd, "-m", "jurysane.main"],
        cwd=backend_dir
    )
    return process


def dev_frontend():
    """Run the frontend development server."""
    frontend_dir = PROJECT_ROOT / "frontend"

    process = run_command(
        ["npm", "run", "dev"],
        cwd=frontend_dir
    )
    return process


def main():
    """Main function."""
    if len(sys.argv) < 2:
        print("Usage: python scripts/dev.py [setup|backend|frontend|full]")
        sys.exit(1)

    command = sys.argv[1]

    try:
        if command == "setup":
            setup_backend()
            setup_frontend()
            print(
                "\n✅ Setup complete! Run 'python scripts/dev.py full' to start both servers.")

        elif command == "backend":
            setup_backend()
            print("\n🚀 Starting backend server...")
            process = dev_backend()
            stream_output(process, "BACKEND")

        elif command == "frontend":
            setup_frontend()
            print("\n🚀 Starting frontend server...")
            process = dev_frontend()
            stream_output(process, "FRONTEND")

        elif command == "full":
            setup_backend()
            setup_frontend()

            print("\n🚀 Starting both servers...")

            backend_process = dev_backend()
            frontend_process = dev_frontend()

            # Stream output from both processes
            with ThreadPoolExecutor(max_workers=2) as executor:
                executor.submit(stream_output, backend_process, "BACKEND")
                executor.submit(stream_output, frontend_process, "FRONTEND")

                try:
                    # Wait for both processes
                    backend_process.wait()
                    frontend_process.wait()
                except KeyboardInterrupt:
                    print("\n⏹️  Shutting down servers...")
                    backend_process.terminate()
                    frontend_process.terminate()

        else:
            print(f"Unknown command: {command}")
            sys.exit(1)

    except KeyboardInterrupt:
        print("\n⏹️  Interrupted by user")
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
