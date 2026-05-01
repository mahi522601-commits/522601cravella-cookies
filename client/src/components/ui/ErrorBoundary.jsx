import { Component } from "react";
import { MdRefresh } from "react-icons/md";
import Button from "./Button";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {}

  handleRetry = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="glass-panel max-w-lg p-8 text-center">
            <p className="section-kicker">Something went wrong</p>
            <h1 className="mt-3 text-3xl font-semibold">
              We hit a snag while loading Cravella.
            </h1>
            <p className="mt-4 text-brand-brown/75">
              Please retry. If the issue continues, refresh again after a moment.
            </p>
            <div className="mt-6 flex justify-center">
              <Button onClick={this.handleRetry} icon={<MdRefresh />}>
                Retry
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
