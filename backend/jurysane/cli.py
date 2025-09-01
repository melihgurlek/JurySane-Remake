"""Command line interface for JurySane."""

import asyncio
from typing import Optional

import typer
import uvicorn
from rich.console import Console
from rich.table import Table

from .config import settings
from .data.sample_cases import get_sample_case
from .services.trial_service import TrialService
from .models.trial import UserRole

app = typer.Typer(
    name="jurysane", help="JurySane: AI-Powered Legal Trial Simulation")
console = Console()


@app.command()
def serve(
    host: str = typer.Option("0.0.0.0", help="Host to bind to"),
    port: int = typer.Option(8000, help="Port to bind to"),
    reload: bool = typer.Option(False, help="Enable auto-reload"),
) -> None:
    """Start the JurySane API server."""
    console.print("[bold green]Starting JurySane API server...[/bold green]")
    console.print(f"Host: {host}")
    console.print(f"Port: {port}")
    console.print(f"Docs: http://{host}:{port}/docs")

    uvicorn.run(
        "jurysane.main:app",
        host=host,
        port=port,
        reload=reload,
    )


@app.command()
def demo() -> None:
    """Run a demo trial simulation."""
    console.print("[bold blue]JurySane Demo Trial[/bold blue]")

    async def run_demo():
        # Create trial service
        trial_service = TrialService()

        # Get sample case
        case = get_sample_case()
        console.print(f"[green]Case:[/green] {case.title}")
        console.print(f"[green]Charges:[/green] {', '.join(case.charges)}")

        # Create trial session
        session = await trial_service.create_trial_session(
            case=case,
            user_role=UserRole.DEFENSE,
        )

        console.print(f"[green]Session created:[/green] {session.id}")
        console.print(
            f"[green]You are playing:[/green] {session.user_role.value}")

        # Show participants
        table = Table(title="Trial Participants")
        table.add_column("Name", style="cyan")
        table.add_column("Role", style="magenta")
        table.add_column("Type", style="green")

        for participant in session.participants:
            participant_type = "AI" if participant.is_ai else "Human"
            table.add_row(participant.name,
                          participant.role.value, participant_type)

        console.print(table)

        # Show case facts
        console.print("\n[bold yellow]Case Facts:[/bold yellow]")
        console.print(case.case_facts)

        console.print(
            "\n[bold cyan]Demo completed! Use 'jurysane serve' to start the API server.[/bold cyan]")

    asyncio.run(run_demo())


@app.command()
def info() -> None:
    """Show information about JurySane."""
    console.print(
        "[bold blue]JurySane: AI-Powered Legal Trial Simulation[/bold blue]")
    console.print(f"Version: {settings.app_version}")
    console.print(f"Environment: {settings.environment}")

    # Show configuration
    table = Table(title="Configuration")
    table.add_column("Setting", style="cyan")
    table.add_column("Value", style="green")

    table.add_row("API Host", settings.api.host)
    table.add_row("API Port", str(settings.api.port))
    table.add_row("LLM Provider", settings.llm.provider)
    table.add_row("LLM Model", settings.llm.model_name)
    table.add_row("Debug Mode", str(settings.debug))

    console.print(table)


def main() -> None:
    """Main entry point."""
    app()


if __name__ == "__main__":
    main()
