import React from "react";
import Navbar from "../components/Navbar.jsx";
import "./Landing.css";

export default function Login() {

    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        alert('Funcionalidad de login pendiente de conectar a Supabase');
    };

    return (
        <div className="login-container">
            <div style={{ position: 'absolute', top: 0, width: '100%' }}><Navbar /></div>
            <div className="login-card">
                <h2>Iniciar Sesión</h2>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" className="btn-submit">Iniciar Sesión</button>
                </form>
            </div>
        </div>
    )
}