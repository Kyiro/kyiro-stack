import * as Ico from "preact-feather";
import Router from "preact-router";
import { Link } from "preact-router/match";
import { useEffect, useState } from "preact/hooks";
import type { RouterProps } from "preact-router";

function Home({}: RouterProps) {
    const [hydrated, setHydrated] = useState(false);
    
    useEffect(() => {
        setHydrated(true);
    }, []);
    
    return (
        <div>
            <p>Home</p>
            <p style={{
                color: hydrated ? "blue" : "red"
            }}>Hydrated: {hydrated ? "Yes" : "No"}</p>
            <p></p>
        </div>
    );
}

function About({}: RouterProps) {
    return (
        <div>
            <p>About</p>
        </div>
    );
}

export function App(props: { url?: string }) {
    // Use useEffect for client-side actions
    
    return (
        <div>
            <div>
                <Link activeClassName="active" href="/">
                    <Ico.Home/>
                </Link>
                <Link activeClassName="active" href="/about">
                    <Ico.User/>
                </Link>
            </div>
            <div class="site-content">
                <Router url={props.url}>
                    <Home path="/" default/>
                    <About path="/about"/>
                </Router>
            </div>
        </div>
    );
}
