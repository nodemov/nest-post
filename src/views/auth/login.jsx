const React = require('react');
const Layout = require('../layout');

function Login({ error }) {
    return (
        <Layout title="Login" isAuthenticated={false}>
            <div style={{ maxWidth: '400px', margin: '3rem auto' }}>
                <div className="card">
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Admin Login</h2>

                    {error && (
                        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
                            {error}
                        </div>
                    )}

                    <form action="/v1/auth/login" method="POST">
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                required
                                autoFocus
                                style={{ width: '100%', padding: '0.75rem', border: '2px solid #ddd', borderRadius: '5px' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                style={{ width: '100%', padding: '0.75rem', border: '2px solid #ddd', borderRadius: '5px' }}
                            />
                        </div>

                        <button type="submit" className="btn" style={{ width: '100%', fontSize: '1rem' }}>
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

module.exports = Login;
