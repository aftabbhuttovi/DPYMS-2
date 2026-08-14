var R = React.createElement;
var useState = React.useState, useEffect = React.useEffect, useMemo = React.useMemo, useCallback = React.useCallback, Fragment = React.Fragment;

// ====== ERROR BOUNDARY ======
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError:false }; }
  static getDerivedStateFromError(error) { return { hasError:true, error:error }; }
  componentDidCatch(error, info) { this.setState({errorInfo: info}); console.error("DPYMS Error Boundary:", error, info); }
  render() {
    if (this.state.hasError) {
      return R('div', { style:{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#0A192F", color:"#FFFFFF", fontFamily:"Inter, sans-serif", padding:24, textAlign:"center" } },
        R('h2', { style:{ color:"#F87171" } }, "DPYMS Application Recovery"),
        R('p', { style:{ maxWidth:500, margin:"12px 0 24px", color:"#94A3B8" } }, String(this.state.error) + " | " + String(this.state.errorInfo?this.state.errorInfo.componentStack:'')),
        R('button', { onClick:function(){ window.location.reload(); }, style:{ background:"#0E2A5E", color:"#FFF", border:"1px solid #38BDF8", borderRadius:8, padding:"12px 24px", fontWeight:700, cursor:"pointer" } }, "🔄 Reload Web App")
      );
    }
    return this.props.children;
  }
}

// ====== MOUNT ======
ReactDOM.createRoot(document.getElementById("root")).render(
  R(ErrorBoundary, null, R(App, null))
);