import { Component, type ReactNode } from "react";

interface State { error: Error | null }

/** Si un écran plante, on l'explique au lieu d'afficher une page vide. */
export class ErrorBoundary extends Component<{ children: ReactNode; onReset: () => void }, State> {
  state: State = { error: null };
  static getDerivedStateFromError(error: Error): State {
    return { error };
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="page">
        <h1 className="serif page-title">Oups, cet écran a planté.</h1>
        <p className="muted small">Détail technique : {this.state.error.message}</p>
        <button className="btn btn-primary" onClick={() => { this.setState({ error: null }); this.props.onReset(); }}>
          Revenir à l'accueil
        </button>
      </div>
    );
  }
}
